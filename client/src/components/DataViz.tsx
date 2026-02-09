import { useState, useEffect, useRef } from "react";

interface DataBarProps {
  label: string;
  value: number;
  maxValue: number;
  color?: "teal" | "magenta" | "muted";
  suffix?: string;
}

function DataBar({ label, value, maxValue, color = "teal", suffix = "" }: DataBarProps) {
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setAnimated(true), 200);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const pct = Math.min((Math.abs(value) / maxValue) * 100, 100);

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-xs text-foreground/70">{label}</span>
        <span className="font-mono text-xs text-foreground/90 font-medium">
          {value > 0 ? "+" : ""}{value}{suffix}
        </span>
      </div>
      <div className="w-full h-1.5 bg-muted/30 rounded-sm overflow-hidden">
        <div
          className={`data-bar data-bar-${color}`}
          style={{ width: animated ? `${pct}%` : "0%" }}
        />
      </div>
    </div>
  );
}

export function LiteracyDeclineViz() {
  return (
    <div className="data-viz" data-testid="viz-literacy-decline">
      <div className="space-y-1 mb-4">
        <h4 className="font-mono text-xs text-accent/70 tracking-wider uppercase">U.S. Adult Skills Decline (PIAAC 2017-2023)</h4>
        <p className="font-mono text-[10px] text-muted-foreground/50">Source: OECD PIAAC Cycle 2</p>
      </div>
      <div className="space-y-3">
        <DataBar label="Literacy" value={-12} maxValue={20} color="teal" suffix=" pts" />
        <DataBar label="Numeracy" value={-7} maxValue={20} color="magenta" suffix=" pts" />
      </div>
      <div className="mt-4 pt-3 border-t border-border/20">
        <p className="font-mono text-[10px] text-muted-foreground/40">
          Sharpest declines in measured history of the assessment
        </p>
      </div>
    </div>
  );
}

export function NAEPDeclineViz() {
  return (
    <div className="data-viz" data-testid="viz-naep-decline">
      <div className="space-y-1 mb-4">
        <h4 className="font-mono text-xs text-accent/70 tracking-wider uppercase">NAEP Long-Term Trends: 13-Year-Olds (2012-2023)</h4>
        <p className="font-mono text-[10px] text-muted-foreground/50">Source: NCES/NAEP</p>
      </div>
      <div className="space-y-3">
        <DataBar label="Reading" value={-7} maxValue={20} color="teal" suffix=" pts" />
        <DataBar label="Mathematics" value={-14} maxValue={20} color="magenta" suffix=" pts" />
      </div>
      <div className="mt-4 pt-3 border-t border-border/20">
        <p className="font-mono text-[10px] text-muted-foreground/40">
          Largest math decline in 50+ years of assessment history
        </p>
      </div>
    </div>
  );
}

export function TechPhaseViz() {
  const phases = [
    { label: "Phase 1: Discovery", description: "Capability appears. Open potential.", width: 25, status: "complete" as const },
    { label: "Phase 2: Fragmentation", description: "Chopped into sellable units.", width: 50, status: "active" as const },
    { label: "Phase 3: Recomposition", description: "Unified substrate. Real power.", width: 25, status: "future" as const },
  ];

  return (
    <div className="data-viz" data-testid="viz-tech-phases">
      <div className="space-y-1 mb-4">
        <h4 className="font-mono text-xs text-accent/70 tracking-wider uppercase">Technology Lifecycle Pattern</h4>
        <p className="font-mono text-[10px] text-muted-foreground/50">AI is currently in Phase 2</p>
      </div>
      <div className="flex gap-px h-8 rounded-sm overflow-hidden">
        {phases.map((phase) => (
          <div
            key={phase.label}
            className={`flex items-center justify-center text-center px-2 ${
              phase.status === "complete" ? "bg-accent/20" :
              phase.status === "active" ? "bg-accent/40 ring-1 ring-accent/60 ring-inset" :
              "bg-muted/20 border border-dashed border-muted-foreground/20"
            }`}
            style={{ width: `${phase.width}%` }}
          >
            <span className={`font-mono text-[9px] truncate ${
              phase.status === "active" ? "text-accent font-medium" : "text-muted-foreground/60"
            }`}>
              {phase.label.split(":")[0]}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-3 space-y-1.5">
        {phases.map((phase) => (
          <div key={phase.label} className="flex items-baseline gap-2">
            <span className={`font-mono text-[10px] ${phase.status === "active" ? "text-accent" : "text-muted-foreground/50"}`}>
              {phase.status === "active" ? ">" : " "}
            </span>
            <span className={`font-mono text-[10px] ${phase.status === "active" ? "text-foreground/80" : "text-muted-foreground/40"}`}>
              {phase.label}: {phase.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ConvergenceViz() {
  return (
    <div className="data-viz" data-testid="viz-convergence">
      <div className="space-y-1 mb-4">
        <h4 className="font-mono text-xs text-accent/70 tracking-wider uppercase">Convergence of Three Forces</h4>
      </div>
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-accent mt-1.5 flex-shrink-0" />
          <div>
            <span className="font-mono text-xs text-foreground/80 block">Capability Gap Widening</span>
            <span className="font-mono text-[10px] text-muted-foreground/50">AI systems advancing faster than governance</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'hsl(330, 70%, 55%)' }} />
          <div>
            <span className="font-mono text-xs text-foreground/80 block">Oversight Capacity Narrowing</span>
            <span className="font-mono text-[10px] text-muted-foreground/50">Population skills for oversight declining</span>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/40 mt-1.5 flex-shrink-0" />
          <div>
            <span className="font-mono text-xs text-foreground/80 block">Economic Structure Fragmenting</span>
            <span className="font-mono text-[10px] text-muted-foreground/50">Market incentives prevent unified AGI development</span>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border/20">
        <p className="font-mono text-[10px] text-accent/50 italic">
          Each force reinforces the others. The loop tightens with each cycle.
        </p>
      </div>
    </div>
  );
}
