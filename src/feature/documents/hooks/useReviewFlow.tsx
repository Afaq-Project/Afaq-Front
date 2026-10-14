"use client";

import { useRef, useState } from "react";
import { EssayReviewDialog, type EssaySubmission } from "@/src/feature/ai/components/EssayReviewDialog";
import { reviewNoun } from "@/src/shared/lib/document-types";
import { CREDIT_USAGE } from "@/src/feature/ai/mocks/conversations";
import { REVIEW_QUOTA } from "../mocks/reviews";
import { REVIEWS_UNLIMITED, startReview, useReviews } from "../services/reviewStore";
import type { DocumentReview } from "../types/review";
import type { DocumentItem } from "../types/document";

/**
 * The review dialog for one reviewable document (essay, CV, recommendation letter): open it with
 * `openReview(item)`, render `dialog` once. `onReady` decides what happens when the review is done.
 */
export function useReviewFlow({ onReady }: { onReady: (review: DocumentReview, item: DocumentItem) => void }) {
  const reviews = useReviews();
  const [target, setTarget] = useState<DocumentItem | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const openReview = (item: DocumentItem) => {
    if (reviews.pending.includes(item.id)) return;
    returnFocus.current = document.activeElement as HTMLElement | null;
    setTarget(item);
  };
  const close = () => {
    setTarget(null);
    returnFocus.current?.focus();
  };
  const submit = (essay: EssaySubmission) => {
    const item = target;
    if (!item) return;
    close();
    startReview({
      documentId: item.id,
      essayName: item.name,
      type: item.type,
      purpose: essay.purpose,
      onReady: (review) => onReady(review, item),
    });
  };

  const dialog = (
    <EssayReviewDialog
      open={target !== null}
      onClose={close}
      document={
        target
          ? {
              name: target.name,
              detail: `${target.format} · ${target.size}`,
              hasReview: Boolean(target.review?.reviewedAt),
              noun: reviewNoun(target.type),
            }
          : undefined
      }
      used={reviews.used}
      limit={REVIEW_QUOTA.limit}
      unlimited={REVIEWS_UNLIMITED}
      resetsOn={CREDIT_USAGE.resetsOn}
      onSubmit={submit}
    />
  );

  return { openReview, dialog, pending: reviews.pending };
}
