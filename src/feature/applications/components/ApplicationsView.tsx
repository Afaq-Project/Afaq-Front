"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { notify } from "@/src/shared/lib/notify";
import { buttonClasses } from "@/src/shared/ui/Button";
import Modal from "@/src/shared/ui/Modal";
import { useApplicationsQuery } from "../hooks/useApplicationsQuery";
import { APPLICATIONS } from "../mocks/applications";
import { filterApplications, inTab, sortApplications, applicationsQueryToParams } from "../services/utils";
import type { ApplicationSummary } from "../types/application";
import { DEFAULT_APPLICATIONS_QUERY, STATUS_TABS, TYPE_OPTIONS, type StatusTab, type TypeFilter } from "../types/filters";
import type { ApplicationStatus } from "../types/status";
import { ApplicationsList } from "./ApplicationsList";
import { StatusTabs } from "./StatusTabs";

const PAGE_SIZE = 20;
const SEARCH_DEBOUNCE_MS = 200;

const STATE_CARD_CLASS =
  "flex flex-col items-center gap-2 bg-white mx-auto px-6 py-12 border border-neutral-100 rounded-lg w-full text-center";

/**
 * The Applications page body: status tabs (with counts) plus search and type, the sorted list
 * (deadline first for active ones, FR-5.4), the empty states, and the remove confirmation.
 */
export function ApplicationsView() {
  const { query, update } = useApplicationsQuery();

  // TODO: there's no tracker API yet, so status changes and removals only change this local copy
  // of the mock and reset on reload.
  const [applications, setApplications] = useState<ApplicationSummary[]>(APPLICATIONS);
  const [page, setPage] = useState(1);
  const [pageKey, setPageKey] = useState("");

  // Local search text so typing is instant; it follows the URL when that changes elsewhere.
  const [input, setInput] = useState(query.q);
  const [syncedQ, setSyncedQ] = useState(query.q);
  if (query.q !== syncedQ) {
    setSyncedQ(query.q);
    setInput(query.q);
  }
  const searchTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(searchTimer.current), []);

  const searched = useMemo(() => filterApplications(applications, query), [applications, query]);
  const counts = Object.fromEntries(
    STATUS_TABS.map((tab) => [tab.value, searched.filter((a) => inTab(a, tab.value)).length]),
  ) as Record<StatusTab, number>;
  const results = useMemo(() => sortApplications(searched.filter((a) => inTab(a, query.tab))), [searched, query.tab]);

  // Back to the first page whenever the query changes.
  const queryKey = applicationsQueryToParams(query).toString();
  if (queryKey !== pageKey) {
    setPageKey(queryKey);
    setPage(1);
  }
  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE));
  const offset = (page - 1) * PAGE_SIZE;
  const visible = results.slice(offset, offset + PAGE_SIZE);

  const [removing, setRemoving] = useState<{ application: ApplicationSummary; trigger: HTMLElement | null } | null>(null);
  const cancelButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (removing) cancelButton.current?.focus();
  }, [removing]);
  const closeRemove = () => {
    const trigger = removing?.trigger;
    setRemoving(null);
    trigger?.focus();
  };
  const confirmRemove = () => {
    if (!removing) return;
    setApplications((prev) => prev.filter((a) => a.id !== removing.application.id));
    notify.success("Removed from your applications");
    setRemoving(null);
  };

  const changeStatus = (id: string, status: ApplicationStatus) =>
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  const onSearch = (value: string) => {
    setInput(value);
    window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => update({ q: value }), SEARCH_DEBOUNCE_MS);
  };
  const clearFilters = () => update(DEFAULT_APPLICATIONS_QUERY);

  if (applications.length === 0) {
    return (
      <div className={STATE_CARD_CLASS}>
        <h2 className="text-h3 text-neutral-900">Start tracking your first application</h2>
        <p className="max-w-md text-body text-neutral-600">
          When you track an opportunity, it shows up here with reminders before the deadline.
        </p>
        {/* Secondary: the header's "Find opportunities" is the page's one primary button. */}
        <Link href="/discover" className={buttonClasses("secondary", "mt-3")}>
          Discover opportunities
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Tabs with search and type on the right from 1024px; stacked below. */}
      <div className="flex lg:flex-row flex-col lg:items-end gap-3 lg:gap-6 border-neutral-100 lg:border-b">
        <div className="flex-1 border-neutral-100 lg:border-b-0 border-b min-w-0">
          <StatusTabs active={query.tab} counts={counts} onChange={(tab) => update({ tab })} />
        </div>
        <div className="flex items-center gap-2 lg:pb-2">
          <label className="flex flex-1 lg:flex-none items-center gap-2 bg-white px-3 border border-neutral-200 focus-within:border-primary-600 rounded-sm focus-within:ring-2 focus-within:ring-primary-400 lg:w-64 h-10 transition-colors">
            <Search size={16} strokeWidth={1.75} aria-hidden="true" className="text-neutral-600 shrink-0" />
            <span className="sr-only">Search applications</span>
            <input
              type="search"
              value={input}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search by title or provider"
              className="flex-1 bg-transparent min-w-0 text-neutral-900 text-small placeholder:text-neutral-400 focus:outline-none"
            />
          </label>
          <label className="relative">
            <span className="sr-only">Type</span>
            <select
              value={query.type}
              onChange={(event) => update({ type: event.target.value as TypeFilter })}
              className="bg-white pe-9 ps-3 border border-neutral-200 hover:border-neutral-400 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 h-10 font-medium text-neutral-800 text-small appearance-none cursor-pointer"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              strokeWidth={1.75}
              aria-hidden="true"
              className="top-1/2 end-3 absolute text-neutral-600 -translate-y-1/2 pointer-events-none"
            />
          </label>
        </div>
      </div>

      {results.length === 0 ? (
        <div className={STATE_CARD_CLASS}>
          <h2 className="text-h3 text-neutral-900">No applications match</h2>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-sm min-h-11 font-medium text-neutral-600 text-small hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-caption text-neutral-600">Sorted by deadline</p>
          <ApplicationsList
            applications={visible}
            offset={offset}
            total={results.length}
            page={page}
            pageCount={pageCount}
            onPageChange={setPage}
            onStatusChange={changeStatus}
            onRemove={(application, trigger) => setRemoving({ application, trigger })}
          />
        </>
      )}

      <Modal open={removing !== null} onClose={closeRemove} title="Remove from tracker?" className="max-w-md">
        <p className="text-body text-neutral-800">
          {removing?.application.title} will be removed from your applications and its deadline reminders stop.
        </p>
        <div className="flex justify-end gap-2 mt-5">
          <button ref={cancelButton} type="button" onClick={closeRemove} className={buttonClasses("secondary")}>
            Cancel
          </button>
          <button type="button" onClick={confirmRemove} className={buttonClasses("destructive")}>
            Remove
          </button>
        </div>
      </Modal>
    </div>
  );
}
