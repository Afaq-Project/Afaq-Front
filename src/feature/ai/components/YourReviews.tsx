import Link from "next/link";
import { FileText } from "lucide-react";
import { reviewPath } from "@/src/feature/documents/services/reviewStore";
import type { DocumentReview } from "@/src/feature/documents/types/review";

const formatDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** "Your reviews" in the AI sidebar: one row per reviewed document, newest first, each opening its review page. */
export function YourReviews({ reviews, nameFor }: { reviews: DocumentReview[]; nameFor: (review: DocumentReview) => string }) {
  const rows = reviews
    .filter((review): review is DocumentReview & { documentId: string } => Boolean(review.documentId))
    .sort((a, b) => b.reviewedAt.localeCompare(a.reviewedAt));
  if (rows.length === 0) return null;

  return (
    <section aria-labelledby="your-reviews-heading" className="mt-2 pt-3 border-neutral-100 border-t">
      <h2 id="your-reviews-heading" className="px-2 pb-2 text-h3 text-neutral-900">
        Your reviews
      </h2>
      <ul className="flex flex-col gap-0.5">
        {rows.map((review) => (
          <li key={review.documentId}>
            <Link
              href={reviewPath(review.documentId, "ai")}
              className="flex items-center gap-2.5 hover:bg-neutral-50 px-2 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 min-h-11"
            >
              <span aria-hidden="true" className="flex justify-center items-center bg-neutral-50 rounded-md size-8 text-neutral-600 shrink-0">
                <FileText size={15} strokeWidth={1.75} />
              </span>
              <span className="flex flex-col min-w-0">
                <span className="text-neutral-800 text-small truncate">{nameFor(review)}</span>
                <span className="text-caption text-neutral-600">
                  Reviewed {formatDate(review.reviewedAt)} · {review.suggestions.length} suggestions
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
