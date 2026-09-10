import { OpportunityType } from "@/src/feature/opportunities/types/opportunity";

export const ALL_OPTION = "all" as const;

export type DeadlineFilter = "any" | "7" | "30" | "90";

export interface DiscoverFilterState {
  search: string;
  type: OpportunityType | typeof ALL_OPTION;
  deadline: DeadlineFilter;
  location: string;
  fieldOfStudy: string;
}

export const DEFAULT_FILTERS: DiscoverFilterState = {
  search: "",
  type: ALL_OPTION,
  deadline: "any",
  location: ALL_OPTION,
  fieldOfStudy: ALL_OPTION,
};

export const DEADLINE_FILTER_OPTIONS: { value: DeadlineFilter; label: string }[] = [
  { value: "any", label: "Any deadline" },
  { value: "7", label: "Next 7 days" },
  { value: "30", label: "Next 30 days" },
  { value: "90", label: "Next 3 months" },
];
