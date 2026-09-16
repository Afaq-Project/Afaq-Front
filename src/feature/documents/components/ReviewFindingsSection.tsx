import { LucideIcon } from "lucide-react";
import { ReviewFinding } from "@/feature/documents/types/document.types";
import { cn } from "@/shared/utils/cn";

interface ReviewFindingsSectionProps {
  title: string;
  icon: LucideIcon;
  findings: ReviewFinding[];
  tone: "success" | "info" | "warning";
}

const TONE_STYLES: Record<ReviewFindingsSectionProps["tone"], { border: string; icon: string; title: string }> = {
  success: { border: "border-green-200 bg-green-50/50", icon: "text-green-600", title: "text-green-800" },
  info: { border: "border-blue-200 bg-blue-50/50", icon: "text-blue-600", title: "text-blue-800" },
  warning: { border: "border-amber-200 bg-amber-50/50", icon: "text-amber-600", title: "text-amber-800" },
};

export function ReviewFindingsSection({
  title,
  icon: Icon,
  findings,
  tone,
}: ReviewFindingsSectionProps) {
  const styles = TONE_STYLES[tone];

  return (
    <div className={cn("rounded-xl border p-4", styles.border)}>
      <div className="flex items-center gap-2">
        <Icon size={16} className={styles.icon} />
        <h3 className={cn("text-sm font-semibold", styles.title)}>{title}</h3>
      </div>
      <ul className="mt-3 space-y-2">
        {findings.map((finding) => (
          <li
            key={finding.id}
            className="list-disc pl-4 text-sm leading-relaxed text-stone-600 marker:text-stone-400"
          >
            {finding.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
