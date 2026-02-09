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
            <span className="h-px flex-1 bg-border/30"></span>
            <span className="font-mono text-xs text-accent/50 uppercase tracking-[0.3em]">
              {isReference ? "Reference" : `Chapter ${String(section.order).padStart(2, '0')}`}
            </span>
            <span className="h-px flex-1 bg-border/30"></span>
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
          <InteractiveContent content={section.content} sectionSlug={section.slug} />
        </motion.div>

        {section.slug === "intro" && (
          <div className="not-prose mt-12 data-viz" data-testid="reading-guide">
            <p className="font-mono text-[10px] text-accent/50 mb-3 tracking-[0.2em] uppercase">HOW TO READ THIS</p>
            <p className="font-serif text-sm text-foreground/60 leading-relaxed">
              <span className="border-b border-dotted border-accent/40">Dotted underlines</span> indicate key terms — hover for definitions.
              <span className="verifiable-claim ml-1" style={{ animation: 'none', cursor: 'default' }}>Glowing underlines</span> mark verifiable claims —
              click them to search the open web for independent evidence.
              Data visualizations appear inline where the paper presents statistics.
            </p>
            <p className="font-mono text-[9px] text-muted-foreground/30 mt-3">
              Don't trust the messenger. Verify the source.
            </p>
          </div>
        )}
      </article>
    </ArticleLayout>
  );
}
