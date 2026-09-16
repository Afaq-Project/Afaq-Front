import { ExternalLink, TriangleAlert } from "lucide-react";
import { EligibilityAlert } from "@/feature/chat/types/chat.types";

interface EligibilityAlertCardProps {
  alert: EligibilityAlert;
}

export function EligibilityAlertCard({ alert }: EligibilityAlertCardProps) {
  return (
    <div className="max-w-[85%] rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
      <div className="flex items-center gap-2">
        <TriangleAlert size={16} className="text-amber-600" />
        <h3 className="text-sm font-semibold text-stone-900">{alert.title}</h3>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        {alert.description}
      </p>
      <a
        href={alert.linkHref}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-stone-700 hover:underline"
      >
        {alert.linkLabel}
        <ExternalLink size={13} />
      </a>
    </div>
  );
}
