"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Download, FileText, MessageSquare } from "lucide-react";
import { FlagTile } from "@/src/feature/opportunities/components/FlagTile";
import { countryName } from "@/src/shared/lib/countries";
import { isReviewable, reviewNoun } from "@/src/shared/lib/document-types";
import { notify } from "@/src/shared/lib/notify";
import { buttonClasses } from "@/src/shared/ui/Button";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { ErrorState } from "@/src/shared/ui/ErrorState";
import { Skeleton } from "@/src/shared/ui/Skeleton";
import { REVIEW_QUOTA } from "../../mocks/reviews";
import { REVIEWS_UNLIMITED, reviewPath, quotaLeft, seedReviews, toggleSuggestion } from "../../services/reviewStore";
import { DocumentMenu } from "../library/DocumentRows";
import { formatDate, mockItem } from "../../services/utils";
import type { DocumentItem } from "../../types/document";
import { useDocumentActions } from "../../hooks/useDocumentActions";
import { useDocumentItems } from "../../hooks/useDocumentItems";
import { useReviewFlow } from "../../hooks/useReviewFlow";
import { FilePreviewCard, GetFeedbackCard, ReviewingCard } from "./ReviewCards";
import { OverviewCard, ReviewDisclaimer, SuggestionsSection, WeaknessesAndStrengths } from "./ReviewSections";
import { NextReviewCard, UsedForCard, YourFileCard } from "./ReviewSidePanel";

const BACK_LINK_CLASS =
  "inline-flex items-center gap-1.5 rounded-sm w-fit min-h-11 md:min-h-0 text-neutral-600 hover:text-neutral-900 text-small transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400";

/** Back to where the user came from: the AI assistant, an application, or (by default) the list. */
function backLink(from: string | null) {
  if (from === "ai") return { href: "/ai", label: "Back to AI assistant" };
  const application = from?.match(/^application:([\w-]+)$/)?.[1];
  if (application) return { href: `/applications/${application}`, label: "Back to application" };
  return { href: "/documents", label: "Back to your documents" };
}

function UsedIn({ item }: { item: DocumentItem }) {
  if (item.usedIn.length === 0) return <p className="text-neutral-600 text-small">Not used yet</p>;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
      <span className="text-neutral-600 text-small">
        Used in {item.usedIn.length} {item.usedIn.length === 1 ? "application" : "applications"}:
      </span>
      <ul className="flex flex-wrap gap-x-3 gap-y-1">
        {item.usedIn.map((application) => (
          <li key={application.id}>
            <Link
              href={`/applications/${application.id}`}
              className="inline-flex items-center gap-2 rounded-sm min-h-11 md:min-h-0 text-neutral-800 text-small hover:text-neutral-900 hover:underline focus-visible:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              <FlagTile
                countryCode={application.opportunity?.countryCode}
                countryName={application.opportunity?.countryCode ? countryName(application.opportunity.countryCode) : undefined}
                remote={Boolean(application.opportunity?.isRemote) || !application.opportunity?.countryCode}
              />
              {application.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div role="status" className="flex flex-col gap-6">
      <span className="sr-only">Loading review</span>
      <Skeleton className="w-40 h-4" />
      <div aria-hidden="true" className="items-start gap-6 grid grid-cols-1 lg:grid-cols-3">
        <div className="flex sm:flex-row flex-col sm:justify-between gap-4 lg:col-span-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="w-72 max-w-full h-7" />
            <Skeleton className="w-56 max-w-full h-4" />
          </div>
          <Skeleton className="w-40 h-10" />
        </div>
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Skeleton className="rounded-lg w-full h-36" />
          <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
            <Skeleton className="rounded-lg h-40" />
            <Skeleton className="rounded-lg h-40" />
          </div>
          <Skeleton className="rounded-lg w-full h-56" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="rounded-lg h-36" />
          <Skeleton className="rounded-lg h-32" />
          <Skeleton className="rounded-lg h-36" />
        </div>
      </div>
    </div>
  );
}

/**
 * The review page of an essay, CV or recommendation letter at /documents/[id]/review: name, meta, where it's used, download and the ⋯
 * actions, then the review (or, before the first one, the file and an offer to review it).
 * Only those types have this page; other documents redirect to the list. Ids that aren't the user's
 * API documents fall back to the mock documents (doc-1 ... doc-8).
 */
export function DocumentReviewView({ id }: { id: string }) {
  const { userDocs, items, edits, reviews, refresh } = useDocumentItems();
  const router = useRouter();
  const back = backLink(useSearchParams().get("from"));

  const apiItem = items.find((entry) => entry.id === id);
  const item = apiItem ?? (userDocs.isLoading ? undefined : mockItem(id, edits, reviews));
  const reviewable = isReviewable(item?.type);
  const noun = reviewNoun(item?.type);
  const review = reviews.reviews[id];
  const reviewing = reviews.pending.includes(id);

  // A mock essay gets its mock review state like the user's essays do.
  useEffect(() => {
    if (reviews.loaded && item?.mock && item.type === "essay") seedReviews([item]);
  }, [reviews.loaded, item]);

  // Only reviewable types have a page (their review); other documents go back to the list.
  const notReviewable = Boolean(item) && !reviewable;
  useEffect(() => {
    if (notReviewable) router.replace("/documents");
  }, [notReviewable, router]);

  const actions = useDocumentActions({
    refresh,
    onReplaced: (_item, newId) => {
      notify.success("File replaced");
      router.replace(reviewPath(newId));
    },
    onDeleted: () => router.push("/documents"),
  });
  // Started here: the page updates in place when it's ready.
  const reviewFlow = useReviewFlow({ onReady: () => notify.success("Review ready") });

  if (!reviews.loaded || (!item && userDocs.isLoading) || notReviewable) return <DetailSkeleton />;

  if (!item && userDocs.isError) {
    return <ErrorState titleAs="h1" title="We couldn't load this document" onRetry={userDocs.refetch} />;
  }

  if (!item) {
    return (
      <EmptyState
        variant="page"
        titleAs="h1"
        icon={FileText}
        title="We couldn't find this document"
        message="It may have been deleted or replaced."
        action={
          <Link href="/documents" className={buttonClasses("secondary")}>
            Back to your documents
          </Link>
        }
      />
    );
  }

  const added = formatDate(item.addedAt);
  const download = () => actions.download(item);
  const openReview = () => reviewFlow.openReview(item);
  const done = review ? (reviews.done[review.id] ?? []) : [];
  const allDone = Boolean(review && review.suggestions.length > 0 && review.suggestions.every((_, index) => done.includes(index)));
  const remaining = quotaLeft(reviews);
  // Once every suggestion is done, "Review again" in the side panel becomes the one primary action.
  const reviewAgainIsPrimary = allDone && (REVIEWS_UNLIMITED || remaining > 0);

  const backLinkEl = (
    <Link href={back.href} className={BACK_LINK_CLASS}>
      <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" className="rtl:-scale-x-100" />
      {back.label}
    </Link>
  );
  const titleBlock = (
    <div>
      <h1 className="text-h1 text-neutral-900 break-words">{item.name}</h1>
      <p className="mt-1 text-neutral-600 text-small">
        {item.format} · {item.size}
        {added && ` · Added ${added}`}
      </p>
    </div>
  );

  // With a review: the header across the top, then the review (2/3) beside a sticky side panel
  // (1/3) from 1024px; below that, one column with the side panel after the review.
  if (review && !reviewing) {
    return (
      <div className="flex flex-col gap-6">
        {backLinkEl}
        <div className="items-start gap-6 grid grid-cols-1 lg:grid-cols-3">
          <header className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-4 lg:col-span-3">
            <div className="min-w-0">{titleBlock}</div>
            <Link
              href={`/ai?document=${encodeURIComponent(item.id)}`}
              className={buttonClasses(reviewAgainIsPrimary ? "secondary" : "primary", "shrink-0 self-start")}
            >
              <MessageSquare size={16} strokeWidth={1.75} aria-hidden="true" />
              Ask a follow-up
            </Link>
          </header>

          <div className="flex flex-col gap-8 min-w-0 lg:col-span-2">
            <OverviewCard review={review} />
            <WeaknessesAndStrengths review={review} />
            <SuggestionsSection
              review={review}
              documentId={item.id}
              noun={noun}
              done={done}
              onToggle={(index) => toggleSuggestion(review.id, index)}
            />
            {/* TODO: the highlight layout (document text with highlights, "Show in essay", suggested
                rewrites) needs text extraction and position references from the review endpoint. */}
            <ReviewDisclaimer />
          </div>

          {/* Sticky below the 60px top bar and the page's 32px top padding. */}
          <aside aria-label="About this document" className="flex flex-col gap-4 lg:top-[92px] lg:sticky">
            <YourFileCard item={item} noun={noun} onDownload={download} onAction={actions.open} />
            <UsedForCard item={item} onLink={() => actions.open("link", item)} />
            <NextReviewCard
              remaining={remaining}
              limit={REVIEW_QUOTA.limit}
              unlimited={REVIEWS_UNLIMITED}
              allDone={allDone}
              onReview={openReview}
            />
          </aside>
        </div>

        {reviewFlow.dialog}
        {actions.dialog}
      </div>
    );
  }

  const body = reviewing ? (
    <div className="w-full max-w-[800px]">
      <ReviewingCard noun={noun} />
    </div>
  ) : (
    <div className="gap-6 grid grid-cols-1 lg:grid-cols-[3fr_2fr]">
      {/* TODO: show the document's text here once there's text extraction. */}
      <FilePreviewCard item={item} onDownload={download} />
      <GetFeedbackCard noun={noun} remaining={remaining} limit={REVIEW_QUOTA.limit} unlimited={REVIEWS_UNLIMITED} onReview={openReview} />
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {backLinkEl}

      <header className="flex lg:flex-row flex-col lg:justify-between lg:items-start gap-4">
        <div className="flex flex-col gap-2 min-w-0">
          {titleBlock}
          <UsedIn item={item} />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {!item.mock && (
            <button type="button" onClick={download} aria-label={`Download ${item.name}`} className={buttonClasses("ghost", "px-0 size-11 md:size-10")}>
              <Download size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
          )}
          <DocumentMenu item={item} onAction={actions.open} onPage />
        </div>
      </header>

      {body}

      {reviewFlow.dialog}
      {actions.dialog}
    </div>
  );
}
