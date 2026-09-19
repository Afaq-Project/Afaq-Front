import Badge from "@/src/shared/ui/Badge";
import { PENDING_BADGE_TONE } from "../types/status";

export function ApprovalQueueHeader({ pendingCount }: { pendingCount: number }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-h1">Opportunity approval</h1>
        <Badge tone={PENDING_BADGE_TONE} className="bg-warning-400/25">
          {pendingCount} pending
        </Badge>
      </div>
      <p className="mt-1 text-neutral-600 text-small">
        Review scraped opportunities before they go live to students.
      </p>
    </div>
  );
}
