import { getMatchTier, type MatchTier } from "@/src/feature/dashboard/types/status";
import { content } from "../../content/en";
import { Chip, type ChipTone } from "./Chip";

const TIER_TONE: Record<MatchTier, ChipTone> = { strong: "teal", possible: "amber", low: "neutral" };

/** Match percentage with its tier label (≥70 strong, 40–69 possible, below 40 low), so color is never the only signal. */
export function MatchBadge({ percent, className }: { percent: number; className?: string }) {
  const tier = getMatchTier(percent);
  const value = new Intl.NumberFormat("en", { style: "percent" }).format(percent / 100);

  return (
    <Chip tone={TIER_TONE[tier]} className={className}>
      <span className="font-semibold">{value}</span>
      <span>{content.common.match[tier]}</span>
    </Chip>
  );
}
