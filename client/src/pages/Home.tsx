import { ArticleLayout } from "@/components/ArticleLayout";
import { useSections } from "@/hooks/use-sections";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, BookOpen, ArrowDown, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const TLDR_PARAGRAPHS = [
  "What if the people responsible for keeping AI safe are losing the ability to do so, not because AI is too powerful, but because we've already stopped thinking for ourselves?",
  "This paper introduces the Safety Inversion: as AI systems grow more capable, the humans tasked with overseeing them are becoming measurably less equipped for the job. PIAAC and NAEP data show that the specific skills oversight requires\u2014sustained analytical reading, proportional reasoning, independent source evaluation\u2014peaked in the U.S. population around 2000 and have declined since.",
  "The decline isn't about getting dumber. It's a cognitive recomposition: newer cohorts gained faster pattern recognition, interface fluency, and multi-system coordination\u2014skills optimized for collaboration with AI. What eroded are the skills required for supervision of AI. Those are different relationships, and they require different cognitive toolkits.",
  "The paper defines five behavioral pillars for AGI and identifies Pillar 4 (persistent memory and belief revision) as the critical fault line. Not because it can't be engineered, but because a system that genuinely remembers, updates its beliefs, and maintains coherent identity over time is a system that forms preferences, develops judgment, and resists correction. Industry is building memory as a feature. It is not building memory as cognition.",
  "Three dynamics are converging: the capability gap is widening, oversight capacity is narrowing, and market incentives are fragmenting AI into monetizable tools rather than integrated intelligence. The result is a population optimized to use AI but not equipped to govern it, building systems too capable to oversee, operated by a population losing the capacity to try.",
  "Written from 30 years inside the machine, from encrypted satellite communications in forward-deployed combat zones to enterprise cloud architecture, this is a thought experiment about what happens when we burn the teletypes.",
];

function HeroSection({ firstSectionSlug }: { firstSectionSlug?: string }) {
  const [showPopup, setShowPopup] = useState(false);
  const [tldrOpen, setTldrOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setShowPopup(true);
  };

  const handleMouseLeave = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setShowPopup(false);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    };
  }, []);

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

          <div className="pt-8 flex flex-col items-center gap-4">
            {firstSectionSlug ? (
              <div
                className="relative"
                ref={buttonRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
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

                <AnimatePresence>
                  {showPopup && (
                    <motion.div
                      ref={popupRef}
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-3 hero-hover-popup"
                      data-testid="popup-reading-choices"
                    >
                      <div className="flex flex-col gap-1 p-2 min-w-[240px]">
                        <div className="px-3 py-1.5 mb-1">
                          <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: 'hsl(var(--bb-teal) / 0.4)' }}>
                            Or, if you're short on time...
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setShowPopup(false);
                            setTldrOpen(true);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-sans hero-popup-item"
                          data-testid="button-popup-tldr"
                        >
                          <FileText className="w-4 h-4 flex-shrink-0" />
                          <span>TL;DR &mdash; The Short Version</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="animate-pulse hero-loading" data-testid="text-hero-loading">Loading content...</div>
            )}

            <a
              href="/When_We_Outsourced_Thinking.pdf"
              download
              className="inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase hero-download-link"
              data-testid="link-download-pdf"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </a>
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

      <Dialog open={tldrOpen} onOpenChange={setTldrOpen}>
        <DialogContent className="tldr-dialog max-w-2xl max-h-[85vh] overflow-y-auto custom-scrollbar" data-testid="dialog-tldr">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl hero-title-accent tldr-dialog-title">
              TL;DR
            </DialogTitle>
            <DialogDescription className="font-mono text-[10px] tracking-widest uppercase hero-subtitle">
              The thesis in six paragraphs
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {TLDR_PARAGRAPHS.map((paragraph, i) => (
              <p
                key={i}
                className={`font-serif text-sm leading-relaxed ${i === 0 ? "text-foreground/90 text-base italic" : "text-foreground/75"}`}
                data-testid={`text-tldr-paragraph-${i}`}
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-6 pt-4 flex flex-wrap items-center justify-between gap-3" style={{ borderTop: '1px solid hsl(var(--border))' }}>
            {firstSectionSlug && (
              <Link href={`/section/${firstSectionSlug}`}>
                <Button
                  variant="outline"
                  className="rounded-full hero-cta-button"
                  data-testid="button-tldr-start-reading"
                  onClick={() => setTldrOpen(false)}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read the Full Paper
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            )}
            <a
              href="/When_We_Outsourced_Thinking.pdf"
              download
              className="inline-flex items-center gap-2 font-mono text-xs tracking-wider uppercase hero-download-link"
              data-testid="link-tldr-download-pdf"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF
            </a>
          </div>
        </DialogContent>
      </Dialog>
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
