import ReactMarkdown from "react-markdown";
import { glossary } from "@/lib/glossary";
import { InlineTerm } from "./GlossaryTooltip";
import { useState } from "react";
import { ChevronDown, ChevronRight, Lightbulb } from "lucide-react";

function annotateText(text: string): (string | JSX.Element)[] {
  const sortedTerms = [...glossary].sort((a, b) => b.term.length - a.term.length);
  
  const patterns = sortedTerms.map(entry => ({
    term: entry.term,
    regex: new RegExp(`\\b(${entry.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi')
  }));

  interface Segment {
    type: "text" | "term";
    value: string;
    term?: string;
    start: number;
    end: number;
  }

  const matches: Segment[] = [];
  const usedRanges: [number, number][] = [];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      
      const overlaps = usedRanges.some(([s, e]) => start < e && end > s);
      if (!overlaps) {
        matches.push({ type: "term", value: match[0], term: pattern.term, start, end });
        usedRanges.push([start, end]);
      }
    }
  }
  
  matches.sort((a, b) => a.start - b.start);

  if (matches.length === 0) return [text];

  const result: (string | JSX.Element)[] = [];
  let lastEnd = 0;

  const seenTerms = new Set<string>();

  for (const m of matches) {
    if (m.start > lastEnd) {
      result.push(text.substring(lastEnd, m.start));
    }
    
    const termKey = m.term!.toLowerCase();
    if (!seenTerms.has(termKey)) {
      seenTerms.add(termKey);
      result.push(
        <InlineTerm key={`${m.term}-${m.start}`} term={m.term!}>
          {m.value}
        </InlineTerm>
      );
    } else {
      result.push(m.value);
    }
    lastEnd = m.end;
  }

  if (lastEnd < text.length) {
    result.push(text.substring(lastEnd));
  }

  return result;
}

function KeyInsight({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 p-5 border-l-4 border-accent bg-accent/5 rounded-r-md" data-testid="key-insight">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
        <div className="font-serif text-base leading-relaxed text-primary/90">
          {children}
        </div>
      </div>
    </div>
  );
}

function CollapsibleSection({ title, children, defaultOpen = false }: { 
  title: string; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="my-6 border border-border/50 rounded-md overflow-visible" data-testid={`collapsible-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 p-4 text-left font-display font-semibold text-sm text-primary hover-elevate transition-colors"
        data-testid={`button-toggle-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-accent flex-shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-accent flex-shrink-0" />
        )}
        {title}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-border/30">
          {children}
        </div>
      )}
    </div>
  );
}

interface InteractiveContentProps {
  content: string;
}

export function InteractiveContent({ content }: InteractiveContentProps) {
  const keyPhrases = [
    "Based on the convergence of literacy, numeracy, and reasoning data",
    "Industry is building memory as a feature. It is not building memory as cognition.",
    "high expressiveness masking lower-layer degradation",
    "Whoever controls the belief ledger controls the agent.",
    "The risk is not that the machines will turn against us.",
    "we are innovating ourselves backward",
    "Capital does what capital always does: it collapses possibility space into sellable SKUs.",
    "Who is allowed to build something that is not immediately monetizable",
  ];

  const collapsibleSections = [
    "Sidebar: The Competence-Intelligence Parallax",
    "What the Data Actually Shows",
    "What Happened",
    "The Safety Inversion",
    "The Fork",
    "The Real Danger",
  ];

  return (
    <ReactMarkdown
      components={{
        h1: ({ children, ...props }) => <h2 className="hidden" {...props}>{children}</h2>,
        h2: ({ children, ...props }) => {
          const text = String(children);
          return (
            <h2 
              className="text-2xl md:text-3xl font-display font-semibold mt-12 mb-6 text-primary scroll-mt-24" 
              id={text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              {...props}
            >
              {children}
            </h2>
          );
        },
        h3: ({ children, ...props }) => {
          const text = String(children);
          return (
            <h3 
              className="text-xl md:text-2xl font-display font-medium mt-8 mb-4 italic text-primary/90 scroll-mt-24"
              id={text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
              {...props}
            >
              {children}
            </h3>
          );
        },
        p: ({ children }) => {
          const textContent = typeof children === 'string' ? children : '';
          
          const isKeyInsight = keyPhrases.some(phrase => 
            textContent.toLowerCase().includes(phrase.toLowerCase())
          );

          const processChildren = (child: React.ReactNode): React.ReactNode => {
            if (typeof child === 'string') {
              const annotated = annotateText(child);
              return annotated.length === 1 && typeof annotated[0] === 'string' 
                ? annotated[0] 
                : <>{annotated}</>;
            }
            return child;
          };

          const processed = Array.isArray(children)
            ? children.map((child, i) => <span key={i}>{processChildren(child)}</span>)
            : processChildren(children);

          if (isKeyInsight) {
            return <KeyInsight>{processed}</KeyInsight>;
          }

          return (
            <p className="font-serif text-lg leading-8 text-foreground/90 mb-6">
              {processed}
            </p>
          );
        },
        strong: ({ children }) => (
          <strong className="font-bold text-primary">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        a: ({ href, children }) => (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-4 decoration-accent/30 hover:decoration-accent transition-all duration-200"
            data-testid="link-external"
          >
            {children}
          </a>
        ),
        hr: () => <div className="w-16 h-1 bg-accent/20 mx-auto my-12 rounded-full" />,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-accent pl-6 py-2 my-8 italic text-xl font-display text-primary/80 bg-secondary/30 pr-4 rounded-r-md">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-outside ml-6 mb-6 space-y-2 marker:text-accent">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 marker:font-display marker:text-accent">
            {children}
          </ol>
        ),
        li: ({ children }) => {
          const processChildren = (child: React.ReactNode): React.ReactNode => {
            if (typeof child === 'string') {
              const annotated = annotateText(child);
              return annotated.length === 1 && typeof annotated[0] === 'string'
                ? annotated[0]
                : <>{annotated}</>;
            }
            return child;
          };

          const processed = Array.isArray(children)
            ? children.map((child, i) => <span key={i}>{processChildren(child)}</span>)
            : processChildren(children);

          return (
            <li className="font-serif text-lg leading-8 pl-2">
              {processed}
            </li>
          );
        },
        img: ({ src, alt, ...props }) => (
          <figure className="my-10">
            <img
              src={src}
              alt={alt || "Article illustration"}
              className="rounded-md shadow-lg border border-border w-full"
              {...props}
            />
            {alt && (
              <figcaption className="text-center text-sm font-sans text-muted-foreground mt-3 italic">
                {alt}
              </figcaption>
            )}
          </figure>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
