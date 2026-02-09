import { db } from "./db";
import { sections, type Section } from "@shared/schema";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  getSections(): Promise<Section[]>;
  getSectionBySlug(slug: string): Promise<Section | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getSections(): Promise<Section[]> {
    return await db.select().from(sections).orderBy(asc(sections.order));
  }

  async getSectionBySlug(slug: string): Promise<Section | undefined> {
    const [section] = await db.select().from(sections).where(eq(sections.slug, slug));
    return section;
  }
}

export const storage = new DatabaseStorage();
