import { ArticleLayout } from "@/components/ArticleLayout";
import { useSections } from "@/hooks/use-sections";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, BookOpen } from "lucide-react";

export default function Home() {
  const { data: sections } = useSections();
  const sortedSections = sections?.sort((a, b) => a.order - b.order) || [];
  const firstSection = sortedSections[0];

  return (
    <ArticleLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8 max-w-2xl"
        >
          <div className="space-y-4">
            <span className="text-accent font-mono text-sm tracking-widest uppercase mb-4 block">
              A Digital Publication
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight text-primary">
              When We <br />
              Outsourced <br />
              <span className="italic font-serif text-6xl md:text-7xl lg:text-8xl">Thinking</span>
            </h1>
          </div>

          <div className="w-24 h-1 bg-accent mx-auto my-8 opacity-80" />

          <p className="font-serif text-xl md:text-2xl leading-relaxed text-muted-foreground max-w-lg mx-auto">
            An exploration into the pillars of Artificial General Intelligence and the skills we need to survive it.
          </p>

          <div className="pt-8">
            <p className="font-sans font-medium text-sm tracking-widest uppercase text-primary">
              By Glenn Rowe
            </p>
          </div>

          <div className="pt-12">
            {firstSection ? (
              <Link href={`/section/${firstSection.slug}`}>
                <button className="group relative inline-flex items-center justify-center px-8 py-4 font-sans text-base font-medium text-background bg-primary hover:bg-primary/90 transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1">
                  <BookOpen className="w-5 h-5 mr-3" />
                  Start Reading
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </button>
              </Link>
            ) : (
              <div className="text-muted-foreground animate-pulse">Loading content...</div>
            )}
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-24 md:mt-32 border-t border-border pt-12 text-center"
      >
        <p className="font-serif italic text-muted-foreground">
          "The danger isn't that machines will begin to think like humans,<br/> but that humans will begin to think like machines."
        </p>
      </motion.div>
    </ArticleLayout>
  );
}
