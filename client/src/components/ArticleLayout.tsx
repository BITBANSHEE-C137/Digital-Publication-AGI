import { Sidebar } from "./Sidebar";
import { ReadingProgress } from "./ReadingProgress";
import { GlossaryPanel } from "./GlossaryTooltip";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen } from "lucide-react";
import { Link } from "wouter";

interface ArticleLayoutProps {
  children: ReactNode;
  prevSection?: { slug: string; title: string } | null;
  nextSection?: { slug: string; title: string } | null;
}

export function ArticleLayout({ children, prevSection, nextSection }: ArticleLayoutProps) {
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/20">
      <ReadingProgress />
      <Sidebar onOpenGlossary={() => setGlossaryOpen(true)} />
      
      <main className="lg:pl-72 min-h-screen pt-20 lg:pt-0">
        <div className="max-w-4xl mx-auto px-6 py-12 lg:py-20 lg:px-16">
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
              className="mt-24 pt-10 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="flex flex-col items-start">
                {prevSection && (
                  <Link href={`/section/${prevSection.slug}`} className="group w-full" data-testid="link-prev-section">
                    <span className="flex items-center text-sm font-sans text-muted-foreground mb-2 group-hover:text-accent transition-colors">
                      <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                      Previous
                    </span>
                    <span className="font-display text-lg font-medium block group-hover:underline decoration-border group-hover:decoration-accent decoration-1 underline-offset-4">
                      {prevSection.title}
                    </span>
                  </Link>
                )}
              </div>
              
              <div className="flex flex-col items-end text-right">
                {nextSection && (
                  <Link href={`/section/${nextSection.slug}`} className="group w-full" data-testid="link-next-section">
                    <span className="flex items-center justify-end text-sm font-sans text-muted-foreground mb-2 group-hover:text-accent transition-colors">
                      Next
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </span>
                    <span className="font-display text-lg font-medium block group-hover:underline decoration-border group-hover:decoration-accent decoration-1 underline-offset-4">
                      {nextSection.title}
                    </span>
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <GlossaryPanel isOpen={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  );
}
