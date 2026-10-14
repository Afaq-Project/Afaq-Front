"use client";

import { useState } from "react";
import Link from "next/link";
import { Download, MoreHorizontal, Sparkles } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { FlagTile } from "@/src/feature/opportunities/components/FlagTile";
import { countryName } from "@/src/shared/lib/countries";
import { documentType, isReviewable } from "@/src/shared/lib/document-types";
import { buttonClasses } from "@/src/shared/ui/Button";
import { Popover } from "@/src/shared/ui/Popover";
import { Skeleton } from "@/src/shared/ui/Skeleton";
import type { DialogKind } from "./DocumentDialogs";
import { reviewPath } from "../../services/reviewStore";
import { formatDate, typeLabel } from "../../services/utils";
import type { DocumentItem } from "../../types/document";

const ICON_BUTTON =
  "flex justify-center items-center hover:bg-neutral-50 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 size-11 md:size-8 text-neutral-600 hover:text-neutral-900 transition-colors";
const MENU_ITEM =
  "flex items-center px-3 rounded-sm w-full min-h-11 md:min-h-9 text-small text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400";

/** Links and link-like buttons on this page underline on hover and focus only. */
const LINK_CLASS =
  "rounded-sm hover:underline focus-visible:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400";

/**
 * A reviewable document's review state under its meta line, linking to its review page.
 */
function ReviewStatus({ item, reviewing }: { item: DocumentItem; reviewing: boolean }) {
  const review = item.review;
  const count = review?.suggestionsCount ?? 0;
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
      {reviewing ? (
        <span className="text-caption text-neutral-600">Reviewing…</span>
      ) : (
        <Link
          href={reviewPath(item.id)}
          className={cn(LINK_CLASS, "text-caption", review?.reviewedAt ? "text-neutral-800 hover:text-neutral-900" : "text-neutral-600 hover:text-neutral-900")}
        >
          {review?.reviewedAt
            ? `Reviewed ${formatDate(review.reviewedAt)} · ${count} ${count === 1 ? "suggestion" : "suggestions"}`
            : "Not reviewed yet"}
        </Link>
      )}
    </div>
  );
}

const flagProps = (application: DocumentItem["usedIn"][number]) => ({
  countryCode: application.opportunity?.countryCode,
  countryName: application.opportunity?.countryCode ? countryName(application.opportunity.countryCode) : undefined,
  remote: Boolean(application.opportunity?.isRemote) || !application.opportunity?.countryCode,
});

/**
 * "Used in n applications" after up to 3 overlapping flag tiles, opening a popover that links to
 * each application; "Not used yet" when none.
 */
function Usage({ item }: { item: DocumentItem }) {
  const [open, setOpen] = useState(false);
  // neutral-600, not neutral-500: there's no neutral-500 token, and neutral-400 is too faint for small text.
  if (item.usedIn.length === 0) return <span className="text-neutral-600 text-small">Not used yet</span>;
  const label = `Used in ${item.usedIn.length} ${item.usedIn.length === 1 ? "application" : "applications"}`;

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label={label}
      align="start"
      panelClassName="w-72"
      trigger={(triggerProps) => (
        <button
          type="button"
          {...triggerProps}
          className={cn(LINK_CLASS, "inline-flex items-center gap-2 text-neutral-800 text-small hover:text-neutral-900")}
        >
          <span aria-hidden="true" className="flex -space-x-1.5">
            {item.usedIn.slice(0, 3).map((application) => (
              <FlagTile key={application.id} size="sm" className="ring-2 ring-white" {...flagProps(application)} />
            ))}
          </span>
          {label}
        </button>
      )}
    >
      <ul className="flex flex-col gap-1">
        {item.usedIn.map((application) => (
          <li key={application.id}>
            <Link
              href={`/applications/${application.id}`}
              className="flex items-center gap-2.5 hover:bg-neutral-50 px-2 py-1.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 text-neutral-800 text-small"
            >
              <FlagTile {...flagProps(application)} />
              <span className="truncate">{application.title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Popover>
  );
}

/**
 * A document's ⋯ menu: Rename, Change type, Replace file, Link to application, Delete. On the
 * review page (`onPage`) there's no Change type. Mock documents have no file to replace or delete.
 */
export function DocumentMenu({
  item,
  onAction,
  onPage = false,
}: {
  item: DocumentItem;
  onAction: (kind: DialogKind, item: DocumentItem) => void;
  onPage?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const run = (kind: DialogKind) => {
    setOpen(false);
    onAction(kind, item);
  };
  const items: { kind: DialogKind; label: string }[] = [
    { kind: "rename", label: "Rename" },
    ...(onPage ? [] : [{ kind: "type" as const, label: "Change type" }]),
    ...(item.mock ? [] : [{ kind: "replace" as const, label: "Replace file" }]),
    { kind: "link", label: "Link to application" },
  ];
  const itemClass = cn(MENU_ITEM, "text-neutral-800 hover:bg-neutral-50");

  return (
    <div className="relative z-10 has-aria-expanded:z-30">
      <Popover
        open={open}
        onOpenChange={setOpen}
        label={`More actions for ${item.name}`}
        panelClassName="w-52 p-1"
        trigger={(triggerProps) => (
          <button type="button" {...triggerProps} aria-label={`More actions for ${item.name}`} className={ICON_BUTTON}>
            <MoreHorizontal size={18} strokeWidth={1.75} aria-hidden="true" />
          </button>
        )}
      >
        <ul className="flex flex-col">
          {items.map((entry) => (
            <li key={entry.kind}>
              <button type="button" onClick={() => run(entry.kind)} className={itemClass}>
                {entry.label}
              </button>
            </li>
          ))}
          {!item.mock && (
            <>
              <li role="separator" className="my-1 border-neutral-100 border-t" />
              <li>
                <button type="button" onClick={() => run("delete")} className={cn(MENU_ITEM, "text-danger-800 hover:bg-danger-50")}>
                  Delete
                </button>
              </li>
            </>
          )}
        </ul>
      </Popover>
    </div>
  );
}

/**
 * The documents as one list card. From 768px each row is a grid: icon (40px), name and meta
 * (reviewable types: the name, review state and "Review with AI" link to the review page), where it's used (240px), then
 * "Review with AI" (reviewable types), download and the ⋯ menu (216px, so columns line up). Below 768px: icon and name, then usage with the actions on
 * the same line.
 */
export function DocumentRows({
  items,
  reviewingIds = [],
  onAction,
  onDownload,
}: {
  items: DocumentItem[];
  /** Essays with a review in progress. */
  reviewingIds?: string[];
  onAction: (kind: DialogKind, item: DocumentItem) => void;
  onDownload: (item: DocumentItem) => void;
}) {
  return (
    <ul className="bg-white border border-neutral-100 rounded-lg divide-y divide-neutral-100">
      {items.map((item) => {
        const Icon = documentType(item.type ?? "other").icon;
        const added = formatDate(item.addedAt);
        return (
          <li
            key={item.id}
            className={cn(
              "items-center gap-x-3 gap-y-2 grid grid-cols-[40px_minmax(0,1fr)_auto] hover:bg-neutral-50 px-4 md:px-5 py-3 min-h-16 transition-colors",
              "[grid-template-areas:'icon_main_main'_'._usage_actions']",
              "md:grid-cols-[40px_minmax(0,1fr)_240px_216px] md:gap-x-4 md:[grid-template-areas:'icon_main_usage_actions']",
            )}
          >
            <span aria-hidden="true" className="flex justify-center items-center bg-neutral-50 rounded-md size-10 text-neutral-600 [grid-area:icon]">
              <Icon size={18} strokeWidth={1.75} />
            </span>
            <div className="min-w-0 [grid-area:main]">
              <p className="font-medium text-body text-neutral-900 truncate">
                {isReviewable(item.type) ? (
                  <Link href={reviewPath(item.id)} className={LINK_CLASS}>
                    {item.name}
                  </Link>
                ) : (
                  item.name
                )}
              </p>
              <p className="text-caption text-neutral-600">
                {typeLabel(item.type)}
                {!item.type && (
                  <>
                    {" "}
                    <button
                      type="button"
                      onClick={() => onAction("type", item)}
                      className={cn(LINK_CLASS, "font-medium text-primary-600 hover:text-primary-800")}
                    >
                      Set type
                    </button>
                  </>
                )}
                {` · ${item.format} · ${item.size}`}
                {added && ` · Added ${added}`}
              </p>
              {isReviewable(item.type) && (
                <ReviewStatus item={item} reviewing={reviewingIds.includes(item.id)} />
              )}
            </div>
            <div className="min-w-0 [grid-area:usage]">
              <Usage item={item} />
            </div>
            <div className="flex justify-end items-center gap-1 [grid-area:actions]">
              {isReviewable(item.type) && (
                <Link
                  href={reviewPath(item.id)}
                  aria-label={`Review with AI: ${item.name}`}
                  className={buttonClasses("soft", "mr-1 gap-1.5 px-3 h-9 md:h-8 text-small")}
                >
                  <Sparkles size={14} strokeWidth={2} aria-hidden="true" />
                  Review with AI
                </Link>
              )}
              <button type="button" onClick={() => onDownload(item)} aria-label={`Download ${item.name}`} className={ICON_BUTTON}>
                <Download size={16} strokeWidth={1.75} aria-hidden="true" />
              </button>
              <DocumentMenu item={item} onAction={onAction} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

/** Loading placeholder shaped like the rows. */
export function DocumentRowsSkeleton() {
  return (
    <div role="status" className="bg-white border border-neutral-100 rounded-lg divide-y divide-neutral-100">
      <span className="sr-only">Loading documents</span>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 h-16">
          <Skeleton className="rounded-md size-10" />
          <div className="flex flex-col flex-1 gap-1.5">
            <Skeleton className="w-48 h-3.5" />
            <Skeleton className="w-64 h-3" />
          </div>
          <Skeleton className="hidden md:block w-32 h-3.5" />
          <Skeleton className="size-8" />
        </div>
      ))}
    </div>
  );
}
