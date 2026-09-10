export type MatchTier = "strong" | "possible" | "low";

export function getMatchTier(scorePercent: number): MatchTier {
  if (scorePercent >= 70) return "strong";
  if (scorePercent >= 40) return "possible";
  return "low";
}

export const MATCH_TIER_LABEL: Record<MatchTier, string> = {
  strong: "Strong match",
  possible: "Possible match",
  low: "Low match",
};

export const MATCH_TIER_BADGE_CLASSES: Record<MatchTier, string> = {
  strong: "bg-success-50 text-success-800",
  possible: "bg-warning-50 text-warning-800",
  low: "bg-neutral-50 text-neutral-800",
};
