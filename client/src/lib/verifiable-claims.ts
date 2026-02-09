export interface VerifiableClaim {
  id: string;
  textMatch: string;
  searchQuery: string;
  category: "statistic" | "historical" | "technical" | "research";
  section: string;
}

export const verifiableClaims: VerifiableClaim[] = [
  {
    id: "piaac-literacy-decline",
    textMatch: "literacy dropped 12 points",
    searchQuery: "OECD PIAAC 2023 US adult literacy scores decline results",
    category: "statistic",
    section: "skills",
  },
  {
    id: "piaac-numeracy-decline",
    textMatch: "numeracy dropped 7 points",
    searchQuery: "PIAAC 2023 US adult numeracy scores decline compared to 2017",
    category: "statistic",
    section: "skills",
  },
  {
    id: "piaac-level1-literacy",
    textMatch: "increased from 19% to 28% in literacy",
    searchQuery: "PIAAC 2023 percentage US adults scoring Level 1 or below literacy numeracy",
    category: "statistic",
    section: "skills",
  },
  {
    id: "flynn-reversal",
    textMatch: "Bratsberg and Rogeberg",
    searchQuery: "Bratsberg Rogeberg 2018 Flynn effect reversal environmentally caused PNAS",
    category: "research",
    section: "skills",
  },
  {
    id: "council-nicaea",
    textMatch: "In 325 AD, the Council of Nicaea",
    searchQuery: "Council of Nicaea 325 AD purpose Nicene Creed orthodoxy vs biblical canon",
    category: "historical",
    section: "belief-ledger",
  },
  {
    id: "constitutional-ai",
    textMatch: "Anthropic's Constitutional AI",
    searchQuery: "Anthropic Constitutional AI how it works RLAIF training time principles",
    category: "technical",
    section: "safety",
  },
  {
    id: "gps-fragmentation",
    textMatch: "GPS: military capability, then dedicated Garmin and TomTom units",
    searchQuery: "GPS history military origin to smartphone integration standalone GPS market collapse",
    category: "historical",
    section: "phase-transitions",
  },
  {
    id: "chatgpt-memory",
    textMatch: "ChatGPT offers conversation memory",
    searchQuery: "ChatGPT memory feature 2024 persistent conversation memory how it works",
    category: "technical",
    section: "belief-ledger",
  },
  {
    id: "printing-press-reformation",
    textMatch: "The printing press broke that enforcement monopoly",
    searchQuery: "printing press Protestant Reformation access to scripture individual interpretation",
    category: "historical",
    section: "belief-ledger",
  },
  {
    id: "soc2-compliance",
    textMatch: "SOC 2 Type II requires demonstrable consistency in system behavior",
    searchQuery: "SOC 2 Type II audit requirements consistent system behavior data handling",
    category: "technical",
    section: "phase-transitions",
  },
  {
    id: "gigerenzer-risk",
    textMatch: "Gigerenzer",
    searchQuery: "Gerd Gigerenzer risk literacy numeracy decision making research",
    category: "research",
    section: "skills",
  },
  {
    id: "kahneman-system1",
    textMatch: "Kahneman",
    searchQuery: "Daniel Kahneman System 1 System 2 thinking fast and slow dual process",
    category: "research",
    section: "skills",
  },
  {
    id: "electricity-fragmentation",
    textMatch: "Electricity: experimental novelty, then proprietary local grids",
    searchQuery: "history electricity standardization proprietary local grids to national grid",
    category: "historical",
    section: "phase-transitions",
  },
  {
    id: "aaai-2025",
    textMatch: "2025 AAAI Presidential Address",
    searchQuery: "AAAI 2025 Presidential Address AI scaling limitations current approaches",
    category: "research",
    section: "agi-pillars",
  },
  {
    id: "bright-star-95",
    textMatch: "Exercise Bright Star 95 at Cairo West, Egypt",
    searchQuery: "Exercise Bright Star 95 1994 Cairo West Egypt US military joint exercise",
    category: "historical",
    section: "background",
  },
  {
    id: "phronesis-aristotle",
    textMatch: "phronesis, in Aristotle's framework, requires lived experience",
    searchQuery: "Aristotle phronesis practical wisdom lived experience habituation requirements",
    category: "research",
    section: "safety",
  },
  {
    id: "naal-literacy",
    textMatch: "National Assessment of Adult Literacy",
    searchQuery: "NCES National Assessment Adult Literacy NAAL 1992 2003 results United States",
    category: "statistic",
    section: "skills",
  },
  {
    id: "stanovich-rationality",
    textMatch: "Stanovich",
    searchQuery: "Keith Stanovich rationality reflective mind individual differences reasoning",
    category: "research",
    section: "skills",
  },
];

export function findClaimInText(text: string): VerifiableClaim | null {
  for (const claim of verifiableClaims) {
    if (text.toLowerCase().includes(claim.textMatch.toLowerCase())) {
      return claim;
    }
  }
  return null;
}

export function findAllClaimsInText(text: string): { claim: VerifiableClaim; index: number }[] {
  const results: { claim: VerifiableClaim; index: number }[] = [];
  for (const claim of verifiableClaims) {
    const idx = text.toLowerCase().indexOf(claim.textMatch.toLowerCase());
    if (idx !== -1) {
      results.push({ claim, index: idx });
    }
  }
  return results.sort((a, b) => a.index - b.index);
}
