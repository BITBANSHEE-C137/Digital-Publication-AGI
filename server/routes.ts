import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

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

  return httpServer;
}

export async function seedDatabase() {
  const existingSections = await storage.getSections();
  if (existingSections.length === 0) {
    console.log("No sections found. Run 'npx tsx server/parse-and-seed.ts' to seed the database.");
  }
}
