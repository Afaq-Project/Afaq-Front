import Badge from "@/src/shared/ui/Badge";
import { STATUS_LABEL, type ApplicationStatus } from "../types/status";

/** Application status as a tinted pill; colors come from STATUS_COLORS. */
export function StatusChip({ status, className }: { status: ApplicationStatus; className?: string }) {
  return (
    <Badge status={status} className={className}>
      {STATUS_LABEL[status]}
    </Badge>
  );
}
