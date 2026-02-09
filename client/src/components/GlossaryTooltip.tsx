import { useState } from "react";
import { glossary, type GlossaryEntry } from "@/lib/glossary";
import { BookOpen, X } from "lucide-react";

const categoryColors: Record<GlossaryEntry["category"], string> = {
  technical: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  concept: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  framework: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  data: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

const categoryLabels: Record<GlossaryEntry["category"], string> = {
  technical: "Technical",
  concept: "Concept",
  framework: "Framework",
  data: "Data Source",
};

interface GlossaryPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlossaryPanel({ isOpen, onClose }: GlossaryPanelProps) {
  const [filter, setFilter] = useState<GlossaryEntry["category"] | "all">("all");

  const filtered = filter === "all"
    ? glossary
    : glossary.filter((e) => e.category === filter);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="bg-background border border-border rounded-md shadow-lg w-full max-w-2xl max-h-[80vh] flex flex-col mx-4"
        data-testid="glossary-panel"
      >
        <div className="flex items-center justify-between gap-2 p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-accent" />
            <h2 className="font-display text-xl font-bold text-primary">Key Terms</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-muted-foreground hover-elevate"
            data-testid="button-close-glossary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 p-4 border-b border-border">
          {(["all", "concept", "technical", "framework", "data"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`text-xs font-sans px-3 py-1.5 rounded-md transition-colors ${
                filter === cat
                  ? "bg-accent text-accent-foreground"
                  : "bg-secondary text-muted-foreground hover-elevate"
              }`}
              data-testid={`button-filter-${cat}`}
            >
              {cat === "all" ? "All" : categoryLabels[cat]}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-3 custom-scrollbar">
          {filtered.map((entry) => (
            <div
              key={entry.term}
              className="p-3 rounded-md bg-secondary/30 border border-border/50"
              data-testid={`glossary-entry-${entry.term.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-display font-semibold text-primary text-sm">
                  {entry.term}
                </span>
                <span
                  className={`text-[10px] font-sans font-medium px-1.5 py-0.5 rounded-md ${categoryColors[entry.category]}`}
                >
                  {categoryLabels[entry.category]}
                </span>
              </div>
              <p className="text-sm font-serif text-muted-foreground leading-relaxed">
                {entry.definition}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface InlineTermProps {
  term: string;
  children: React.ReactNode;
}

export function InlineTerm({ term, children }: InlineTermProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const entry = glossary.find(
    (e) => e.term.toLowerCase() === term.toLowerCase()
  );

  if (!entry) return <>{children}</>;

  return (
    <span className="relative inline">
      <span
        className="border-b border-dotted border-accent/40 cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        data-testid={`term-${term.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {children}
      </span>
      {showTooltip && (
        <span className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-background border border-border rounded-md shadow-lg text-left pointer-events-none">
          <span className="flex items-center gap-1.5 mb-1">
            <span className="font-display font-semibold text-xs text-primary">{entry.term}</span>
            <span className={`text-[9px] font-sans px-1 py-0.5 rounded ${categoryColors[entry.category]}`}>
              {categoryLabels[entry.category]}
            </span>
          </span>
          <span className="text-xs font-serif text-muted-foreground leading-relaxed block">
            {entry.definition}
          </span>
        </span>
      )}
    </span>
  );
}
