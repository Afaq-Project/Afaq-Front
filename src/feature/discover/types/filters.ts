export type TypeFilter = "all" | "scholarship" | "internship";
export type DeadlineFilter = "any" | "week" | "month" | "3months";
export type SortOrder = "match" | "deadline" | "newest";
export type QuickFilter = "strong" | "closing" | "funded" | "remote";

/** Everything the Discover page's results depend on; mirrored in the URL. */
export interface DiscoverQuery {
  q: string;
  type: TypeFilter;
  deadline: DeadlineFilter;
  locations: string[];
  fields: string[];
  /** One-tap filters, combined with the rest (AND). */
  quick: QuickFilter[];
  sort: SortOrder;
}

export const DEFAULT_QUERY: DiscoverQuery = {
  q: "",
  type: "all",
  deadline: "any",
  locations: [],
  fields: [],
  quick: [],
  sort: "match",
};

export const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "scholarship", label: "Scholarships" },
  { value: "internship", label: "Internships" },
];

/** Deadline windows in days; "any" has no limit. */
export const DEADLINE_OPTIONS: { value: DeadlineFilter; label: string; maxDays?: number }[] = [
  { value: "week", label: "This week", maxDays: 7 },
  { value: "month", label: "This month", maxDays: 30 },
  { value: "3months", label: "Next 3 months", maxDays: 90 },
  { value: "any", label: "Any time" },
];

export const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "match", label: "Best match" },
  { value: "deadline", label: "Deadline soonest" },
  { value: "newest", label: "Newest" },
];

export const QUICK_FILTER_OPTIONS: { value: QuickFilter; label: string }[] = [
  { value: "strong", label: "Strong matches" },
  { value: "closing", label: "Closing this week" },
  { value: "funded", label: "Fully funded" },
  { value: "remote", label: "Remote" },
];

/** Location option that matches remote opportunities rather than a city. */
export const REMOTE_LOCATION = "Remote";
