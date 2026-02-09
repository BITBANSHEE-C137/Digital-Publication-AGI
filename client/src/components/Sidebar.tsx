import { Link, useLocation } from "wouter";
import { useSections } from "@/hooks/use-sections";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  onOpenGlossary?: () => void;
}

export function Sidebar({ onOpenGlossary }: SidebarProps) {
  const { data: sections, isLoading } = useSections();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const sortedSections = sections?.sort((a, b) => a.order - b.order) || [];

  const mainSections = sortedSections.filter(s => !["sources", "appendix"].includes(s.slug));
  const refSections = sortedSections.filter(s => ["sources", "appendix"].includes(s.slug));

  const NavContent = () => (
    <div className="h-full flex flex-col py-8 px-6 bg-background border-r border-border/40">
      <div className="mb-10">
        <Link href="/" className="block">
          <h1 className="font-display text-2xl font-bold leading-tight tracking-tight text-primary hover:text-accent transition-colors" data-testid="link-home">
            When We <br />
            Outsourced <br />
            Thinking
          </h1>
          <p className="mt-3 font-serif italic text-sm text-muted-foreground border-t border-border/60 pt-3 inline-block">
            by Glenn Rowe
          </p>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <ul className="space-y-1">
          <li>
            <Link 
              href="/" 
              className={cn(
                "block py-2 px-3 rounded-md text-sm font-sans transition-all duration-200",
                location === "/" 
                  ? "bg-secondary text-primary font-medium shadow-sm translate-x-1" 
                  : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
              )}
              data-testid="link-cover"
            >
              Cover
            </Link>
          </li>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <li key={i} className="py-2 px-3">
                <div className="h-4 bg-secondary animate-pulse rounded w-3/4"></div>
              </li>
            ))
          ) : (
            <>
              {mainSections.map((section) => (
                <li key={section.id}>
                  <Link 
                    href={`/section/${section.slug}`}
                    className={cn(
                      "block py-2 px-3 rounded-md text-sm font-sans transition-all duration-200",
                      location === `/section/${section.slug}`
                        ? "bg-secondary text-primary font-medium shadow-sm translate-x-1"
                        : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                    )}
                    data-testid={`link-section-${section.slug}`}
                  >
                    <span className="mr-2 text-xs text-accent/60 font-mono">
                      {String(section.order).padStart(2, '0')}
                    </span>
                    {section.title}
                  </Link>
                </li>
              ))}
              
              {refSections.length > 0 && (
                <>
                  <li className="pt-4 pb-1 px-3">
                    <span className="text-xs font-sans font-medium text-muted-foreground/60 uppercase tracking-wider">
                      Reference
                    </span>
                  </li>
                  {refSections.map((section) => (
                    <li key={section.id}>
                      <Link 
                        href={`/section/${section.slug}`}
                        className={cn(
                          "block py-2 px-3 rounded-md text-sm font-sans transition-all duration-200",
                          location === `/section/${section.slug}`
                            ? "bg-secondary text-primary font-medium shadow-sm translate-x-1"
                            : "text-muted-foreground hover:text-primary hover:bg-secondary/50"
                        )}
                        data-testid={`link-section-${section.slug}`}
                      >
                        {section.title}
                      </Link>
                    </li>
                  ))}
                </>
              )}
            </>
          )}
        </ul>
      </nav>

      {onOpenGlossary && (
        <div className="mt-4 px-1">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={onOpenGlossary}
            data-testid="button-open-glossary"
          >
            <BookOpen className="w-4 h-4" />
            Key Terms
          </Button>
        </div>
      )}

      <div className="mt-4 pt-6 border-t border-border/60 text-xs text-muted-foreground font-sans">
        <p>&copy; {new Date().getFullYear()} Glenn Rowe</p>
        <p className="mt-1">All rights reserved.</p>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block w-72 h-screen fixed left-0 top-0 z-30">
        <NavContent />
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-b border-border/40 z-40 flex items-center justify-between px-4">
        <Link href="/">
           <span className="font-display font-bold text-lg truncate" data-testid="link-mobile-home">Outsourced Thinking</span>
        </Link>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <button className="p-2 -mr-2 text-primary hover:bg-secondary rounded-md transition-colors" data-testid="button-mobile-menu">
              <Menu className="w-6 h-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-80 border-r border-border/40">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
