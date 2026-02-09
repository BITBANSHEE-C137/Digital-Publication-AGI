import mammoth from "mammoth";
import fs from "fs";
import path from "path";
import { db } from "./db";
import { sections } from "@shared/schema";

interface SectionData {
  slug: string;
  title: string;
  content: string;
  order: number;
}

function unescapeMarkdown(text: string): string {
  return text
    .replace(/\\([#*._\-\(\)\[\]{}!`~>|\\])/g, '$1')
    .replace(/__(.+?)__/g, '**$1**');
}

function cleanupMarkdown(text: string): string {
  let result = text;
  result = result.replace(/^\*\*(#{1,3} .+?)\*\*$/gm, '$1');
  return result;
}

async function parseDocx(): Promise<string> {
  const filePath = path.join(process.cwd(), "attached_assets/When_We_Outsourced_Thinking_v2_1770657842106.docx");
  const buffer = fs.readFileSync(filePath);
  const result = await mammoth.convertToMarkdown({ buffer });
  return unescapeMarkdown(result.value);
}

function splitIntoSections(markdown: string): SectionData[] {
  const sectionMarkers = [
    { pattern: /^\*\*## I\. What We.re Actually Talking About When We Talk About AGI\*\*$/m, slug: "agi-pillars", title: "I. What We're Actually Talking About When We Talk About AGI" },
    { pattern: /^\*\*## II\. The Skills You Need to Oversee What You.re Building\*\*$/m, slug: "skills", title: "II. The Skills You Need to Oversee What You're Building" },
    { pattern: /^\*\*## III\. How Intelligence Gets Sold\*\*$/m, slug: "phase-transitions", title: "III. How Intelligence Gets Sold" },
    { pattern: /^\*\*## IV\. Who Controls the Belief Ledger\*\*$/m, slug: "belief-ledger", title: "IV. Who Controls the Belief Ledger" },
    { pattern: /^\*\*## V\. What Current .Safety. Actually Does\*\*$/m, slug: "safety", title: 'V. What Current "Safety" Actually Does' },
    { pattern: /^\*\*## VI\. Where This Leaves Us\*\*$/m, slug: "convergence", title: "VI. Where This Leaves Us" },
    { pattern: /^\*\*## VII\. The Question That Matters\*\*$/m, slug: "conclusion", title: "VII. The Question That Matters" },
  ];

  const positions: { slug: string; title: string; start: number; end?: number }[] = [];
  
  for (const marker of sectionMarkers) {
    const match = markdown.match(marker.pattern);
    if (match && match.index !== undefined) {
      positions.push({ slug: marker.slug, title: marker.title, start: match.index });
    } else {
      console.warn(`WARNING: Could not find section marker for "${marker.title}"`);
    }
  }
  
  positions.sort((a, b) => a.start - b.start);

  const sourcesMatch = markdown.match(/^\*\*Sources and Evidentiary Basis\*\*$/m);
  const sourcesStart = sourcesMatch?.index ?? markdown.length;

  const result: SectionData[] = [];
  const firstSectionStart = positions.length > 0 ? positions[0].start : sourcesStart;
  
  const preContent = markdown.substring(0, firstSectionStart).trim();
  
  const bgMatch = preContent.match(/I've spent my career building, migrating/);
  if (bgMatch && bgMatch.index !== undefined) {
    const introContent = preContent.substring(0, bgMatch.index).trim()
      .replace(/^---+\s*$/gm, '').trim();
    const bgContent = preContent.substring(bgMatch.index).trim()
      .replace(/^---+\s*$/gm, '').trim();
    
    result.push({ slug: "intro", title: "When We Outsourced Thinking", content: cleanupMarkdown(introContent), order: 1 });
    result.push({ slug: "background", title: "The View from the Field", content: cleanupMarkdown(bgContent), order: 2 });
  } else {
    result.push({ slug: "intro", title: "When We Outsourced Thinking", content: preContent, order: 1 });
  }

  for (let i = 0; i < positions.length; i++) {
    const current = positions[i];
    const nextStart = i + 1 < positions.length ? positions[i + 1].start : sourcesStart;
    let content = markdown.substring(current.start, nextStart).trim();
    
    const firstNewline = content.indexOf('\n');
    if (firstNewline > 0) {
      content = content.substring(firstNewline + 1).trim();
    }
    content = content.replace(/^---+\s*$/gm, '').trim();
    
    result.push({
      slug: current.slug,
      title: current.title,
      content: cleanupMarkdown(content),
      order: result.length + 1
    });
  }

  if (sourcesStart < markdown.length) {
    let sourcesContent = markdown.substring(sourcesStart).trim();
    
    const appendixMatch = sourcesContent.match(/^\*\*Appendix: Evidence and Provenance\*\*$/m);
    if (appendixMatch && appendixMatch.index !== undefined) {
      const sourcesOnly = sourcesContent.substring(0, appendixMatch.index).trim()
        .replace(/^\*\*Sources and Evidentiary Basis\*\*\n?/, '').trim();
      const appendixOnly = sourcesContent.substring(appendixMatch.index).trim()
        .replace(/^\*\*Appendix: Evidence and Provenance\*\*\n?/, '').trim();
      
      result.push({ slug: "sources", title: "Sources and Evidentiary Basis", content: cleanupMarkdown(sourcesOnly), order: result.length + 1 });
      result.push({ slug: "appendix", title: "Appendix: Evidence and Provenance", content: cleanupMarkdown(appendixOnly), order: result.length + 1 });
    } else {
      sourcesContent = sourcesContent.replace(/^\*\*Sources and Evidentiary Basis\*\*\n?/, '').trim();
      result.push({ slug: "sources", title: "Sources and Evidentiary Basis", content: cleanupMarkdown(sourcesContent), order: result.length + 1 });
    }
  }

  return result;
}

async function seed() {
  console.log("Parsing document...");
  const markdown = await parseDocx();
  console.log(`Document parsed: ${markdown.length} characters`);
  
  fs.writeFileSync("/tmp/parsed_document.md", markdown);
  console.log("Written parsed markdown to /tmp/parsed_document.md");
  
  const sectionData = splitIntoSections(markdown);
  console.log(`\nFound ${sectionData.length} sections:`);
  for (const s of sectionData) {
    console.log(`  [${s.order}] ${s.slug}: "${s.title}" (${s.content.length} chars)`);
    console.log(`    First 100: ${s.content.substring(0, 100).replace(/\n/g, ' ')}...`);
  }
  
  console.log("\nClearing existing sections...");
  await db.delete(sections);
  console.log("Inserting into database...");
  await db.insert(sections).values(sectionData);
  console.log("Database seeded successfully!");
  
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed failed:", err);
  process.exit(1);
});
