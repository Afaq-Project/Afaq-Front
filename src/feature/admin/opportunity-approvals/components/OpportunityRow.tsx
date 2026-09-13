import { Check, ChevronDown, ChevronRight, X } from "lucide-react";

import Badge from "@/src/shared/ui/Badge";
import { OpportunitySubmission } from "../types/opportunity";
import { DUPLICATE_BADGE_TONE, TYPE_TONE } from "../types/status";
import { formatDate } from "../services/utils";
import { OpportunityDetailPanel } from "./OpportunityDetailPanel";

export function OpportunityRow({
  opportunity,
  expanded,
  onToggleExpand,
  onApprove,
  onReject,
}: {
  opportunity: OpportunitySubmission;
  expanded: boolean;
  onToggleExpand: (id: string) => void;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const duplicateLabel = opportunity.duplicateOf
    ? `Possible duplicate — matches "${opportunity.duplicateOf.title}" (${opportunity.duplicateOf.provider}) on ${opportunity.duplicateOf.matchedOn.join(", ")}`
    : undefined;

  return (
    <>
      <tr className="border-neutral-100 border-t even:bg-neutral-50">
        <td className="px-5 py-4">
          <button
            type="button"
            onClick={() => onToggleExpand(opportunity.id)}
            aria-label={expanded ? "Collapse details" : "Expand details"}
            aria-expanded={expanded}
            className="flex items-start gap-2 text-left"
          >
            {expanded ? (
              <ChevronDown size={16} strokeWidth={1.75} className="flex-shrink-0 mt-0.5 text-neutral-500" />
            ) : (
              <ChevronRight size={16} strokeWidth={1.75} className="flex-shrink-0 mt-0.5 text-neutral-500" />
            )}
            <span>
              <span className="block font-medium text-neutral-900 text-small">
                {opportunity.title}
              </span>
              {opportunity.duplicateOf && (
                <span
                  className="block mt-1 w-fit"
                  title={duplicateLabel}
                >
                  <Badge tone={DUPLICATE_BADGE_TONE} className="bg-warning-400/25">
                    Possible duplicate
                  </Badge>
                </span>
              )}
            </span>
          </button>
        </td>
        <td className="px-5 py-4 text-neutral-700 text-small whitespace-nowrap">
          {opportunity.provider}
        </td>
        <td className="px-5 py-4 whitespace-nowrap">
          <Badge tone={TYPE_TONE[opportunity.type]}>{opportunity.type}</Badge>
        </td>
        <td className="px-5 py-4 text-neutral-700 text-small whitespace-nowrap">
          {opportunity.source}
        </td>
        <td className="px-5 py-4 text-neutral-700 text-small whitespace-nowrap">
          {formatDate(opportunity.deadline)}
        </td>
        <td className="px-5 py-4 text-neutral-700 text-small whitespace-nowrap">
          {formatDate(opportunity.dateScraped)}
        </td>
        <td className="px-5 py-4 text-right whitespace-nowrap">
          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={() => onApprove(opportunity.id)}
              className="inline-flex items-center gap-1.5 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-sm font-medium text-primary-800 text-caption sm:text-small transition-colors"
            >
              <Check size={14} strokeWidth={2} />
              Approve
            </button>
            <button
              type="button"
              onClick={() => onReject(opportunity.id)}
              className="inline-flex items-center gap-1.5 bg-danger-50 hover:bg-danger-100 px-3 py-2 rounded-sm font-medium text-danger-800 text-caption sm:text-small transition-colors"
            >
              <X size={14} strokeWidth={2} />
              Reject
            </button>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="border-neutral-100 border-t">
          <td colSpan={7} className="p-0">
            <OpportunityDetailPanel opportunity={opportunity} />
          </td>
        </tr>
      )}
    </>
  );
}
