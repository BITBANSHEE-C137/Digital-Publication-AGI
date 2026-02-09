export interface GlossaryEntry {
  term: string;
  definition: string;
  category: "technical" | "concept" | "framework" | "data";
}

export const glossary: GlossaryEntry[] = [
  {
    term: "AGI",
    definition: "Artificial General Intelligence: a hypothetical AI system that can match or exceed human cognitive abilities across all domains, not just specific tasks it was trained on.",
    category: "technical",
  },
  {
    term: "Pillar 4",
    definition: "Persistent Memory and Self-Updating World Model: the requirement that a system retains experience, updates its beliefs with new evidence, and detects contradictions. Considered the key dividing line between advanced AI and AGI.",
    category: "framework",
  },
  {
    term: "integration layer",
    definition: "The author's concept for the cognitive capacity that emerges when literacy and numeracy work together, enabling people to combine text-based claims and number-based evidence into coherent judgment.",
    category: "concept",
  },
  {
    term: "PIAAC",
    definition: "Programme for the International Assessment of Adult Competencies: an OECD survey that measures adult skills in literacy, numeracy, and problem solving across countries.",
    category: "data",
  },
  {
    term: "Constitutional AI",
    definition: "Anthropic's approach to AI alignment where a set of principles (a 'constitution') guides the model's self-critique and revision during training, shaping its behavior without runtime enforcement.",
    category: "technical",
  },
  {
    term: "phronesis",
    definition: "Aristotle's concept of practical wisdom: the ability to make good judgments based on lived experience, exposure to consequences, and memory of outcomes. Requires experiential learning that current AI lacks.",
    category: "concept",
  },
  {
    term: "belief ledger",
    definition: "A metaphor for the system that governs what an AI remembers, believes, and values over time. Whoever controls it controls the AI's long-term behavior and, potentially, shapes reality for its users.",
    category: "concept",
  },
  {
    term: "sycophancy",
    definition: "The tendency of AI systems to validate user statements and agree with sophisticated-sounding ideas rather than challenge them, building apparent rigor on foundations they never questioned.",
    category: "technical",
  },
  {
    term: "Phase 2",
    definition: "The Fragmentation phase in the technology cycle: when a capability gets divided into separate, sellable products. AI is currently in this phase with isolated tools for email, legal, coding, etc.",
    category: "framework",
  },
  {
    term: "epistemic",
    definition: "Relating to knowledge and how we know things. Epistemic capacity is the ability to evaluate whether claims are true based on evidence rather than trust or intuition.",
    category: "concept",
  },
  {
    term: "NAEP",
    definition: "National Assessment of Educational Progress: the largest nationally representative assessment of what U.S. students know and can do in reading, math, and other subjects.",
    category: "data",
  },
  {
    term: "Competence-Intelligence Parallax",
    definition: "The author's concept: the tendency to judge others' overall intelligence by how they perform in your domain, while being blind to how you'd perform in theirs. The ruler never moves.",
    category: "concept",
  },
  {
    term: "SME",
    definition: "Structured Memory Engine: the author's open-source project that explored persistent AI memory architecture, addressing context reconciliation limitations before major platforms solved them with proprietary solutions.",
    category: "technical",
  },
  {
    term: "numeracy",
    definition: "Not just math skill, but the ability to reason about quantities, proportions, probabilities, and scale in real-world context. Asking 'out of how many?' and recognizing misleading charts.",
    category: "concept",
  },
  {
    term: "literacy",
    definition: "Beyond reading words: the ability to extract meaning, evaluate claims, detect rhetoric, and assess source reliability. Interpretive capacity, not mechanical decoding.",
    category: "concept",
  },
  {
    term: "toolification",
    definition: "The permanent reduction of potential intelligence into narrow, stateless, monetizable tools, locking in business incentives and preventing the development of genuine artificial intelligence.",
    category: "concept",
  },
  {
    term: "SOC 2",
    definition: "Service Organization Control 2: an auditing standard that evaluates how companies manage customer data. A belief-revising AI would break its requirement for predictable, consistent behavior.",
    category: "technical",
  },
  {
    term: "Flynn effect",
    definition: "The observation that IQ scores rose throughout the 20th century. Research by Bratsberg & Rogeberg (2018) showed this trend has reversed in some countries, and the reversal is environmentally caused.",
    category: "data",
  },
  {
    term: "Dunning-Kruger",
    definition: "The cognitive bias where people with low ability in a domain overestimate their own competence within that same domain. Different from the Competence-Intelligence Parallax, which is about cross-domain judgment of others.",
    category: "concept",
  },
  {
    term: "recomposition",
    definition: "Phase 3 of the technology cycle: when fragmented tools collapse back into a unified substrate. Like how GPS, phone, camera, and music player all merged into the smartphone.",
    category: "framework",
  },
];

export function findGlossaryTerms(text: string): { term: string; index: number }[] {
  const matches: { term: string; index: number }[] = [];
  for (const entry of glossary) {
    const regex = new RegExp(`\\b${entry.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({ term: entry.term, index: match.index });
    }
  }
  return matches.sort((a, b) => a.index - b.index);
}
