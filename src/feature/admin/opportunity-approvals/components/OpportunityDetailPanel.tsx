import { ExternalLink } from "lucide-react";
import { OpportunitySubmission } from "../types/opportunity";

export function OpportunityDetailPanel({
  opportunity,
}: {
  opportunity: OpportunitySubmission;
}) {
  return (
    <div className="gap-5 grid grid-cols-1 md:grid-cols-2 bg-neutral-50 px-5 py-5">
      <div>
        <p className="font-medium text-neutral-800 text-caption uppercase tracking-wide">
          Description
        </p>
        <p className="mt-1.5 text-neutral-700 text-small">{opportunity.description}</p>
      </div>

      <div>
        <p className="font-medium text-neutral-800 text-caption uppercase tracking-wide">
          Eligibility
        </p>
        <p className="mt-1.5 text-neutral-700 text-small">{opportunity.eligibility}</p>
      </div>

      <div className="md:col-span-2">
        <a
          href={opportunity.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 font-medium text-primary-600 hover:text-primary-800 text-small"
        >
          View original source
          <ExternalLink size={14} strokeWidth={1.75} />
        </a>
      </div>
    </div>
  );
}
