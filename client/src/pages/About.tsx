import { ArticleLayout } from "@/components/ArticleLayout";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, ExternalLink } from "lucide-react";

export default function About() {
  return (
    <ArticleLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto"
      >
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase text-muted-foreground/60 hover:text-foreground/80 transition-colors mb-12" data-testid="link-back-home">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>

        <h1 className="font-display text-4xl md:text-5xl font-bold mb-8 text-foreground/90" data-testid="text-about-title">
          About This Project
        </h1>

        <div className="space-y-8 font-serif text-base leading-relaxed text-foreground/75">
          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground/85" data-testid="text-about-paper-heading">The Paper</h2>
            <p>
              <em>When We Outsourced Thinking: AGI, Oversight, and the Business of Artificial Intelligence</em> is a long-form thought experiment that examines the convergence of two trends: accelerating AI capability and declining human capacity for cognitive oversight.
            </p>
            <p>
              Drawing on PIAAC, NAEP, and NAAL data, the paper documents sustained declines in foundational literacy and numeracy among U.S. adults and proposes a five-pillar operational definition of Artificial General Intelligence. It introduces the concept of the <strong>Safety Inversion</strong>: a condition in which the systems most requiring human oversight are increasingly evaluated by populations measurably less equipped to provide it.
            </p>
          </section>

          <div className="w-16 h-px bg-border/40 mx-auto" />

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground/85" data-testid="text-about-author-heading">The Author</h2>
            <p>
              <strong>Glenn Rowe</strong> has spent 30 years building and securing information systems, from encrypted satellite communications in forward-deployed combat zones to enterprise cloud architecture. This paper is written from inside the machine, not about it.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://www.linkedin.com/in/gwrowe/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-accent/70 hover:text-accent transition-colors"
                data-testid="link-about-linkedin"
              >
                LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="https://github.com/BITBANSHEE-C137"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-accent/70 hover:text-accent transition-colors"
                data-testid="link-about-github"
              >
                GitHub <ExternalLink className="w-3 h-3" />
              </a>
              <a
                href="mailto:glenn@siliconstrategy.ai"
                className="inline-flex items-center gap-1.5 font-mono text-xs tracking-wider uppercase text-accent/70 hover:text-accent transition-colors"
                data-testid="link-about-email"
              >
                glenn@siliconstrategy.ai
              </a>
            </div>
          </section>

          <div className="w-16 h-px bg-border/40 mx-auto" />

          <section className="space-y-4">
            <h2 className="font-display text-xl font-semibold text-foreground/85" data-testid="text-about-site-heading">The Site</h2>
            <p>
              This website presents the paper as an interactive reading experience. Features include a navigable table of contents, inline glossary annotations for key terms, live claim verification powered by Perplexity, text-to-speech audio playback via Speechify, and a downloadable PDF in SSRN format.
            </p>
            <p>
              The site was formatted and published by an AI system. The content is entirely human-authored.
            </p>
          </section>

          <div className="w-16 h-px bg-border/40 mx-auto" />

          <section className="space-y-3">
            <h2 className="font-display text-xl font-semibold text-foreground/85" data-testid="text-about-rights-heading">Rights</h2>
            <p className="text-sm text-foreground/60">
              All rights reserved. Content and code are the intellectual property of the author.
            </p>
          </section>
        </div>
      </motion.div>
    </ArticleLayout>
  );
}
