import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  order: integer("order").notNull(),
  published: boolean("published").default(true),
});

// === BASE SCHEMAS ===
export const insertSectionSchema = createInsertSchema(sections).omit({ id: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Section = typeof sections.$inferSelect;
export type InsertSection = z.infer<typeof insertSectionSchema>;

export type SectionResponse = Section;
export type SectionsListResponse = Section[];
