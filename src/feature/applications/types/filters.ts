import type { ApplicationStatus } from "./status";

/** A status tab; "decision" groups accepted and rejected. */
export type StatusTab = "all" | "not_started" | "in_progress" | "submitted" | "in_review" | "decision";
export type TypeFilter = "all" | "scholarship" | "internship";

/** The Applications page state, mirrored in the URL. */
export interface ApplicationsQuery {
  tab: StatusTab;
  q: string;
  type: TypeFilter;
}

export const DEFAULT_APPLICATIONS_QUERY: ApplicationsQuery = { tab: "all", q: "", type: "all" };

/** Its label is applications.tabs.<value>. */
export const STATUS_TABS: { value: StatusTab; statuses: ApplicationStatus[] }[] = [
  { value: "all", statuses: [] },
  { value: "not_started", statuses: ["not_started"] },
  { value: "in_progress", statuses: ["in_progress"] },
  { value: "submitted", statuses: ["submitted"] },
  { value: "in_review", statuses: ["in_review"] },
  { value: "decision", statuses: ["accepted", "rejected"] },
];

/** Its label is applications.types.<value>. */
export const TYPE_OPTIONS: { value: TypeFilter }[] = [{ value: "all" }, { value: "scholarship" }, { value: "internship" }];
