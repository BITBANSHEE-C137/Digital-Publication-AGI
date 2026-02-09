import ReactMarkdown from "react-markdown";
import { glossary } from "@/lib/glossary";
import { InlineTerm } from "./GlossaryTooltip";
import { VerifiableClaimInline } from "./VerifiableClaim";
import { EvidencePanel } from "./EvidencePanel";
import { LiteracyDeclineViz, NAEPDeclineViz, TechPhaseViz, ConvergenceViz } from "./DataViz";
import { verifiableClaims, type VerifiableClaim } from "@/lib/verifiable-claims";
import { useState } from "react";
import { ChevronDown, ChevronRight, Lightbulb } from "lucide-react";

function annotateText(
  text: string,
  onClaimActivate: (claim: VerifiableClaim) => void
): (string | JSX.Element)[] {
  const sortedTerms = [...glossary].sort((a, b) => b.term.length - a.term.length);
  const sortedClaims = [...verifiableClaims].sort((a, b) => b.textMatch.length - a.textMatch.length);

  interface Segment {
    type: "text" | "term" | "claim";
    value: string;
    term?: string;
    claim?: VerifiableClaim;
    start: number;
    end: number;
  }

  const matches: Segment[] = [];
  const usedRanges: [number, number][] = [];

  for (const claim of sortedClaims) {
    const idx = text.toLowerCase().indexOf(claim.textMatch.toLowerCase());
    if (idx !== -1) {
      const end = idx + claim.textMatch.length;
      const overlaps = usedRanges.some(([s, e]) => idx < e && end > s);
      if (!overlaps) {
        matches.push({ type: "claim", value: text.substring(idx, end), claim, start: idx, end });
        usedRanges.push([idx, end]);
      }
    }
  }

  const termPatterns = sortedTerms.map(entry => ({
    term: entry.term,
    regex: new RegExp(`\\b(${entry.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi')
  }));

  const seenTerms = new Set<string>();

  for (const pattern of termPatterns) {
    let match;
    while ((match = pattern.regex.exec(text)) !== null) {
      const start = match.index;
      const end = start + match[0].length;
      const overlaps = usedRanges.some(([s, e]) => start < e && end > s);
      if (!overlaps) {
        const termKey = pattern.term.toLowerCase();
        if (!seenTerms.has(termKey)) {
          seenTerms.add(termKey);
          matches.push({ type: "term", value: match[0], term: pattern.term, start, end });
          usedRanges.push([start, end]);
        }
      }
    }
  }

  matches.sort((a, b) => a.start - b.start);

  if (matches.length === 0) return [text];

  const result: (string | JSX.Element)[] = [];
  let lastEnd = 0;

  for (const m of matches) {
    if (m.start > lastEnd) {
      result.push(text.substring(lastEnd, m.start));
    }

    if (m.type === "claim" && m.claim) {
      result.push(
        <VerifiableClaimInline key={`claim-${m.claim.id}-${m.start}`} claim={m.claim} onActivate={onClaimActivate}>
          {m.value}
        </VerifiableClaimInline>
      );
    } else if (m.type === "term") {
      result.push(
        <InlineTerm key={`${m.term}-${m.start}`} term={m.term!}>
          {m.value}
        </InlineTerm>
      );
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
    <div className="key-insight" data-testid="key-insight">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
        <div className="font-serif text-base leading-relaxed text-foreground/85">
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
    <div className="my-6 border border-border/30 rounded-md overflow-visible" data-testid={`collapsible-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 p-4 text-left font-mono text-xs text-foreground/70 hover-elevate transition-colors tracking-wider uppercase"
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
        <div className="px-4 pb-4 border-t border-border/20">
          {children}
        </div>
      )}
    </div>
  );
}

interface InteractiveContentProps {
  content: string;
  sectionSlug?: string;
}

export function InteractiveContent({ content, sectionSlug }: InteractiveContentProps) {
  const [activeClaim, setActiveClaim] = useState<VerifiableClaim | null>(null);
  const [evidenceOpen, setEvidenceOpen] = useState(false);

  const handleClaimActivate = (claim: VerifiableClaim) => {
    setActiveClaim(claim);
    setEvidenceOpen(true);
  };

  const keyPhrases = [
    "Based on the convergence of literacy, numeracy, and reasoning data",
    "Industry is building memory as a feature. It is not building memory as cognition.",
    "high expressiveness masking lower-layer degradation",
    "Whoever controls the belief ledger controls the agent.",
    "The risk is not that the machines will turn against us.",
    "we are innovating ourselves backward",
    "Capital does what capital always does: it collapses possibility space into sellable SKUs.",
    "Who is allowed to build something that is not immediately monetizable",
    "The recomposition produced a population optimized for collaboration with AI",
    "the gap between what we can do with AI and what we can do about AI is the gap this paper is about",
  ];

  const shouldShowViz = (textContent: string): React.ReactNode | null => {
    if (sectionSlug === "skills") {
      if (textContent.includes("literacy dropped 12 points") || textContent.includes("PIAAC shows clear decline")) {
        return <LiteracyDeclineViz />;
      }
      if (textContent.includes("Student reading at age 17 was essentially flat")) {
        return <NAEPDeclineViz />;
      }
    }
    if (sectionSlug === "phase-transitions") {
      if (textContent.includes("AI is in Phase 2 right now")) {
        return <TechPhaseViz />;
      }
    }
    if (sectionSlug === "convergence") {
      if (textContent.includes("Three dynamics are converging")) {
        return <ConvergenceViz />;
      }
    }
    return null;
  };

  return (
    <>
      <ReactMarkdown
        components={{
          h1: ({ children, ...props }) => <h2 className="hidden" {...props}>{children}</h2>,
          h2: ({ children, ...props }) => {
            const text = String(children);
            return (
              <h2
                className="text-2xl md:text-3xl font-display font-semibold mt-16 mb-6 text-primary scroll-mt-24 relative"
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
                className="text-xl md:text-2xl font-display font-medium mt-10 mb-4 text-primary/90 scroll-mt-24"
                id={text.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                {...props}
              >
                {children}
              </h3>
            );
          },
          p: ({ children }) => {
            const extractText = (node: React.ReactNode): string => {
              if (typeof node === 'string') return node;
              if (Array.isArray(node)) return node.map(extractText).join('');
              if (node && typeof node === 'object' && 'props' in node) {
                return extractText((node as React.ReactElement).props.children);
              }
              return '';
            };
            const textContent = extractText(children);

            const isKeyInsight = keyPhrases.some(phrase =>
              textContent.toLowerCase().includes(phrase.toLowerCase())
            );

            const viz = shouldShowViz(textContent);

            const processChildren = (child: React.ReactNode): React.ReactNode => {
              if (typeof child === 'string') {
                const annotated = annotateText(child, handleClaimActivate);
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
              return (
                <>
                  <KeyInsight>{processed}</KeyInsight>
                  {viz}
                </>
              );
            }

            return (
              <>
                <p className="font-serif text-lg leading-[1.9] text-foreground/85 mb-6">
                  {processed}
                </p>
                {viz}
              </>
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
          hr: () => <div className="section-divider" data-label="////" />,
          blockquote: ({ children }) => (
            <blockquote className="pl-6 py-3 my-8 text-xl font-display text-primary/80 pr-4 rounded-r-md" style={{
              borderLeft: '3px solid hsl(var(--accent) / 0.4)',
              background: 'hsl(var(--accent) / 0.03)',
            }}>
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside ml-6 mb-6 space-y-2" style={{ '--tw-marker-color': 'hsl(var(--accent))' } as React.CSSProperties}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside ml-6 mb-6 space-y-2">
              {children}
            </ol>
          ),
          li: ({ children }) => {
            const processChildren = (child: React.ReactNode): React.ReactNode => {
              if (typeof child === 'string') {
                const annotated = annotateText(child, handleClaimActivate);
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
                className="rounded-md border border-border/30 w-full"
                {...props}
              />
              {alt && (
                <figcaption className="text-center text-xs font-mono text-muted-foreground/50 mt-3 tracking-wider">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
        }}
      >
        {content}
      </ReactMarkdown>

      <EvidencePanel
        claim={activeClaim}
        isOpen={evidenceOpen}
        onClose={() => {
          setEvidenceOpen(false);
          setActiveClaim(null);
        }}
      />
    </>
  );
}
