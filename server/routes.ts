import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

function stripMarkdown(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '')
    .replace(/^>\s+/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, '')
    .replace(/^---+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

const ttsCache = new Map<string, { audio: Buffer; timestamp: number }>();
const TTS_CACHE_TTL = 1000 * 60 * 60;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.sections.list.path, async (req, res) => {
    const sections = await storage.getSections();
    res.json(sections);
  });

  app.get(api.sections.get.path, async (req, res) => {
    const section = await storage.getSectionBySlug(req.params.slug);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }
    res.json(section);
  });

  app.post("/api/evidence", async (req, res) => {
    const schema = z.object({
      query: z.string().min(1).max(500),
      claimId: z.string().min(1),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid request", errors: parsed.error.issues });
    }

    const { query, claimId } = parsed.data;
    const apiKey = process.env.PERPLEXITY_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        message: "Evidence search not configured",
        claimId,
        fallback: true,
        searchUrl: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      });
    }

    try {
      const response = await fetch("https://api.perplexity.ai/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "sonar",
          messages: [
            {
              role: "system",
              content: "You are a research verification assistant. Provide concise, factual evidence with specific data points, dates, and sources. Focus on verifiable facts. Keep responses under 200 words. If you find evidence that contradicts the claim, state that clearly.",
            },
            {
              role: "user",
              content: `Verify this claim with evidence: ${query}`,
            },
          ],
          temperature: 0.1,
          top_p: 0.9,
          return_images: false,
          return_related_questions: false,
          stream: false,
          frequency_penalty: 1,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Perplexity API error:", response.status, errText);
        return res.status(502).json({
          message: "Evidence search failed",
          claimId,
          fallback: true,
          searchUrl: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
        });
      }

      const data = await response.json();
      const choice = data.choices?.[0]?.message?.content || "No evidence found.";
      const citations = data.citations || [];

      res.json({
        claimId,
        evidence: choice,
        citations,
        model: data.model,
        searchUrl: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      });
    } catch (err) {
      console.error("Evidence search error:", err);
      res.status(500).json({
        message: "Evidence search error",
        claimId,
        fallback: true,
        searchUrl: `https://duckduckgo.com/?q=${encodeURIComponent(query)}`,
      });
    }
  });

  app.post("/api/tts", async (req, res) => {
    const schema = z.object({
      slug: z.string().min(1),
    });

    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid request", errors: parsed.error.issues });
    }

    const { slug } = parsed.data;
    const apiKey = process.env.SPEECHIFY_API_KEY;

    if (!apiKey) {
      return res.status(503).json({ message: "Text-to-speech not configured" });
    }

    const cached = ttsCache.get(slug);
    if (cached && Date.now() - cached.timestamp < TTS_CACHE_TTL) {
      res.set("Content-Type", "audio/mpeg");
      res.set("X-TTS-Cached", "true");
      return res.send(cached.audio);
    }

    const section = await storage.getSectionBySlug(slug);
    if (!section) {
      return res.status(404).json({ message: "Section not found" });
    }

    const plainText = stripMarkdown(section.content);

    const maxChars = 19000;
    const inputText = plainText.length > maxChars
      ? plainText.slice(0, maxChars)
      : plainText;

    try {
      const chunkSize = 1900;
      const chunks: string[] = [];
      let remaining = inputText;
      while (remaining.length > 0) {
        if (remaining.length <= chunkSize) {
          chunks.push(remaining);
          break;
        }
        let splitAt = remaining.lastIndexOf('. ', chunkSize);
        if (splitAt === -1 || splitAt < chunkSize * 0.5) {
          splitAt = remaining.lastIndexOf(' ', chunkSize);
        }
        if (splitAt === -1) splitAt = chunkSize;
        chunks.push(remaining.slice(0, splitAt + 1));
        remaining = remaining.slice(splitAt + 1).trimStart();
      }

      const audioBuffers: Buffer[] = [];
      for (const chunk of chunks) {
        if (!chunk.trim()) continue;

        const chunkResponse = await fetch("https://api.sws.speechify.com/v1/audio/speech", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: chunk,
            voice_id: "george",
            audio_format: "mp3",
          }),
        });

        if (!chunkResponse.ok) {
          const errText = await chunkResponse.text();
          console.error("Speechify API error on chunk:", chunkResponse.status, errText);
          continue;
        }

        const chunkData = await chunkResponse.json();
        if (chunkData.audio_data) {
          audioBuffers.push(Buffer.from(chunkData.audio_data, "base64"));
        }
      }

      if (audioBuffers.length === 0) {
        return res.status(502).json({ message: "No audio data generated" });
      }

      const combinedBuffer = Buffer.concat(audioBuffers);

      ttsCache.set(slug, { audio: combinedBuffer, timestamp: Date.now() });

      res.set("Content-Type", "audio/mpeg");
      if (audioBuffers.length < chunks.filter(c => c.trim()).length) {
        res.set("X-TTS-Partial", "true");
      }
      res.send(combinedBuffer);
    } catch (err) {
      console.error("TTS error:", err);
      res.status(500).json({ message: "Text-to-speech error" });
    }
  });

  app.get("/api/tts/voices", async (_req, res) => {
    res.json({
      voices: [
        { id: "george", name: "George", description: "Professional male voice" },
        { id: "henry", name: "Henry", description: "Clear male voice" },
      ],
      default: "george",
    });
  });

  return httpServer;
}

export async function seedDatabase() {
  const existingSections = await storage.getSections();
  if (existingSections.length === 0) {
    console.log("No sections found. Run 'npx tsx server/parse-and-seed.ts' to seed the database.");
  }
}
