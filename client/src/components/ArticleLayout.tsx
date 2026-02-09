import { FloatingNav } from "./FloatingNav";
import { ReadingProgress } from "./ReadingProgress";
import { GlossaryPanel } from "./GlossaryTooltip";
import { AudioPlayer } from "./AudioPlayer";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";

interface ArticleLayoutProps {
  children: ReactNode;
  prevSection?: { slug: string; title: string } | null;
  nextSection?: { slug: string; title: string } | null;
  heroContent?: ReactNode;
  currentSlug?: string;
  currentTitle?: string;
}

export function ArticleLayout({ children, prevSection, nextSection, heroContent, currentSlug, currentTitle }: ArticleLayoutProps) {
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [audioOpen, setAudioOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground breathing-bg">
      <div className="scanline-overlay" />
      <ReadingProgress />
      <FloatingNav
        onOpenGlossary={() => setGlossaryOpen(true)}
        onListenClick={currentSlug ? () => setAudioOpen(true) : undefined}
      />

      {heroContent && (
        <div className="relative">
          {heroContent}
        </div>
      )}

      <main className="relative z-10 min-h-screen pt-14">
        <div className="max-w-3xl mx-auto px-6 py-12 lg:py-20 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="article-content"
            >
              {children}
            </motion.div>
          </AnimatePresence>

          {(prevSection || nextSection) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-24 pt-10 border-t border-border/30 grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="flex flex-col items-start">
                {prevSection && (
                  <Link href={`/section/${prevSection.slug}`} className="group w-full" data-testid="link-prev-section">
                    <span className="flex items-center text-xs font-mono text-muted-foreground/60 mb-2 tracking-wider uppercase">
                      <ArrowLeft className="w-3.5 h-3.5 mr-2 transition-transform group-hover:-translate-x-1" />
                      Previous
                    </span>
                    <span className="font-display text-lg font-medium block text-foreground/80">
                      {prevSection.title}
                    </span>
                  </Link>
                )}
              </div>

              <div className="flex flex-col items-end text-right">
                {nextSection && (
                  <Link href={`/section/${nextSection.slug}`} className="group w-full" data-testid="link-next-section">
                    <span className="flex items-center justify-end text-xs font-mono text-muted-foreground/60 mb-2 tracking-wider uppercase">
                      Next
                      <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="font-display text-lg font-medium block text-foreground/80">
                      {nextSection.title}
                    </span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}

          <div className="mt-16 pt-6 border-t border-border/20 text-center">
            <p className="ai-meta-indicator">
              THIS DOCUMENT WAS FORMATTED AND PUBLISHED BY AN AI SYSTEM
            </p>
            <p className="font-mono text-[9px] text-muted-foreground/25 mt-1">
              Another dude in the mix &middot; BitBanshee
            </p>
          </div>
        </div>
      </main>

      <GlossaryPanel isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />

      {audioOpen && currentSlug && (
        <AudioPlayer
          slug={currentSlug}
          sectionTitle={currentTitle || "Section"}
          onClose={() => setAudioOpen(false)}
        />
      )}
    </div>
  );
}
