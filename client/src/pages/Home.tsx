import { ArticleLayout } from "@/components/ArticleLayout";
import { useSections } from "@/hooks/use-sections";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, BookOpen, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

function HeroSection({ firstSectionSlug }: { firstSectionSlug?: string }) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden hero-dark-section">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
        style={{ backgroundImage: "url('/images/bitbanshee-bg.png')" }}
        data-testid="hero-background"
      />

      <div className="absolute inset-0 hero-gradient-overlay" />

      <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="space-y-4">
            <span
              className="font-mono text-xs tracking-[0.3em] uppercase block hero-subtitle"
              data-testid="text-subtitle"
            >
              A Thought Experiment from 30 Years in the Machine
            </span>
            <h1
              className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight hero-title"
              data-testid="text-main-title"
            >
              When We <br />
              Outsourced <br />
              <span className="italic font-serif text-6xl md:text-7xl lg:text-8xl hero-title-accent">
                Thinking
              </span>
            </h1>
          </div>

          <div className="w-24 h-px mx-auto hero-divider" />

          <p
            className="font-serif text-lg md:text-xl leading-relaxed max-w-lg mx-auto hero-description"
            data-testid="text-description"
          >
            AGI, Oversight, and the Business of Artificial Intelligence
          </p>

          <div className="pt-2">
            <p className="font-sans font-medium text-sm tracking-[0.2em] uppercase hero-author" data-testid="text-author">
              By Glenn Rowe
            </p>
          </div>

          <div className="pt-8">
            {firstSectionSlug ? (
              <Link href={`/section/${firstSectionSlug}`}>
                <Button
                  variant="outline"
                  className="rounded-full hero-cta-button"
                  data-testid="button-start-reading"
                >
                  <BookOpen className="w-5 h-5 mr-3" />
                  Start Reading
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            ) : (
              <div className="animate-pulse hero-loading" data-testid="text-hero-loading">Loading content...</div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <ArrowDown className="w-5 h-5 animate-bounce hero-scroll-hint" data-testid="icon-scroll-hint" />
        </motion.div>
      </div>
    </div>
  );
}

export default function Home() {
  const { data: sections } = useSections();
  const sortedSections = sections?.sort((a, b) => a.order - b.order) || [];
  const firstSection = sortedSections[0];

  const hero = <HeroSection firstSectionSlug={firstSection?.slug} />;

  return (
    <ArticleLayout heroContent={hero}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <div className="mb-12">
          <span className="font-mono text-[10px] tracking-widest uppercase text-accent/50 block mb-3" data-testid="text-toc-label">
            TABLE OF CONTENTS
          </span>
          <div className="w-12 h-px bg-accent/30" />
        </div>

        <div className="space-y-1">
          {sortedSections
            .filter(s => !["sources", "appendix"].includes(s.slug))
            .map((section) => (
            <Link
              key={section.id}
              href={`/section/${section.slug}`}
              className="flex items-baseline gap-4 py-3 px-4 rounded-md hover-elevate"
              data-testid={`link-toc-${section.slug}`}
            >
              <span className="font-mono text-xs text-accent/40 w-6 flex-shrink-0 text-right">
                {String(section.order).padStart(2, '0')}
              </span>
              <span className="font-display text-lg text-foreground/85">
                {section.title}
              </span>
            </Link>
          ))}

          {sortedSections.filter(s => ["sources", "appendix"].includes(s.slug)).length > 0 && (
            <>
              <div className="section-divider my-4" data-label="REFERENCE" />
              {sortedSections
                .filter(s => ["sources", "appendix"].includes(s.slug))
                .map((section) => (
                <Link
                  key={section.id}
                  href={`/section/${section.slug}`}
                  className="flex items-baseline gap-4 py-3 px-4 rounded-md hover-elevate"
                  data-testid={`link-toc-${section.slug}`}
                >
                  <span className="font-mono text-xs text-muted-foreground/40 w-6 flex-shrink-0 text-right">
                    --
                  </span>
                  <span className="font-display text-base text-muted-foreground/70">
                    {section.title}
                  </span>
                </Link>
              ))}
            </>
          )}
        </div>

        <div className="mt-16 data-viz">
          <div className="space-y-2 text-center">
            <p className="font-mono text-[10px] text-accent/40 tracking-widest uppercase">
              INTERACTIVE FEATURES
            </p>
            <p className="font-serif text-sm text-muted-foreground/60 leading-relaxed max-w-md mx-auto">
              Dotted underlines mark key terms. 
              <span className="verifiable-claim" style={{ animation: 'none', cursor: 'default' }}>Glowing underlines</span> mark 
              verifiable claims you can click to search for live evidence.
            </p>
          </div>
        </div>

      </motion.div>
    </ArticleLayout>
  );
}
