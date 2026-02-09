import type { VerifiableClaim as ClaimType } from "@/lib/verifiable-claims";

interface VerifiableClaimProps {
  claim: ClaimType;
  children: React.ReactNode;
  onActivate: (claim: ClaimType) => void;
}

const categoryIndicators: Record<string, string> = {
  statistic: "[DATA]",
  historical: "[HIST]",
  technical: "[TECH]",
  research: "[REF]",
};

export function VerifiableClaimInline({ claim, children, onActivate }: VerifiableClaimProps) {
  return (
    <span
      className="verifiable-claim relative cursor-pointer inline"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onActivate(claim);
      }}
      title="Click to verify this claim with live evidence"
      data-testid={`claim-${claim.id}`}
      data-claim-id={claim.id}
      data-claim-category={claim.category}
    >
      {children}
      <span className="ml-1 font-mono text-[9px] text-accent/40 align-super select-none">
        {categoryIndicators[claim.category] || "[?]"}
      </span>
    </span>
  );
}
