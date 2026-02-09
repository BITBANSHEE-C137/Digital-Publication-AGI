import { useState } from "react";
import { X, ExternalLink, Search, Loader2, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { VerifiableClaim } from "@/lib/verifiable-claims";

interface EvidenceResult {
  claimId: string;
  evidence?: string;
  citations?: string[];
  searchUrl: string;
  fallback?: boolean;
  message?: string;
}

interface EvidencePanelProps {
  claim: VerifiableClaim | null;
  isOpen: boolean;
  onClose: () => void;
}

const categoryLabels: Record<string, string> = {
  statistic: "STATISTICAL CLAIM",
  historical: "HISTORICAL CLAIM",
  technical: "TECHNICAL CLAIM",
  research: "RESEARCH CITATION",
};

const categoryColors: Record<string, string> = {
  statistic: "text-cyan-400",
  historical: "text-amber-400",
  technical: "text-purple-400",
  research: "text-emerald-400",
};

export function EvidencePanel({ claim, isOpen, onClose }: EvidencePanelProps) {
  const [result, setResult] = useState<EvidenceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!claim) return;
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch("/api/evidence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: claim.searchQuery, claimId: claim.id }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({
        claimId: claim.id,
        fallback: true,
        searchUrl: `https://duckduckgo.com/?q=${encodeURIComponent(claim.searchQuery)}`,
        message: "Search unavailable",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setSearched(false);
    setLoading(false);
    onClose();
  };

  if (!isOpen || !claim) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="evidence-panel-overlay">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
      <div
        className="evidence-panel relative z-10 w-full max-w-2xl max-h-[80vh] flex flex-col rounded-md overflow-hidden"
        data-testid="evidence-panel"
      >
        <div className="evidence-panel-header flex items-center justify-between gap-2 p-4">
          <div className="flex items-center gap-3 min-w-0">
            <Search className="w-4 h-4 text-accent flex-shrink-0" />
            <div className="min-w-0">
              <span className={`font-mono text-[10px] tracking-widest uppercase ${categoryColors[claim.category] || 'text-accent'}`}>
                {categoryLabels[claim.category] || "CLAIM"}
              </span>
              <p className="text-sm text-foreground/90 font-serif truncate mt-0.5" data-testid="evidence-claim-text">
                "{claim.textMatch}"
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1.5 rounded-md hover-elevate flex-shrink-0" data-testid="button-close-evidence">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {!searched && !loading && (
            <div className="text-center py-8 space-y-4">
              <p className="text-sm text-muted-foreground font-serif leading-relaxed max-w-md mx-auto">
                The paper makes this claim. Click below to search the open web for independent evidence.
              </p>
              <p className="font-mono text-xs text-muted-foreground/60">
                Query: {claim.searchQuery}
              </p>
              <Button
                variant="outline"
                onClick={handleSearch}
                className="mt-2"
                data-testid="button-search-evidence"
              >
                <Search className="w-4 h-4 mr-2" />
                Verify This Claim
              </Button>
            </div>
          )}

          {loading && (
            <div className="text-center py-12 space-y-3" data-testid="evidence-loading">
              <Loader2 className="w-6 h-6 text-accent animate-spin mx-auto" />
              <p className="font-mono text-xs text-muted-foreground/60 tracking-wider">
                SEARCHING OPEN WEB...
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4" data-testid="evidence-result">
              {result.fallback ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-amber-400">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-mono text-xs tracking-wider uppercase">
                      {result.message || "Direct search unavailable"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground font-serif">
                    Live AI search is not configured. You can verify this claim directly:
                  </p>
                  <a
                    href={result.searchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-accent text-sm font-mono hover:underline"
                    data-testid="link-duckduckgo-search"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Search DuckDuckGo
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-mono text-xs tracking-wider uppercase">
                      EVIDENCE RETRIEVED
                    </span>
                  </div>

                  <div className="text-sm font-serif text-foreground/85 leading-relaxed whitespace-pre-wrap" data-testid="evidence-text">
                    {result.evidence}
                  </div>

                  {result.citations && result.citations.length > 0 && (
                    <div className="pt-3 border-t border-border/30 space-y-2">
                      <span className="font-mono text-[10px] tracking-widest uppercase text-muted-foreground/60">
                        SOURCES
                      </span>
                      <ul className="space-y-1.5">
                        {result.citations.map((url, i) => (
                          <li key={i}>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs text-accent/80 font-mono hover:text-accent transition-colors truncate"
                              data-testid={`link-citation-${i}`}
                            >
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{new URL(url).hostname}{new URL(url).pathname.substring(0, 50)}</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-3 border-t border-border/30">
                    <a
                      href={result.searchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-muted-foreground text-xs font-mono hover:text-accent transition-colors"
                      data-testid="link-verify-yourself"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Verify yourself on DuckDuckGo
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-border/20 flex items-center justify-between">
          <span className="ai-meta-indicator">
            AI-ASSISTED VERIFICATION
          </span>
          <span className="font-mono text-[10px] text-muted-foreground/40">
            Don't trust the messenger. Verify the source.
          </span>
        </div>
      </div>
    </div>
  );
}
