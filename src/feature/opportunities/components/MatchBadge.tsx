import { Sparkles } from "lucide-react";

import { cn } from "@/src/feature/dashboard/services/utils";
import {
  getMatchTier,
  MATCH_TIER_BADGE_CLASSES,
  MATCH_TIER_LABEL,
} from "@/src/feature/dashboard/types/status";

interface MatchBadgeProps {
  percent: number;
  className?: string;
}

/** "98% match" as a tinted pill in the match-tier color (≥70 teal, 40–69 amber, <40 gray). */
export default function MatchBadge({ percent, className }: MatchBadgeProps) {
  const tier = getMatchTier(percent);

  return (
    <span
      title={MATCH_TIER_LABEL[tier]}
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-caption",
        MATCH_TIER_BADGE_CLASSES[tier],
        className,
      )}
    >
      <Sparkles size={12} strokeWidth={2} aria-hidden="true" />
      {percent}% match
      <span className="sr-only">, {MATCH_TIER_LABEL[tier].toLowerCase()}</span>
    </span>
  );
}
