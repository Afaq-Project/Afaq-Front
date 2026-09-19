import { AlertTriangle, CheckCircle2, Lightbulb, Loader2, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import Card from "@/src/shared/ui/Card";
import type { DocumentReview } from "../types/review";

const SECTIONS: {
  key: keyof Pick<DocumentReview, "strengths" | "improvements" | "suggestions">;
  label: string;
  icon: LucideIcon;
  chipClass: string;
  iconClass: string;
}[] = [
  {
    key: "strengths",
    label: "Strengths",
    icon: CheckCircle2,
    chipClass: "bg-success-50",
    iconClass: "text-success-600",
  },
  {
    key: "improvements",
    label: "Improvements",
    icon: AlertTriangle,
    chipClass: "bg-warning-50",
    iconClass: "text-warning-600",
  },
  {
    key: "suggestions",
    label: "Suggestions",
    icon: Lightbulb,
    chipClass: "bg-info-50",
    iconClass: "text-info-600",
  },
];

export function DocumentReviewResultsCard({
  review,
  onRequestReview,
  isReviewing,
  onApplySuggestions,
  isApplying,
  quotaExhausted,
}: {
  review: DocumentReview | null;
  onRequestReview: () => void;
  isReviewing: boolean;
  onApplySuggestions: () => void;
  isApplying: boolean;
  quotaExhausted: boolean;
}) {
  return (
    <Card className="flex flex-col gap-4">
      <h2 className="text-h2">Review Results</h2>

      {!review ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <span className="flex justify-center items-center bg-primary-50 rounded-full w-12 h-12 text-primary-800">
            <Sparkles size={20} strokeWidth={1.75} />
          </span>
          <p className="font-medium text-neutral-800 text-small">
            No review yet
          </p>
          <p className="max-w-xs text-neutral-500 text-caption">
            Request an AI review to see strengths, improvements, and
            suggestions for this document.
          </p>

          <button
            type="button"
            onClick={onRequestReview}
            disabled={isReviewing || quotaExhausted}
            className="inline-flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-800 disabled:opacity-50 mt-3 px-5 rounded-sm w-fit h-10 font-medium text-white text-sm transition-colors disabled:pointer-events-none"
          >
            {isReviewing ? (
              <Loader2 size={16} strokeWidth={2} className="animate-spin" />
            ) : (
              <Sparkles size={16} strokeWidth={2} />
            )}
            {isReviewing ? "Reviewing..." : "Request Review"}
          </button>

          {quotaExhausted && (
            <p className="text-danger-800 text-caption">
              You&apos;ve used all your AI reviews for this month.
            </p>
          )}
        </div>
      ) : (
        <>
          {SECTIONS.map(({ key, label, icon: Icon, chipClass, iconClass }) => (
            <div key={key} className={`p-4 rounded-md ${chipClass}`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} strokeWidth={2} className={iconClass} />
                <h3 className="font-semibold text-neutral-900 text-small">
                  {label}
                </h3>
              </div>
              <ul className="flex flex-col gap-1.5 pl-1 text-neutral-700 text-small list-disc list-inside">
                {review[key].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}

          <button
            type="button"
            onClick={onApplySuggestions}
            disabled={isApplying}
            className="inline-flex justify-center items-center gap-2 bg-primary-900 hover:bg-primary-800 disabled:opacity-50 px-4 rounded-sm w-full h-10 font-medium text-white text-sm transition-colors disabled:pointer-events-none"
          >
            {isApplying ? (
              <Loader2 size={16} strokeWidth={2} className="animate-spin" />
            ) : (
              <Sparkles size={16} strokeWidth={2} />
            )}
            {isApplying ? "Applying..." : "Apply Suggestions with AI"}
          </button>

          <p className="text-neutral-400 text-caption">
            Reviewed {review.reviewedOn}
          </p>
        </>
      )}
    </Card>
  );
}
