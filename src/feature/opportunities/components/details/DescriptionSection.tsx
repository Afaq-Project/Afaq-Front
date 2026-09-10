import Card from "@/src/shared/ui/Card";
import Badge from "@/src/shared/ui/Badge";
import { OpportunityDetail } from "../../types/opportunity";

export function DescriptionSection({
  opportunity,
}: {
  opportunity: OpportunityDetail;
}) {
  return (
    <Card>
      <div className="flex justify-between items-center gap-3">
        <h2 className="text-h2">About this opportunity</h2>
        <Badge matchScore={opportunity.matchScore} className="shrink-0">
          {opportunity.matchScore}% avg match
        </Badge>
      </div>
      <p className="mt-3 text-neutral-700 text-body">
        {opportunity.description}
      </p>
    </Card>
  );
}
