"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, FileText, Lock, Search, Sparkles, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDocumentTypeLabel } from "@/src/shared/lib/useDocumentTypeLabel";
import { PageGreeting } from "@/src/feature/dashboard/components/PageGreeting";
import { DOCUMENT_TYPES, isReviewable, type DocumentTypeKey } from "@/src/shared/lib/document-types";
import { notify } from "@/src/shared/lib/notify";
import { buttonClasses } from "@/src/shared/ui/Button";
import { CountTabs } from "@/src/shared/ui/CountTabs";
import { EmptyState } from "@/src/shared/ui/EmptyState";
import { ErrorState } from "@/src/shared/ui/ErrorState";
import { Skeleton } from "@/src/shared/ui/Skeleton";
import InlineAlert from "@/src/shared/ui/InlineAlert";
import { documentEdits } from "../../services/documentEditsStore";
import { reviewPath } from "../../services/reviewStore";
import { DocumentRows, DocumentRowsSkeleton } from "./DocumentRows";
import { ACTIVE_APPLICATIONS, TRACKED_APPLICATIONS } from "../../services/utils";
import type { DocumentItem } from "../../types/document";
import { NeededSection, NeededSectionSkeleton } from "./NeededSection";
import { UploadDialog, type UploadPreset } from "./UploadDialog";
import { useDocumentActions } from "../../hooks/useDocumentActions";
import { useDocumentItems } from "../../hooks/useDocumentItems";

type SortOrder = "recent" | "name" | "type";

/** A reviewable document that just got a new file, offered for review. */
type ReviewPrompt = { itemId: string; reason: "replaced" | "needed" };


/**
 * "Your documents": what active applications still need, then every uploaded document (type
 * tabs, search, sort), with download and the ⋯ actions. Essays, CVs and recommendation letters link to their review page
 * (/documents/[id]/review). Listing, upload, download, replace and delete use the
 * existing document API calls; reviews are mocked (see reviewStore).
 */
export function DocumentsView() {
  const t = useTranslations("documents");
  const tCommon = useTranslations("common");
  const typeLabel = useDocumentTypeLabel();
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
      else notify.success(t("replaced"));
    },
  });
  const userTypes = new Set(items.map((item) => item.type).filter((type): type is DocumentTypeKey => Boolean(type)));

  // Untyped documents sit under "Other".
  const tabKey = (item: DocumentItem) => item.type ?? "other";
  const tabs = [
    { value: "all" as const, label: t("all"), count: items.length },
    ...DOCUMENT_TYPES.map((type) => ({ value: type.key, label: typeLabel(type.key), count: items.filter((item) => tabKey(item) === type.key).length })).filter(
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

  // Links such as a "document needed" notification open the upload dialog with the type (and
  // application) chosen: /documents?upload=recommendation&application=2. The params are then
  // dropped, so a refresh doesn't reopen it.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = DOCUMENT_TYPES.find((entry) => entry.key === params.get("upload"))?.key;
    if (!type) return;
    const application = params.get("application");
    window.history.replaceState(null, "", window.location.pathname);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the URL is only readable after mount
    setUpload({ type, applicationIds: application ? [application] : undefined, fromNeeded: true });
  }, []);
  const promptItem = prompt ? items.find((item) => item.id === prompt.itemId) : undefined;

  const header = (
    <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-4">
      <PageGreeting title={t("title")}>{t("subtitle")}</PageGreeting>
      <div className="flex flex-col sm:items-end gap-1.5">
        <button type="button" onClick={() => openUpload()} className={buttonClasses("primary", "w-full sm:w-auto")}>
          <Upload size={16} strokeWidth={1.75} aria-hidden="true" />
          {t("upload")}
        </button>
        <p className="flex items-center gap-1.5 text-caption text-neutral-600">
          <Lock size={12} strokeWidth={2} aria-hidden="true" />
          {t("encrypted")}
        </p>
      </div>
    </div>
  );

  let body: React.ReactNode;
  if (userDocs.isLoading) {
    // The controls row, then rows (the needed-documents skeleton sits above, see below).
    body = (
      <div className="flex flex-col gap-4">
        <div aria-hidden="true" className="flex lg:flex-row flex-col lg:items-center gap-3 lg:gap-6">
          <div className="flex flex-1 gap-6 pb-3 border-neutral-100 border-b">
            <Skeleton className="w-14 h-5" />
            <Skeleton className="w-24 h-5" />
            <Skeleton className="w-24 h-5" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="flex-1 lg:flex-none lg:w-[280px] h-10" />
            <Skeleton className="w-44 h-10" />
          </div>
        </div>
        <DocumentRowsSkeleton />
      </div>
    );
  } else if (userDocs.isError) {
    body = <ErrorState title={t("loadFailed")} onRetry={userDocs.refetch} />;
  } else if (items.length === 0) {
    body = (
      <EmptyState
        variant="page"
        icon={FileText}
        title={t("emptyTitle")}
        message={t("emptyBody")}
        action={
          <button type="button" onClick={() => openUpload()} className={buttonClasses("primary")}>
            {t("upload")}
          </button>
        }
      />
    );
  } else {
    body = (
      <div className="flex flex-col gap-4">
        {/* Tabs on the left with their own divider; search and sort on the right, centered on the same line. */}
        <div className="flex lg:flex-row flex-col lg:items-center gap-3 lg:gap-6">
          <div className="flex-1 border-neutral-100 border-b min-w-0">
            <CountTabs label={t("filterByType")} tabs={tabs} active={tab} onChange={setTab} />
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <label className="flex flex-1 lg:flex-none items-center gap-2 bg-white px-3 border border-neutral-200 focus-within:border-primary-600 rounded-sm focus-within:ring-2 focus-within:ring-primary-400 min-w-48 lg:w-[280px] h-10">
              <Search size={16} strokeWidth={1.75} aria-hidden="true" className="text-neutral-600 shrink-0" />
              <span className="sr-only">{t("search")}</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("searchPlaceholder")}
                className="flex-1 bg-transparent min-w-0 text-neutral-900 text-small placeholder:text-neutral-400 focus:outline-none"
              />
            </label>
            <label className="relative">
              <span className="sr-only">{t("sort")}</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOrder)}
                className="bg-white pe-9 ps-3 border border-neutral-200 hover:border-neutral-400 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 h-10 font-medium text-neutral-800 text-small appearance-none cursor-pointer"
              >
                <option value="recent">{t("sortRecent")}</option>
                <option value="name">{t("sortName")}</option>
                <option value="type">{t("sortType")}</option>
              </select>
              <ChevronDown size={16} strokeWidth={1.75} aria-hidden="true" className="top-1/2 end-3 absolute text-neutral-600 -translate-y-1/2 pointer-events-none" />
            </label>
          </div>
        </div>

        {visible.length === 0 ? (
          <EmptyState
            variant="page"
            title={t("noMatch")}
            message={t("noMatchBody")}
            action={
              <button
                type="button"
                onClick={() => {
                  setTab("all");
                  setSearch("");
                }}
                className={buttonClasses("secondary")}
              >
                {t("clearFilters")}
              </button>
            }
          />
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
      {/* Only when the section will show: with no requirements to check it renders nothing. */}
      {userDocs.isLoading &&
        ACTIVE_APPLICATIONS.some((a) => (a.opportunity?.requiredDocuments.length ?? 0) > 0) && <NeededSectionSkeleton />}
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
                {prompt.reason === "needed" ? t("feedbackBeforeSubmit") : t("reviewNow")}
              </Link>
              <button type="button" onClick={() => setPrompt(null)} className={buttonClasses("ghost", "px-2 h-9 md:h-8 text-small")}>
                {tCommon("dismiss")}
              </button>
            </>
          }
        >
          {prompt.reason === "needed" ? t("uploadedNamed", { name: promptItem.name }) : t("newVersion")}
        </InlineAlert>
      )}
      {/* 40px above: the page's 24px gap plus 16px. */}
      <section aria-labelledby="all-documents-heading" className="flex flex-col gap-4 mt-4">
        <h2 id="all-documents-heading" className="text-h2 text-neutral-900">
          {t("allDocuments")}
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
          else notify.success(t("uploaded"));
          setUpload(null);
          await refresh();
          restoreFocus();
        }}
      />

      {actions.dialog}
    </div>
  );
}
