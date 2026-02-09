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

// Seed function to populate the database with content from the provided paper
export async function seedDatabase() {
  const existingSections = await storage.getSections();
  if (existingSections.length === 0) {
    const { db } = await import("./db");
    const { sections } = await import("@shared/schema");
    
    const seedData = [
      {
        slug: "intro",
        title: "When We Outsourced Thinking",
        content: `**A Thought Experiment from 30 Years in the Machine**
*Glenn Rowe*

## A Note on Method

This started as a series of conversations with AI, specifically ChatGPT (versions 4o through 5.2), Claude (versions 3.5 through Opus 4.6), Grok, and Gemini, about things I'd been watching for three decades. The questions were mine. The research assistance was theirs. Every claim that follows has been cross-referenced against primary sources and subjected to adversarial review across competing AI systems. AI-assisted adversarial review was used to surface weaknesses, not to establish truth.

I also turned the AI systems against each other, and against themselves. One of the findings in this process was that AI conversational partners have a sycophancy problem. They validate sophisticated-sounding frameworks enthusiastically, building layers of apparent rigor on foundations they never challenged. To counter this, I used ChatGPT, Claude, Grok, and Gemini to adversarially review each other's outputs, specifically looking for unsupported claims, circular reasoning, and cognitive biases.

And I should be direct about something else. This paper reads better than I write. The prose is more polished than how I naturally convey my thoughts, and that's because AI systems are very good at taking rough ideas and making them sound precise, structured, and authoritative. That should concern you, because this paper is a textbook example of its own thesis. The pattern it describes, high expressiveness masking the layer underneath, is exactly what you're reading right now.

I'm aware of the irony. This paper about the limitations of AI was researched with AI, drafted with AI, and reviewed by four competing AI systems. It is, to borrow from a different kind of ensemble cast, a dude playing a dude disguised as another dude. Someone will run this through a detector, flag it as AI-generated, and dismiss it on that basis. I expect that. But here's the thing: if the argument is that AI will increasingly produce the work we consume, then the relevant question isn't "did an AI write this?" The relevant question is "is it true?"`,
        order: 1
      },
      {
        slug: "background",
        title: "The View from the Field",
        content: `I've spent my career building, migrating, and securing enterprise systems, from encrypted satellite communications in forward-deployed combat zones to cloud architectures serving Fortune 500 enterprises. I don't come at this from a research lab. I come at it from the field, where systems either work under pressure or they don't, and where the gap between what a system is supposed to do and what it actually does is measured in consequences, not abstractions.

In 1994, during Exercise Bright Star 95 at Cairo West, Egypt, the team I was part of included elements of the 224th JCSS (GAANG), the 290th JCSS (FLANG), and the Joint Communications Support Element (JCSE). The mission was what we would now call digital transformation, before anyone used that term: send email over both NIPR and SIPR networks back to the continental United States, be the first team to do so from a forward-deployed operational environment, and provide internet access.

That experience sits in my head not as nostalgia, but as a reference point. I've watched foundational technology arrive, get fragmented into products, and either recompose into something greater or get permanently reduced to what someone could sell.

This paper calls out a personal fear: that we are innovating ourselves backward. The systems are getting smarter. The population is losing the ability to check them. And the market ensures nobody stops to fix either problem. These three dynamics are not separate concerns. They are a single feedback loop, and the loop is accelerating. Every foundational technology cycle in history has faced a version of this question: does the tool serve the people, or do the people become dependent on the tool?`,
        order: 2
      },
      {
        slug: "agi-pillars",
        title: "I. What We're Actually Talking About When We Talk About AGI",
        content: `The term "Artificial General Intelligence" gets used loosely. In industry, it's a marketing horizon. Always five years away, useful for fundraising, rarely defined with enough precision to be falsifiable. In research, it's a moving target. In public discourse, it's science fiction.

None of that is useful. So here's my attempt at an operational definition: five requirements that must be met simultaneously before a system earns the label.

**Pillar 1: Generality.** The system must demonstrate competence across cognitive domains, not just the ones it was trained on. It generates novel tasks and solves them. Benchmark gaming is excluded by design.

**Pillar 2: Transfer Learning.** It adapts to new tools, rules, and environments quickly, with minimal retraining. What it learned in one domain applies meaningfully in another.

**Pillar 3: Long-Horizon Agency.** It pursues goals autonomously over hours, days, or longer. It plans, monitors its own progress, detects failure, recovers, and adjusts without a human in the loop at every step.

**Pillar 4: Persistent Memory and Self-Updating World Model.** It retains experience across interactions. It updates its beliefs when confronted with new evidence. It detects contradictions in its own knowledge and resolves them. It doesn't make the same mistake twice for the same reason.

**Pillar 5: Human-Baseline Performance with Calibration.** It meets or exceeds a defined human reference group across the above capabilities, with measurable reliability. When it doesn't know something, it knows it doesn't know it.

These five pillars are behavioral requirements, not architectural prescriptions. The *how* a system satisfies them is to be determined, but *whether* it does, demonstrably and under adversarial conditions, is an absolute requirement.

### The AGI Fault Line

Current frontier models satisfy portions of Pillars 1, 2, and 5 within bounded contexts. None come close on Pillars 3 and 4. And Pillar 4 is the one that matters most, because it sits at the exact line between advanced AI and AGI. Everything else is optimization. This one is architectural. If a system cannot change its mind when proven wrong, it is not an intelligence. It is a script.

Every major AI company now ships some form of persistent memory... But look at what's actually being shipped: preference storage, conversation recall, personalization features. Memory as product, designed to make the tool stickier.

Industry is building memory as a feature. It is not building memory as cognition. The distinction is the entire difference between a tool and an intelligence.`,
        order: 3
      },
      {
        slug: "skills",
        title: "II. The Skills You Need to Oversee What You're Building",
        content: `Here's the part that gets less attention than it should: even if we build AGI, the population that would need to oversee it is losing the specific cognitive capacities required to do so.

This isn't a claim about intelligence declining. Intelligence is broad, contested, and not particularly useful as a concept here. What I'm talking about is narrower and measurable: the ability to independently verify reality using text and numbers.

That ability depends on two foundational skills operating together.

**Literacy.** Not just reading words, but extracting meaning, evaluating claims, and detecting rhetoric. Functional literacy, not mechanical decoding.

**Numeracy.** Not math proficiency in an academic sense, but the ability to reason about quantities, proportions, probabilities, and scale in context. To look at a statistic and ask "out of how many?" To distinguish a rate from a count. To recognize when a chart has been built to mislead.

These two skills are the load-bearing walls. Without them, what people call "critical thinking" has no inputs to operate on.

### The Integration Layer

I think of it as a stack. Similar to the OSI stack (it’s what I’m familiar with) At the base, the cognitive substrate: neurological capacity, clinical. Above that, literacy: the ability to parse symbols into meaning. Above that, numeracy: the ability to parse quantities into meaning.

And above both: what I call the *integration layer*, the capacity to combine text-based claims and number-based evidence into coherent judgment. To cross-reference. To detect when what someone says doesn't match what the data shows. To revise a belief when new evidence contradicts it.`,
        order: 4
      }
    ];

    await db.insert(sections).values(seedData);
    console.log("Database seeded successfully");
  }
}
