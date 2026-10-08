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

/** Solid fills for match-tier bars and legend dots. */
export const MATCH_TIER_FILL: Record<MatchTier, string> = {
  strong: "bg-success-600",
  possible: "bg-warning-400",
  low: "bg-neutral-200",
};

/** Text color for a match percentage shown on its own (no tinted background). */
export const MATCH_TIER_TEXT: Record<MatchTier, string> = {
  strong: "text-success-600",
  possible: "text-warning-600",
  low: "text-neutral-600",
};

/** Arc color for a match donut. */
export const MATCH_TIER_STROKE: Record<MatchTier, string> = {
  strong: "stroke-success-600",
  possible: "stroke-warning-600",
  low: "stroke-neutral-400",
};
