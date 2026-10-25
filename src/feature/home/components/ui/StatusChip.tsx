import { cn } from "@/src/feature/dashboard/services/utils";
import { STATUS_COLORS, type ApplicationStatusKey } from "@/src/shared/lib/status-colors";
import { useLandingContent } from "../../content";

/** Application status pill, using the app's status colors so the landing page matches it. */
export function StatusChip({ status, className }: { status: ApplicationStatusKey; className?: string }) {
  const content = useLandingContent();
  const { chip, icon: Icon } = STATUS_COLORS[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium text-landing-caption whitespace-nowrap",
        chip,
        className,
      )}
    >
      {Icon && <Icon size={12} strokeWidth={2.25} aria-hidden="true" />}
      {content.common.status[status]}
    </span>
  );
}
