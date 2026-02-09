import { useRoute } from "wouter";
import { useSection, useSections } from "@/hooks/use-sections";
import { ArticleLayout } from "@/components/ArticleLayout";
import { InteractiveContent } from "@/components/InteractiveContent";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import NotFound from "./not-found";

export default function SectionPage() {
  const [, params] = useRoute("/section/:slug");
  const slug = params?.slug || "";
  
  const { data: section, isLoading, isError } = useSection(slug);
  const { data: allSections } = useSections();

  if (isLoading) {
    return (
      <ArticleLayout>
        <div className="space-y-8 animate-pulse max-w-3xl mx-auto">
          <div className="space-y-4">
            <Skeleton className="h-4 w-24 bg-secondary" />
            <Skeleton className="h-12 w-3/4 bg-secondary" />
          </div>
          <div className="space-y-4 pt-8">
            <Skeleton className="h-4 w-full bg-secondary" />
            <Skeleton className="h-4 w-full bg-secondary" />
            <Skeleton className="h-4 w-5/6 bg-secondary" />
          </div>
          <div className="space-y-4 pt-4">
            <Skeleton className="h-4 w-full bg-secondary" />
            <Skeleton className="h-4 w-11/12 bg-secondary" />
            <Skeleton className="h-4 w-full bg-secondary" />
          </div>
        </div>
      </ArticleLayout>
    );
  }

  if (isError || !section) {
    return <NotFound />;
  }

  const sortedSections = allSections?.sort((a, b) => a.order - b.order) || [];
  const currentIndex = sortedSections.findIndex(s => s.id === section.id);
  const prevSection = currentIndex > 0 ? sortedSections[currentIndex - 1] : null;
  const nextSection = currentIndex < sortedSections.length - 1 ? sortedSections[currentIndex + 1] : null;

  const isReference = ["sources", "appendix"].includes(section.slug);

  return (
    <ArticleLayout 
      prevSection={prevSection} 
      nextSection={nextSection}
    >
      <article className="prose prose-lg md:prose-xl mx-auto" data-testid={`section-${section.slug}`}>
        <header className="mb-12 not-prose">
          <div className="flex items-center space-x-4 mb-6">
            <span className="h-px flex-1 bg-border"></span>
            <span className="font-mono text-sm text-accent uppercase tracking-widest">
              {isReference ? "Reference" : `Chapter ${String(section.order).padStart(2, '0')}`}
            </span>
            <span className="h-px flex-1 bg-border"></span>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight text-center mb-8"
            data-testid="text-section-title"
          >
            {section.title}
          </motion.h1>

          {section.slug === "intro" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center font-serif italic text-muted-foreground text-lg"
            >
              AGI, Oversight, and the Business of Artificial Intelligence
            </motion.p>
          )}
        </header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <InteractiveContent content={section.content} />
        </motion.div>

        {section.slug === "intro" && (
          <div className="not-prose mt-12 p-6 bg-secondary/30 rounded-md border border-border/50" data-testid="reading-guide">
            <p className="font-sans text-sm text-muted-foreground mb-2 font-medium uppercase tracking-wider">How to read this</p>
            <p className="font-serif text-base text-foreground/80 leading-relaxed">
              Dotted underlines indicate key terms. Hover or tap them for quick definitions. 
              Use the glossary button in the sidebar for a full reference. 
              Some sections contain expandable deep-dives for additional context.
            </p>
          </div>
        )}
      </article>
    </ArticleLayout>
  );
}
