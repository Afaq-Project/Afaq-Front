import Link from "next/link";
import { Eye, Pencil, XCircle } from "lucide-react";

import Badge from "@/src/shared/ui/Badge";
import { ManagedOpportunity } from "../types/opportunity";
import { STATUS_TONE, TYPE_TONE } from "../types/status";
import { formatDate, getOpportunityStatus } from "../services/utils";

export function OpportunityRow({
  opportunity,
  onEdit,
  onUnpublish,
}: {
  opportunity: ManagedOpportunity;
  onEdit: (id: string) => void;
  onUnpublish: (id: string) => void;
}) {
  const status = getOpportunityStatus(opportunity);

  return (
    <tr className="border-neutral-100 border-t even:bg-neutral-50">
      <td className="px-5 py-4">
        <p className="font-medium text-neutral-900 text-small">{opportunity.title}</p>
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <Badge tone={TYPE_TONE[opportunity.type]}>{opportunity.type}</Badge>
      </td>
      <td className="px-5 py-4 text-neutral-700 text-small whitespace-nowrap">
        {opportunity.provider}
      </td>
      <td className="px-5 py-4">
        <div className="flex flex-wrap gap-1 max-w-56">
          {opportunity.fieldsOfStudy.map((field) => (
            <Badge key={field} tone="gray">
              {field}
            </Badge>
          ))}
        </div>
      </td>
      <td className="px-5 py-4 text-neutral-700 text-small whitespace-nowrap">
        {formatDate(opportunity.deadline)}
      </td>
      <td className="px-5 py-4 whitespace-nowrap">
        <Badge tone={STATUS_TONE[status]} className={status === "Live" ? "bg-success-400/25" : undefined}>
          {status}
        </Badge>
      </td>
      <td className="px-5 py-4 text-right whitespace-nowrap">
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit(opportunity.id)}
            className="inline-flex items-center gap-1.5 bg-neutral-100 hover:opacity-80 px-3 py-2 rounded-sm font-medium text-neutral-800 text-caption sm:text-small transition-colors"
          >
            <Pencil size={14} strokeWidth={1.75} />
            Edit
          </button>

          {status === "Live" && (
            <button
              type="button"
              onClick={() => onUnpublish(opportunity.id)}
              className="inline-flex items-center gap-1.5 bg-danger-50 hover:bg-danger-100 px-3 py-2 rounded-sm font-medium text-danger-800 text-caption sm:text-small transition-colors"
            >
              <XCircle size={14} strokeWidth={1.75} />
              Unpublish
            </button>
          )}

          <Link
            href={`/admin/opportunities/manage/${opportunity.id}`}
            className="inline-flex items-center gap-1.5 bg-primary-50 hover:bg-primary-100 px-3 py-2 rounded-sm font-medium text-primary-800 text-caption sm:text-small transition-colors"
          >
            <Eye size={14} strokeWidth={1.75} />
            View details
          </Link>
        </div>
      </td>
    </tr>
  );
}
