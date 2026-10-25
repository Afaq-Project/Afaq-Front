import Badge from "@/src/shared/ui/Badge";
import type { ApplicationStatus } from "../types/status";
import { useTranslations } from "next-intl";

/** Application status as a tinted pill; colors come from STATUS_COLORS. */
export function StatusChip({ status, className }: { status: ApplicationStatus; className?: string }) {
  const t = useTranslations("applicationStatus");
  return (
    <Badge status={status} className={className}>
      {t(status)}
    </Badge>
  );
}
