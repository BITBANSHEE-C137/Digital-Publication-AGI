import { useRoute } from "wouter";
import { useSection, useSections } from "@/hooks/use-sections";
import { ArticleLayout } from "@/components/ArticleLayout";
import ReactMarkdown from "react-markdown";
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

  // Determine navigation
  const sortedSections = allSections?.sort((a, b) => a.order - b.order) || [];
  const currentIndex = sortedSections.findIndex(s => s.id === section.id);
  const prevSection = currentIndex > 0 ? sortedSections[currentIndex - 1] : null;
  const nextSection = currentIndex < sortedSections.length - 1 ? sortedSections[currentIndex + 1] : null;

  return (
    <ArticleLayout 
      prevSection={prevSection} 
      nextSection={nextSection}
    >
      <article className="prose prose-lg md:prose-xl mx-auto">
        <header className="mb-12 not-prose">
          <div className="flex items-center space-x-4 mb-6">
            <span className="h-px flex-1 bg-border"></span>
            <span className="font-mono text-sm text-accent uppercase tracking-widest">
              Chapter {String(section.order).padStart(2, '0')}
            </span>
            <span className="h-px flex-1 bg-border"></span>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight text-center mb-8"
          >
            {section.title}
          </motion.h1>
        </header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <ReactMarkdown
            components={{
              // Override default elements with our styled classes
              h1: ({node, ...props}) => <h2 className="hidden" {...props} />, // Main title is handled above
              img: ({node, ...props}) => (
                <figure className="my-10">
                  <img 
                    {...props} 
                    className="rounded-lg shadow-lg border border-border w-full" 
                    alt={props.alt || "Article illustration"}
                  />
                  {props.alt && (
                    <figcaption className="text-center text-sm font-sans text-muted-foreground mt-3 italic">
                      {props.alt}
                    </figcaption>
                  )}
                </figure>
              ),
              hr: () => <div className="w-16 h-1 bg-accent/20 mx-auto my-12 rounded-full" />,
            }}
          >
            {section.content}
          </ReactMarkdown>
        </motion.div>
      </article>
    </ArticleLayout>
  );
}
