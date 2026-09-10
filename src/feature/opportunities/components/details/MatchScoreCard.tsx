import Card from "@/src/shared/ui/Card";
import { TickGauge } from "@/src/shared/ui/TickGauge";
import { ProgressBar } from "@/src/shared/ui/ProgressBar";
import { OpportunityDetail } from "../../types/opportunity";
import { getMatchTier, MATCH_TIER_LABEL } from "../../services/utils";

export function MatchScoreCard({
  opportunity,
}: {
  opportunity: OpportunityDetail;
}) {
  const tier = getMatchTier(opportunity.matchScore);

  return (
    <Card>
      <h2 className="text-h2">Match score</h2>

      <div className="flex flex-col items-center gap-3 mt-4">
        <div className="relative w-32 h-32">
          <TickGauge value={opportunity.matchScore} size={128} />
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <span className="text-h1">{opportunity.matchScore}%</span>
          </div>
        </div>
        <p className="text-neutral-600 text-small text-center">
          {MATCH_TIER_LABEL[tier]}
        </p>
      </div>

      <ul className="flex flex-col gap-3 mt-5">
        {opportunity.matchBreakdown.map((item) => (
          <li key={item.label} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-small">
              <span className="text-neutral-700">{item.label}</span>
              <span className="font-medium text-neutral-900">
                {item.score}%
              </span>
            </div>
            <ProgressBar value={item.score} label={item.label} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
