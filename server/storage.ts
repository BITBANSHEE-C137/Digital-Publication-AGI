import { db } from "./db";
import { sections, type Section } from "@shared/schema";
import { eq, asc, or, ilike, and } from "drizzle-orm";

export interface IStorage {
  getSections(): Promise<Section[]>;
  getSectionBySlug(slug: string): Promise<Section | undefined>;
  searchSections(query: string): Promise<Section[]>;
}

export class DatabaseStorage implements IStorage {
  async getSections(): Promise<Section[]> {
    return await db.select().from(sections).orderBy(asc(sections.order));
  }

  async getSectionBySlug(slug: string): Promise<Section | undefined> {
    const [section] = await db.select().from(sections).where(eq(sections.slug, slug));
    return section;
  }

  async searchSections(query: string): Promise<Section[]> {
    const pattern = `%${query}%`;
    return await db
      .select()
      .from(sections)
      .where(and(
        eq(sections.published, true),
        or(ilike(sections.title, pattern), ilike(sections.content, pattern))
      ))
      .orderBy(asc(sections.order));
  }
}

export const storage = new DatabaseStorage();
