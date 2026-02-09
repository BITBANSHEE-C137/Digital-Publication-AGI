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

  return httpServer;
}

export async function seedDatabase() {
  const existingSections = await storage.getSections();
  if (existingSections.length === 0) {
    console.log("No sections found. Run 'npx tsx server/parse-and-seed.ts' to seed the database.");
  }
}
