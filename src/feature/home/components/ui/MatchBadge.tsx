import { getMatchTier, type MatchTier } from "@/src/feature/dashboard/types/status";
import { useLocale } from "next-intl";
import { intlLocale } from "@/src/i18n/format";
import { useLandingContent } from "../../content";
import { Chip, type ChipTone } from "./Chip";

const TIER_TONE: Record<MatchTier, ChipTone> = { strong: "teal", possible: "amber", low: "neutral" };

/** Match percentage with its tier label (≥70 strong, 40–69 possible, below 40 low), so color is never the only signal. */
export function MatchBadge({ percent, className }: { percent: number; className?: string }) {
  const content = useLandingContent();
  const tier = getMatchTier(percent);
  const locale = useLocale();
  const value = new Intl.NumberFormat(intlLocale(locale), { style: "percent" }).format(percent / 100);

  return (
    <Chip tone={TIER_TONE[tier]} className={className}>
      <span className="font-semibold">{value}</span>
      <span>{content.common.match[tier]}</span>
    </Chip>
  );
}
