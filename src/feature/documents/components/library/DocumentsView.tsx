"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, FileText, Lock, Search, Sparkles, Upload } from "lucide-react";
import { PageGreeting } from "@/src/feature/dashboard/components/PageGreeting";
import { DOCUMENT_TYPES, isReviewable, type DocumentTypeKey } from "@/src/shared/lib/document-types";
import { notify } from "@/src/shared/lib/notify";
import { buttonClasses } from "@/src/shared/ui/Button";
import { CountTabs } from "@/src/shared/ui/CountTabs";
import InlineAlert from "@/src/shared/ui/InlineAlert";
import { documentEdits } from "../../services/documentEditsStore";
import { reviewPath } from "../../services/reviewStore";
import { DocumentRows, DocumentRowsSkeleton } from "./DocumentRows";
import { ACTIVE_APPLICATIONS, TRACKED_APPLICATIONS, typeLabel } from "../../services/utils";
import type { DocumentItem } from "../../types/document";
import { NeededSection } from "./NeededSection";
import { UploadDialog, type UploadPreset } from "./UploadDialog";
import { useDocumentActions } from "../../hooks/useDocumentActions";
import { useDocumentItems } from "../../hooks/useDocumentItems";

type SortOrder = "recent" | "name" | "type";

/** A reviewable document that just got a new file, offered for review. */
type ReviewPrompt = { itemId: string; reason: "replaced" | "needed" };

const STATE_CARD_CLASS =
  "flex flex-col items-center gap-2 bg-white mx-auto px-6 py-12 border border-neutral-100 rounded-lg w-full text-center";

/**
 * "Your documents": what active applications still need, then every uploaded document (type
 * tabs, search, sort), with download and the ⋯ actions. Essays, CVs and recommendation letters link to their review page
 * (/documents/[id]/review). Listing, upload, download, replace and delete use the
 * existing document API calls; reviews are mocked (see reviewStore).
 */
export function DocumentsView() {
  const { userDocs, items, reviews, refresh } = useDocumentItems();

  const [tab, setTab] = useState<DocumentTypeKey | "all">("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOrder>("recent");
  const [upload, setUpload] = useState<UploadPreset | null>(null);
  const [prompt, setPrompt] = useState<ReviewPrompt | null>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  const actions = useDocumentActions({
    refresh,
    // A reviewable document with a new file is offered a new review instead of a toast.
    onReplaced: (item, newId) => {
      if (isReviewable(item.type)) setPrompt({ itemId: newId, reason: "replaced" });
      else notify.success("File replaced");
    },
  });
  const userTypes = new Set(items.map((item) => item.type).filter((type): type is DocumentTypeKey => Boolean(type)));

  // Untyped documents sit under "Other".
  const tabKey = (item: DocumentItem) => item.type ?? "other";
  const tabs = [
    { value: "all" as const, label: "All", count: items.length },
    ...DOCUMENT_TYPES.map((type) => ({ value: type.key, label: type.label, count: items.filter((item) => tabKey(item) === type.key).length })).filter(
      (entry) => entry.count > 0,
    ),
  ];
  const query = search.trim().toLowerCase();
  const visible = items
    .filter((item) => tab === "all" || tabKey(item) === tab)
    .filter((item) => !query || item.name.toLowerCase().includes(query) || typeLabel(item.type).toLowerCase().includes(query))
    .sort((a, b) =>
      sort === "name"
        ? a.name.localeCompare(b.name)
        : sort === "type"
          ? typeLabel(a.type).localeCompare(typeLabel(b.type))
          : (b.addedAt ?? "").localeCompare(a.addedAt ?? ""),
    );

  const openUpload = (preset: UploadPreset = {}) => {
    returnFocus.current = document.activeElement as HTMLElement | null;
    setUpload(preset);
  };
  const restoreFocus = () => returnFocus.current?.focus();
  const promptItem = prompt ? items.find((item) => item.id === prompt.itemId) : undefined;

  const header = (
    <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-4">
      <PageGreeting title="Your documents">Upload once and reuse across your applications.</PageGreeting>
      <div className="flex flex-col sm:items-end gap-1.5">
        <button type="button" onClick={() => openUpload()} className={buttonClasses("primary", "w-full sm:w-auto")}>
          <Upload size={16} strokeWidth={1.75} aria-hidden="true" />
          Upload document
        </button>
        <p className="flex items-center gap-1.5 text-caption text-neutral-600">
          <Lock size={12} strokeWidth={2} aria-hidden="true" />
          Files are encrypted and only visible to you.
        </p>
      </div>
    </div>
  );

  let body: React.ReactNode;
  if (userDocs.isLoading) {
    body = <DocumentRowsSkeleton />;
  } else if (userDocs.isError) {
    body = (
      <div className={STATE_CARD_CLASS}>
        <h2 className="text-h3 text-neutral-900">We couldn&apos;t load your documents</h2>
        <p className="text-body text-neutral-600">Check your connection and try again.</p>
        <button type="button" onClick={userDocs.refetch} className={buttonClasses("secondary", "mt-3")}>
          Try again
        </button>
      </div>
    );
  } else if (items.length === 0) {
    body = (
      <div className={STATE_CARD_CLASS}>
        <span aria-hidden="true" className="flex justify-center items-center bg-neutral-50 mb-2 rounded-md size-12 text-neutral-600">
          <FileText size={22} strokeWidth={1.75} />
        </span>
        <h2 className="text-h2 text-neutral-900">Upload your first document</h2>
        <p className="max-w-md text-body text-neutral-600">
          Add your CV, transcript, or certificates once and reuse them for every application.
        </p>
        <button type="button" onClick={() => openUpload()} className={buttonClasses("primary", "mt-3")}>
          Upload document
        </button>
      </div>
    );
  } else {
    body = (
      <div className="flex flex-col gap-4">
        {/* Tabs on the left with their own divider; search and sort on the right, centered on the same line. */}
        <div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:gap-6">
          <div className="flex-1 border-neutral-100 border-b min-w-0">
            <CountTabs label="Filter by type" tabs={tabs} active={tab} onChange={setTab} />
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <label className="flex flex-1 lg:flex-none items-center gap-2 bg-white px-3 border border-neutral-200 focus-within:border-primary-600 rounded-sm focus-within:ring-2 focus-within:ring-primary-400 min-w-48 lg:w-[280px] h-10">
              <Search size={16} strokeWidth={1.75} aria-hidden="true" className="text-neutral-600 shrink-0" />
              <span className="sr-only">Search documents</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or type"
                className="flex-1 bg-transparent min-w-0 text-neutral-900 text-small placeholder:text-neutral-400 focus:outline-none"
              />
            </label>
            <label className="relative">
              <span className="sr-only">Sort</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOrder)}
                className="bg-white pr-9 pl-3 border border-neutral-200 hover:border-neutral-400 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 h-10 font-medium text-neutral-800 text-small appearance-none cursor-pointer"
              >
                <option value="recent">Sort: Recently added</option>
                <option value="name">Sort: Name</option>
                <option value="type">Sort: Type</option>
              </select>
              <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" className="top-1/2 right-3 absolute text-neutral-600 -translate-y-1/2 pointer-events-none" />
            </label>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className={STATE_CARD_CLASS}>
            <h2 className="text-h3 text-neutral-900">No documents match</h2>
            <button
              type="button"
              onClick={() => {
                setTab("all");
                setSearch("");
              }}
              className="rounded-sm min-h-11 font-medium text-neutral-600 text-small hover:text-neutral-900 hover:underline focus-visible:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <DocumentRows
            items={visible}
            reviewingIds={reviews.pending}
            onDownload={actions.download}
            onAction={actions.open}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {header}
      {userDocs.available && (
        <NeededSection
          applications={ACTIVE_APPLICATIONS}
          userTypes={userTypes}
          onUpload={(type, applicationIds) => openUpload({ type, applicationIds, fromNeeded: true })}
        />
      )}
      {prompt && promptItem && (
        <InlineAlert
          variant={prompt.reason === "needed" ? "success" : "info"}
          action={
            <>
              <Link href={reviewPath(promptItem.id)} className={buttonClasses("soft", "px-3 h-9 md:h-8 text-small")}>
                <Sparkles size={14} strokeWidth={2} aria-hidden="true" />
                {prompt.reason === "needed" ? "Get AI feedback before you submit" : "Review now"}
              </Link>
              <button type="button" onClick={() => setPrompt(null)} className={buttonClasses("ghost", "px-2 h-9 md:h-8 text-small")}>
                Dismiss
              </button>
            </>
          }
        >
          {prompt.reason === "needed" ? `${promptItem.name} uploaded.` : "New version uploaded. Want feedback on this version?"}
        </InlineAlert>
      )}
      {/* 40px above: the page's 24px gap plus 16px. */}
      <section aria-labelledby="all-documents-heading" className="flex flex-col gap-4 mt-4">
        <h2 id="all-documents-heading" className="text-h2 text-neutral-900">
          All documents
        </h2>
        {body}
      </section>

      <UploadDialog
        open={upload !== null}
        preset={upload ?? {}}
        applications={TRACKED_APPLICATIONS}
        apiTypeIdFor={userDocs.apiTypeIdFor}
        onClose={() => {
          setUpload(null);
          restoreFocus();
        }}
        onUploaded={async ({ id, type, fileName, displayName, applicationIds }) => {
          // TODO: the upload call takes no display name; a custom one is kept locally.
          if (displayName !== fileName) documentEdits.rename(id, displayName);
          if (applicationIds.length > 0) documentEdits.setLinks(id, applicationIds);
          // A reviewable document added for an application gets a review offer instead of a toast.
          if (upload?.fromNeeded && isReviewable(type)) setPrompt({ itemId: id, reason: "needed" });
          else notify.success("Document uploaded");
          setUpload(null);
          await refresh();
          restoreFocus();
        }}
      />

      {actions.dialog}
    </div>
  );
}
