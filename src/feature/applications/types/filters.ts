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

export const STATUS_TABS: { value: StatusTab; label: string; statuses: ApplicationStatus[] }[] = [
  { value: "all", label: "All", statuses: [] },
  { value: "not_started", label: "Not started", statuses: ["not_started"] },
  { value: "in_progress", label: "In progress", statuses: ["in_progress"] },
  { value: "submitted", label: "Submitted", statuses: ["submitted"] },
  { value: "in_review", label: "In review", statuses: ["in_review"] },
  { value: "decision", label: "Decision", statuses: ["accepted", "rejected"] },
];

export const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "scholarship", label: "Scholarships" },
  { value: "internship", label: "Internships" },
];
