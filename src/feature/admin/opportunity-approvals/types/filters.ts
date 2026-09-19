import type { OpportunityType } from "./opportunity";

export const FILTERABLE_TYPES: OpportunityType[] = ["Scholarship", "Internship"];

export interface ApprovalFilterState {
  source: string | "all";
  type: OpportunityType | "all";
  dateScrapedFrom: string;
  dateScrapedTo: string;
}

export const DEFAULT_APPROVAL_FILTERS: ApprovalFilterState = {
  source: "all",
  type: "all",
  dateScrapedFrom: "",
  dateScrapedTo: "",
};
