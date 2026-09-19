"use client";

import { CheckCircle2, AlertTriangle, MinusCircle } from "lucide-react";
import { Pie, PieChart } from "recharts";
import Card from "@/src/shared/ui/Card";
import { OpportunityDetail } from "../../types/opportunity";
import {
  getMatchTier,
  MATCH_TIER_LABEL,
  type MatchTier,
} from "../../services/utils";

const MATCH_TIER_STYLE: Record<
  MatchTier,
  { text: string; icon: typeof CheckCircle2 }
> = {
  strong: { text: "text-success-600", icon: CheckCircle2 },
  possible: { text: "text-warning-600", icon: AlertTriangle },
  low: { text: "text-neutral-500", icon: MinusCircle },
};

// One segment per breakdown item, darkest to lightest — all in the brand
// green so the ring reads as "one score, several parts."
const BREAKDOWN_SEGMENT_COLORS = [
  { fill: "fill-primary-800", dot: "bg-primary-800" },
  { fill: "fill-primary-600", dot: "bg-primary-600" },
  { fill: "fill-primary-400", dot: "bg-primary-400" },
  { fill: "fill-primary-200", dot: "bg-primary-200" },
];

export function MatchScoreCard({
  opportunity,
}: {
  opportunity: OpportunityDetail;
}) {
  const tier = getMatchTier(opportunity.matchScore);
  const tierStyle = MATCH_TIER_STYLE[tier];
  const TierIcon = tierStyle.icon;
  const chartData = opportunity.matchBreakdown.map((item, index) => ({
    ...item,
    className:
      BREAKDOWN_SEGMENT_COLORS[index % BREAKDOWN_SEGMENT_COLORS.length].fill,
  }));

  return (
    <Card>
      <h2 className="text-h2">Match score</h2>

      <div className="flex flex-col items-center gap-3 mt-4">
        <div className="relative w-36 h-36">
          <div
            className="absolute inset-0 opacity-60 blur-2xl"
            style={{
              backgroundImage:
                "radial-gradient(circle, #c0dd97 0%, transparent 70%)",
            }}
            aria-hidden="true"
          />
          <PieChart width={144} height={144} className="relative">
            <Pie
              data={chartData}
              dataKey="score"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="100%"
              paddingAngle={4}
              cornerRadius={6}
              startAngle={90}
              endAngle={-270}
              stroke="none"
              isAnimationActive={false}
            />
          </PieChart>
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <span className="text-h1">{opportunity.matchScore}%</span>
          </div>
        </div>
        <p
          className={`flex items-start gap-1.5 text-small text-center ${tierStyle.text}`}
        >
          <TierIcon size={16} strokeWidth={2} className="shrink-0 mt-0.5" />
          {MATCH_TIER_LABEL[tier]}
        </p>
      </div>

      <ul className="flex flex-col gap-2.5 mt-5">
        {opportunity.matchBreakdown.map((item, index) => (
          <li
            key={item.label}
            className="flex justify-between items-center text-small"
          >
            <span className="flex items-center gap-2 text-neutral-700">
              <span
                className={`rounded-full w-2.5 h-2.5 ${BREAKDOWN_SEGMENT_COLORS[index % BREAKDOWN_SEGMENT_COLORS.length].dot}`}
              />
              {item.label}
            </span>
            <span className="font-medium text-neutral-900">
              {item.score}%
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
