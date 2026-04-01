import { useState, useCallback, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Search, X, ArrowRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Section } from "@/hooks/use-sections";

interface SearchResult {
  slug: string;
  title: string;
  order: number;
  snippet: string;
  titleMatch: boolean;
  matchCount: number;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
      setResults([]);
      setSearched(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/sections.json');
      if (!res.ok) throw new Error('Failed to load sections');
      const all: Section[] = await res.json();
      const query = q.trim().toLowerCase();
      const matched: SearchResult[] = all
        .filter(s => s.title.toLowerCase().includes(query) || s.content.toLowerCase().includes(query))
        .map(s => {
          const titleMatch = s.title.toLowerCase().includes(query);
          const contentLower = s.content.toLowerCase();
          let matchCount = 0;
          let idx = 0;
          while ((idx = contentLower.indexOf(query, idx)) !== -1) { matchCount++; idx++; }
          if (titleMatch) matchCount++;
          const firstIdx = contentLower.indexOf(query);
          const snippetStart = Math.max(0, firstIdx - 80);
          const snippetEnd = Math.min(s.content.length, firstIdx + query.length + 80);
          const snippet = (snippetStart > 0 ? '...' : '') + s.content.slice(snippetStart, snippetEnd) + (snippetEnd < s.content.length ? '...' : '');
          return { slug: s.slug, title: s.title, order: s.order, snippet, titleMatch, matchCount };
        })
        .sort((a, b) => (b.titleMatch ? 1 : 0) - (a.titleMatch ? 1 : 0) || b.matchCount - a.matchCount);
      setResults(matched);
      setSearched(true);
    } catch {
      setResults([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  };

  const goToResult = (slug: string) => {
    onClose();
    navigate(`/section/${slug}`);
  };

  function highlightSnippet(snippet: string, q: string) {
    if (!q || !snippet) return snippet;
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = snippet.split(new RegExp(`(${escaped})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase()
        ? <mark key={i} className="bg-accent/30 text-accent px-0.5 rounded-sm">{part}</mark>
        : part
    );
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]" data-testid="search-modal">
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl mx-4 evidence-panel rounded-lg overflow-hidden shadow-2xl" style={{ border: '1px solid hsl(var(--border))' }}>
        <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid hsl(var(--border) / 0.5)' }}>
          <Search className="w-4 h-4 text-accent/60 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Search across all sections..."
            className="flex-1 bg-transparent text-sm font-sans text-foreground/90 placeholder:text-muted-foreground/40 outline-none"
            data-testid="input-search"
          />
          {query && (
            <button onClick={() => { setQuery(""); setResults([]); setSearched(false); inputRef.current?.focus(); }} className="text-muted-foreground/40 hover:text-foreground/60 transition-colors" data-testid="button-search-clear">
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono text-muted-foreground/30 tracking-wider flex-shrink-0">ESC</span>
        </div>

        <div className="max-h-[50vh] overflow-y-auto custom-scrollbar">
          {loading && (
            <div className="px-4 py-6 text-center">
              <span className="text-xs font-mono text-muted-foreground/40 tracking-wider">SEARCHING...</span>
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="px-4 py-8 text-center">
              <span className="text-sm text-muted-foreground/50">No matches found for "{query}"</span>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="py-1">
              <div className="px-4 py-2">
                <span className="text-[10px] font-mono text-muted-foreground/30 tracking-[0.2em] uppercase">
                  {results.length} section{results.length !== 1 ? 's' : ''} matched
                </span>
              </div>
              {results.map((r) => (
                <button
                  key={r.slug}
                  onClick={() => goToResult(r.slug)}
                  className={cn(
                    "w-full text-left px-4 py-3 flex items-start gap-3 transition-colors",
                    "hover:bg-accent/5 group"
                  )}
                  data-testid={`search-result-${r.slug}`}
                >
                  <FileText className="w-4 h-4 text-accent/30 mt-0.5 flex-shrink-0 group-hover:text-accent/60 transition-colors" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] text-accent/40">
                        {String(r.order).padStart(2, '0')}
                      </span>
                      <span className="text-sm font-sans text-foreground/80 group-hover:text-foreground transition-colors truncate">
                        {r.title}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground/30 flex-shrink-0">
                        {r.matchCount} match{r.matchCount !== 1 ? 'es' : ''}
                      </span>
                    </div>
                    {r.snippet && (
                      <p className="text-xs text-muted-foreground/50 leading-relaxed line-clamp-2">
                        {highlightSnippet(r.snippet, query)}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/20 mt-0.5 flex-shrink-0 group-hover:text-accent/40 transition-colors" />
                </button>
              ))}
            </div>
          )}

          {!loading && !searched && (
            <div className="px-4 py-8 text-center">
              <span className="text-xs text-muted-foreground/30">Type at least 2 characters to search</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
