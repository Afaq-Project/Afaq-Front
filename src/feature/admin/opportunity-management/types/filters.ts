import type { OpportunityStatus, OpportunityType } from "./opportunity";

export const FILTERABLE_TYPES: OpportunityType[] = ["Scholarship", "Internship"];
export const FILTERABLE_STATUSES: OpportunityStatus[] = ["Live", "Closed"];

export type DeadlineRangeFilter = "all" | "7" | "30" | "90" | "past";

export const DEADLINE_RANGE_OPTIONS: { value: DeadlineRangeFilter; label: string }[] = [
  { value: "all", label: "Any deadline" },
  { value: "7", label: "Next 7 days" },
  { value: "30", label: "Next 30 days" },
  { value: "90", label: "Next 3 months" },
  { value: "past", label: "Past deadline" },
];

export interface ManageFilterState {
  type: OpportunityType | "all";
  status: OpportunityStatus | "all";
  deadlineRange: DeadlineRangeFilter;
}

export const DEFAULT_MANAGE_FILTERS: ManageFilterState = {
  type: "all",
  status: "all",
  deadlineRange: "all",
};
