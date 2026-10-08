import { cn } from "@/src/feature/dashboard/services/utils";
import { getMatchTier, MATCH_TIER_LABEL, MATCH_TIER_TEXT } from "@/src/feature/dashboard/types/status";

interface MatchBadgeProps {
  percent: number;
  /** Grayed out, e.g. on a closed opportunity. */
  muted?: boolean;
  className?: string;
}

/**
 * Match score: the percentage at 19px/600 in the tier color (≥70 teal, 40–69 amber, <40
 * gray) with the tier label beside it, so color is never the only signal.
 */
export default function MatchBadge({ percent, muted = false, className }: MatchBadgeProps) {
  const tier = getMatchTier(percent);

  return (
    <span className={cn("inline-flex items-baseline gap-1.5", className)}>
      <span className={cn("font-semibold text-[19px] leading-6.5", muted ? "text-neutral-400" : MATCH_TIER_TEXT[tier])}>
        {percent}%
      </span>
      <span className={cn("text-caption", muted ? "text-neutral-400" : "text-neutral-600")}>{MATCH_TIER_LABEL[tier]}</span>
    </span>
  );
}
