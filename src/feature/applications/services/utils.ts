import { ApplicationSummary } from "../types/application";
import type { ApplicationDetail } from "../types/detail";
import { ApplicationStatus } from "../types/status";
import {
  DEFAULT_APPLICATIONS_QUERY,
  STATUS_TABS,
  TYPE_OPTIONS,
  type ApplicationsQuery,
  type StatusTab,
  type TypeFilter,
} from "../types/filters";
import { APPLICATION_DETAILS } from "../mocks/applicationDetails";

export function formatDeadline(daysLeft: number): string {
  if (daysLeft <= 0) return "Ends today";
  if (daysLeft === 1) return "Ends tomorrow";
  return `Ends in ${daysLeft} days`;
}

export interface ApplicationAction {
  label: string;
}

export const APPLICATION_ACTIONS: Record<ApplicationStatus, ApplicationAction> =
  {
    not_started: { label: "Start now" },
    in_progress: { label: "Complete application" },
    submitted: { label: "Details" },
    in_review: { label: "Details" },
    rejected: { label: "Details" },
    accepted: { label: "See results" },
  };

export function getApplicationAction(
  status: ApplicationStatus,
): ApplicationAction {
  return APPLICATION_ACTIONS[status];
}

const ACTIVE_STATUSES: ApplicationStatus[] = ["not_started", "in_progress"];

export const isActive = (application: ApplicationSummary) => ACTIVE_STATUSES.includes(application.status);

/** Search (title or provider) and type; the status tab is applied separately so tabs can count. */
export function filterApplications(applications: ApplicationSummary[], query: ApplicationsQuery) {
  const search = query.q.trim().toLowerCase();
  return applications.filter(
    (a) =>
      (search === "" || a.title.toLowerCase().includes(search) || a.provider.toLowerCase().includes(search)) &&
      (query.type === "all" || a.type.toLowerCase() === query.type),
  );
}

export function inTab(application: ApplicationSummary, tab: StatusTab) {
  if (tab === "all") return true;
  return STATUS_TABS.find((t) => t.value === tab)?.statuses.includes(application.status) ?? false;
}

/**
 * Active applications first, soonest deadline first (FR-5.4); then submitted, in review and
 * decided ones, most recently updated first.
 */
export function sortApplications(applications: ApplicationSummary[]) {
  return [...applications].sort((a, b) => {
    const activeA = isActive(a);
    const activeB = isActive(b);
    if (activeA !== activeB) return activeA ? -1 : 1;
    if (activeA) return a.daysLeft - b.daysLeft;
    return (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "");
  });
}

const oneOf = <T extends string>(value: string | null, options: { value: T }[], fallback: T): T =>
  options.some((option) => option.value === value) ? (value as T) : fallback;

export function parseApplicationsQuery(params: URLSearchParams): ApplicationsQuery {
  return {
    tab: oneOf<StatusTab>(params.get("status"), STATUS_TABS, DEFAULT_APPLICATIONS_QUERY.tab),
    q: params.get("q") ?? "",
    type: oneOf<TypeFilter>(params.get("type"), TYPE_OPTIONS, DEFAULT_APPLICATIONS_QUERY.type),
  };
}

/** Only non-default values, so a plain /applications stays clean. */
export function applicationsQueryToParams(query: ApplicationsQuery) {
  const params = new URLSearchParams();
  if (query.tab !== "all") params.set("status", query.tab);
  if (query.q.trim()) params.set("q", query.q.trim());
  if (query.type !== "all") params.set("type", query.type);
  return params;
}

export function getApplicationDetail(id: string): ApplicationDetail | undefined {
  return APPLICATION_DETAILS.find((application) => application.id === id);
}
