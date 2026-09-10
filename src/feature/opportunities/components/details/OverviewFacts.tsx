import { Calendar, ExternalLink } from "lucide-react";

import Badge from "@/src/shared/ui/Badge";
import { OpportunityDetail } from "../../types/opportunity";
import { formatDeadlineDate, FUNDING_TONE } from "../../services/utils";

/** Condensed stand-in for ImportantFactsCard, folded into the overview
 * card's footer on small screens where the standalone card is hidden. */
export function OverviewFacts({
  opportunity,
}: {
  opportunity: OpportunityDetail;
}) {
  return (
    <div className="flex flex-wrap justify-end items-center gap-3 pt-3 border-neutral-100 border-t text-caption lg:hidden">
      <span className="flex items-center gap-1.5 text-neutral-600">
        <Calendar size={14} strokeWidth={1.75} />
        {formatDeadlineDate(opportunity.deadlineDate)}
      </span>
      <Badge tone={FUNDING_TONE[opportunity.fundingStatus]}>
        {opportunity.fundingStatus}
      </Badge>
      <a
        href={opportunity.officialLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 font-medium text-primary-700 hover:text-primary-800 hover:underline"
      >
        <ExternalLink size={14} strokeWidth={1.75} />
        Official link
      </a>
    </div>
  );
}
