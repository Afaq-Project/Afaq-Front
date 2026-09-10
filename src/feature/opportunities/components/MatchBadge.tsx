import { Sparkles } from "lucide-react";

import { cn } from "@/src/feature/dashboard/services/utils";
import { getMatchTier, MATCH_BADGE_CLASSES } from "../services/utils";

interface MatchBadgeProps {
  percent: number;
}

export default function MatchBadge({ percent }: MatchBadgeProps) {
  return (
    <span
      className={cn(
        "absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white shadow-card ring-1 ring-white/30",
        MATCH_BADGE_CLASSES[getMatchTier(percent)],
      )}
    >
      <Sparkles size={13} strokeWidth={2.25} />
      <span className="font-bold text-small leading-none">{percent}%</span>
      <span className="font-medium text-caption text-white/85 leading-none">
        Match
      </span>
    </span>
  );
}
