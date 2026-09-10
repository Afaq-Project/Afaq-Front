import Link from "next/link";
import { ArrowRight, PartyPopper } from "lucide-react";

import Badge from "@/src/shared/ui/Badge";
import { cn } from "@/src/feature/dashboard/services/utils";
import { ApplicationSummary } from "../types/application";
import {
  ACTION_TONE,
  STATUS_BADGE_TINT,
  STATUS_LABEL,
  STATUS_TONE,
  TONE_BUTTON_CLASSES,
} from "../types/status";
import {
  formatDeadline,
  getApplicationAction,
  getDeadlineTextClass,
} from "../services/utils";

export function ApplicationRow({
  application,
}: {
  application: ApplicationSummary;
}) {
  const action = getApplicationAction(application.status);

  return (
    <tr className="border-neutral-100 border-t even:bg-neutral-50">
      <td className="px-5 py-4">
        <p className="font-medium text-neutral-900 text-small">
          {application.title}
        </p>
        <p className="text-neutral-500 text-caption">{application.provider}</p>
      </td>
      <td
        className={cn(
          "px-5 py-4 font-medium text-small whitespace-nowrap",
          getDeadlineTextClass(application),
        )}
      >
        {formatDeadline(application.daysLeft)}
      </td>
      <td className="px-5 py-4">
        <Badge
          tone={STATUS_TONE[application.status]}
          className={STATUS_BADGE_TINT[STATUS_TONE[application.status]]}
        >
          {application.status === "accepted" && (
            <PartyPopper size={12} strokeWidth={2} className="mr-1" />
          )}
          {STATUS_LABEL[application.status]}
        </Badge>
      </td>
      <td className="px-5 py-4 text-right whitespace-nowrap">
        <Link
          href={`/applications/${application.id}`}
          className={cn(
            "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-sm font-medium text-caption sm:text-small transition-colors",
            TONE_BUTTON_CLASSES[ACTION_TONE[application.status]],
          )}
        >
          {action.label}
          <ArrowRight size={14} strokeWidth={1.75} />
        </Link>
      </td>
    </tr>
  );
}
