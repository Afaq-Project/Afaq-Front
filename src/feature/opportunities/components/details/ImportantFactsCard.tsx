import { Calendar, ExternalLink, Wallet } from "lucide-react";

import Card from "@/src/shared/ui/Card";
import Badge from "@/src/shared/ui/Badge";
import { OpportunityDetail } from "../../types/opportunity";
import {
  formatDaysLeft,
  formatDeadlineDate,
  FUNDING_TONE,
} from "../../services/utils";

export function ImportantFactsCard({
  opportunity,
}: {
  opportunity: OpportunityDetail;
}) {
  return (
    <Card>
      <h2 className="text-h2">Important facts</h2>

      <ul className="flex flex-col gap-4 mt-4">
        <li className="flex items-start gap-3">
          <span className="flex justify-center items-center bg-neutral-100 rounded-md w-9 h-9 shrink-0">
            <Calendar size={16} strokeWidth={1.75} className="text-neutral-700" />
          </span>
          <div>
            <p className="text-neutral-500 text-caption">Deadline</p>
            <p className="font-medium text-neutral-900 text-small">
              {formatDeadlineDate(opportunity.deadlineDate)}
            </p>
            <p className="text-neutral-500 text-caption">
              {formatDaysLeft(opportunity.daysLeft)}
            </p>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <span className="flex justify-center items-center bg-neutral-100 rounded-md w-9 h-9 shrink-0">
            <Wallet size={16} strokeWidth={1.75} className="text-neutral-700" />
          </span>
          <div>
            <p className="text-neutral-500 text-caption">Funding status</p>
            <Badge tone={FUNDING_TONE[opportunity.fundingStatus]} className="mt-1">
              {opportunity.fundingStatus}
            </Badge>
          </div>
        </li>

        <li className="flex items-start gap-3">
          <span className="flex justify-center items-center bg-neutral-100 rounded-md w-9 h-9 shrink-0">
            <ExternalLink size={16} strokeWidth={1.75} className="text-neutral-700" />
          </span>
          <div className="min-w-0">
            <p className="text-neutral-500 text-caption">Official link</p>
            <a
              href={opportunity.officialLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-primary-700 hover:text-primary-800 text-small hover:underline truncate block"
            >
              Visit official page
            </a>
          </div>
        </li>
      </ul>
    </Card>
  );
}
