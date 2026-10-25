"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Info, MessageSquare, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { buttonClasses } from "@/src/shared/ui/Button";
import { ProgressBar } from "@/src/shared/ui/ProgressBar";
import type { DocumentReview } from "../../types/review";
import { formatDate } from "../../services/utils";

const plural = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

/** "Ask about this": the AI assistant about this document, with the point prefilled as the question. */
const askHref = (documentId: string, text: string) =>
  `/ai?document=${encodeURIComponent(documentId)}&q=${encodeURIComponent(text)}`;

function AskLink({ documentId, text, what }: { documentId: string; text: string; what: string }) {
  return (
    <Link
      href={askHref(documentId, text)}
      aria-label={`Ask about this ${what}: ${text}`}
      className={buttonClasses("ghost", "self-start gap-1.5 -ms-2 px-2 h-9 md:h-8 text-small")}
    >
      <MessageSquare size={14} strokeWidth={1.75} aria-hidden="true" />
      Ask about this
    </Link>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span className="flex justify-center items-center bg-neutral-100 px-1.5 rounded-full min-w-5 h-5 font-medium text-caption text-neutral-600">
      {count}
    </span>
  );
}

function SectionHeading({ id, title, count, children }: { id: string; title: string; count: number; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-x-4 gap-y-2">
      <h2 id={id} className="flex items-center gap-2 text-h2 text-neutral-900">
        {title}
        <CountBadge count={count} />
      </h2>
      {children}
    </div>
  );
}

/** "Overall": review date, summary, and the three counts as badges. No score. */
export function OverviewCard({ review }: { review: DocumentReview }) {
  return (
    <section aria-labelledby="overview-heading" className="flex flex-col gap-3 bg-primary-50 p-5 border border-primary-100 rounded-lg">
      <div className="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-1">
        <h2 id="overview-heading" className="font-medium text-caption text-primary-800">
          Overall
        </h2>
        <p className="text-caption text-neutral-600">
          Reviewed {formatDate(review.reviewedAt)}
          {review.purpose && ` · for ${review.purpose}`}
        </p>
      </div>
      {review.summary && <p className="text-body text-neutral-900">{review.summary}</p>}
      <ul className="flex flex-wrap gap-2" aria-label="Review counts">
        <li className="inline-flex items-center bg-primary-100 px-2.5 rounded-full h-7 font-medium text-caption text-primary-800">
          {plural(review.strengths.length, "strength", "strengths")}
        </li>
        <li className="inline-flex items-center bg-warning-50 px-2.5 rounded-full h-7 font-medium text-caption text-warning-800">
          {plural(review.weaknesses.length, "weakness", "weaknesses")}
        </li>
        <li className="inline-flex items-center px-2.5 border border-primary-800 rounded-full h-7 font-medium text-caption text-primary-800">
          {plural(review.suggestions.length, "suggestion", "suggestions")}
        </li>
      </ul>
    </section>
  );
}

const FEEDBACK_TONES = {
  weakness: { icon: AlertTriangle, accent: "border-t-warning-400", tile: "bg-warning-50 text-warning-800", bullet: "text-warning-600" },
  strength: { icon: CheckCircle2, accent: "border-t-primary-600", tile: "bg-primary-50 text-primary-800", bullet: "text-primary-600" },
} satisfies Record<string, { icon: LucideIcon; accent: string; tile: string; bullet: string }>;

/** One feedback list as a card: a colored top edge and icon (amber for weaknesses, green for strengths). */
function FeedbackCard({ id, title, items, tone }: { id: string; title: string; items: string[]; tone: keyof typeof FEEDBACK_TONES }) {
  const { icon: Icon, accent, tile, bullet } = FEEDBACK_TONES[tone];
  return (
    <section aria-labelledby={id} className={cn("flex flex-col gap-3 bg-white p-5 border border-neutral-100 border-t-[3px] rounded-lg", accent)}>
      <h2 id={id} className="flex items-center gap-2 text-h3 text-neutral-900">
        <span aria-hidden="true" className={cn("flex justify-center items-center rounded-sm size-7 shrink-0", tile)}>
          <Icon size={15} strokeWidth={2} />
        </span>
        {title}
        <CountBadge count={items.length} />
      </h2>
      {items.length === 0 ? (
        <p className="text-neutral-600 text-small">None noted.</p>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {items.map((text) => (
            <li key={text} className="flex items-start gap-2 text-body text-neutral-900">
              <Icon size={15} strokeWidth={2} aria-hidden="true" className={cn("mt-1 shrink-0", bullet)} />
              {text}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Weaknesses and strengths side by side from 768px (stacked below), same card style, no actions. */
export function WeaknessesAndStrengths({ review }: { review: DocumentReview }) {
  return (
    // Grid items stretch, so side by side both cards take the taller one's height.
    <div className="gap-4 grid grid-cols-1 md:grid-cols-2">
      <FeedbackCard id="weaknesses-heading" title="Weaknesses" items={review.weaknesses} tone="weakness" />
      <FeedbackCard id="strengths-heading" title="Strengths" items={review.strengths} tone="strength" />
    </div>
  );
}

/**
 * Suggestions as cards to check off (checked ones go to the end, struck through), with
 * "n of m done", a thin progress bar, "Ask about this" on each, and "Apply all with AI".
 */
export function SuggestionsSection({
  review,
  documentId,
  noun,
  done,
  onToggle,
}: {
  review: DocumentReview;
  documentId: string;
  /** "essay", "CV", "recommendation letter". */
  noun: string;
  done: number[];
  onToggle: (index: number) => void;
}) {
  if (review.suggestions.length === 0) return null;
  const doneCount = review.suggestions.filter((_, index) => done.includes(index)).length;
  // Open ones first in review order, then the checked ones.
  const ordered = review.suggestions
    .map((text, index) => ({ text, index, checked: done.includes(index) }))
    .sort((a, b) => Number(a.checked) - Number(b.checked) || a.index - b.index);
  const open = ordered.filter((entry) => !entry.checked).map((entry) => entry.text);
  // TODO: there's no endpoint that rewrites the file, and its text isn't extracted yet, so this asks
  // the AI assistant to apply the open suggestions in a chat about this document.
  const applyAllHref = askHref(
    documentId,
    `Apply these suggestions to my ${noun} and show me the revised version:\n${open.map((text, i) => `${i + 1}. ${text}`).join("\n")}`,
  );

  return (
    <section aria-labelledby="suggestions-heading" className="flex flex-col gap-3">
      <SectionHeading id="suggestions-heading" title="Suggestions" count={review.suggestions.length}>
        {open.length > 0 && (
          <Link href={applyAllHref} className={buttonClasses("soft", "gap-1.5 px-3 h-9 md:h-8 text-small")}>
            <Sparkles size={14} strokeWidth={2} aria-hidden="true" />
            Apply all with AI
          </Link>
        )}
      </SectionHeading>
      <div className="flex items-center gap-3 max-w-xs">
        <p className="text-neutral-600 text-small whitespace-nowrap">
          {doneCount} of {review.suggestions.length} done
        </p>
        <ProgressBar value={(doneCount / review.suggestions.length) * 100} label="Suggestions done" className="h-1" />
      </div>
      <ul className="flex flex-col gap-3">
        {ordered.map(({ text, index, checked }) => (
          // Below 640px "Ask about this" goes under the text so the text keeps the full width.
          <li
            key={index}
            className="flex sm:flex-row flex-col sm:items-start sm:gap-1 bg-white py-2 pe-4 ps-1 border border-neutral-100 border-s-[3px] border-s-primary-600 rounded-md"
          >
            <label className="flex flex-1 items-start gap-1 min-w-0 cursor-pointer">
              {/* 44px tap target around the box. */}
              <span className="flex justify-center items-center size-11 shrink-0">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(index)}
                  className="accent-primary-600 size-4 cursor-pointer"
                />
              </span>
              <span className={cn("py-2.5 text-body", checked ? "text-neutral-600 line-through" : "text-neutral-900")}>{text}</span>
            </label>
            <div className="flex sm:pt-1.5 ps-12 sm:ps-0 shrink-0">
              <AskLink documentId={documentId} text={text} what="suggestion" />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ReviewDisclaimer() {
  return (
    <p className="flex items-start gap-1.5 text-caption text-neutral-600">
      <Info size={14} strokeWidth={1.75} aria-hidden="true" className="mt-0.5 shrink-0" />
      AI feedback can miss context or be wrong. Use it as a guide and make the final call yourself.
    </p>
  );
}
