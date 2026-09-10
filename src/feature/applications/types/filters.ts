import type { ApplicationStatus } from "./status";
import type { ApplicationSummary } from "./application";

export const FILTERABLE_STATUSES: ApplicationStatus[] = [
  "not_started",
  "in_progress",
  "submitted",
  "accepted",
  "rejected",
];

export const FILTERABLE_TYPES: ApplicationSummary["type"][] = [
  "Scholarship",
  "Internship",
];

export interface ApplicationFilterState {
  search: string;
  status: ApplicationStatus | "all";
  type: ApplicationSummary["type"] | "all";
}

export const DEFAULT_APPLICATION_FILTERS: ApplicationFilterState = {
  search: "",
  status: "all",
  type: "all",
};
