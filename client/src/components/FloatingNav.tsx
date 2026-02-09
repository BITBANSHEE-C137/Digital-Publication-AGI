import { Link, useLocation } from "wouter";
import { useSections } from "@/hooks/use-sections";
import { useState } from "react";
import { ChevronDown, BookOpen, Home, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

interface FloatingNavProps {
  onOpenGlossary?: () => void;
  onListenClick?: () => void;
}

export function FloatingNav({ onOpenGlossary, onListenClick }: FloatingNavProps) {
  const { data: sections } = useSections();
  const [location] = useLocation();
  const [navOpen, setNavOpen] = useState(false);

  const sortedSections = sections?.sort((a, b) => a.order - b.order) || [];
  const currentSection = sortedSections.find(s => location === `/section/${s.slug}`);

  if (location === "/") return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 floating-nav" data-testid="floating-nav">
      <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/" data-testid="link-nav-home">
            <Home className="w-4 h-4 text-muted-foreground" />
          </Link>

          <span className="text-border/40 select-none">/</span>

          <div className="relative">
            <button
              onClick={() => setNavOpen(!navOpen)}
              className="flex items-center gap-1.5 text-sm font-sans text-foreground/80 hover-elevate px-2 py-1 rounded-md"
              data-testid="button-nav-chapters"
            >
              <span className="truncate max-w-[200px] md:max-w-[350px]">
                {currentSection ? currentSection.title : "Navigate"}
              </span>
              <ChevronDown className={cn("w-3.5 h-3.5 text-muted-foreground transition-transform", navOpen && "rotate-180")} />
            </button>

            {navOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setNavOpen(false)} />
                <div
                  className="absolute top-full left-0 mt-1 z-20 w-80 rounded-md overflow-hidden evidence-panel"
                  data-testid="nav-dropdown"
                >
                  <div className="max-h-[60vh] overflow-y-auto custom-scrollbar py-1">
                    {sortedSections.map((section) => {
                      const isActive = location === `/section/${section.slug}`;
                      const isRef = ["sources", "appendix"].includes(section.slug);
                      return (
                        <Link
                          key={section.id}
                          href={`/section/${section.slug}`}
                          className={cn(
                            "flex items-center gap-3 px-4 py-2.5 text-sm font-sans transition-colors",
                            isActive
                              ? "bg-accent/10 text-accent"
                              : "text-foreground/70 hover-elevate"
                          )}
                          onClick={() => setNavOpen(false)}
                          data-testid={`link-nav-${section.slug}`}
                        >
                          {!isRef && (
                            <span className="font-mono text-[10px] text-accent/40 w-5 text-right flex-shrink-0">
                              {String(section.order).padStart(2, '0')}
                            </span>
                          )}
                          <span className={cn("truncate", isRef && "text-muted-foreground/60 text-xs uppercase tracking-wider")}>
                            {section.title}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onListenClick && (
            <button
              onClick={onListenClick}
              className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/60 hover-elevate px-2 py-1 rounded-md tracking-wider uppercase"
              data-testid="button-nav-listen"
            >
              <Headphones className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Listen</span>
            </button>
          )}
          {onOpenGlossary && (
            <button
              onClick={onOpenGlossary}
              className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground/60 hover-elevate px-2 py-1 rounded-md tracking-wider uppercase"
              data-testid="button-nav-glossary"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Key Terms</span>
            </button>
          )}
          <span className="ai-meta-indicator hidden md:block">
            AI-PUBLISHED
          </span>
        </div>
      </div>
    </div>
  );
}
