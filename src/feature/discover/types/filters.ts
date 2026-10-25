export type TypeFilter = "all" | "scholarship" | "internship";
export type DeadlineFilter = "any" | "week" | "month" | "3months";
export type SortOrder = "match" | "deadline" | "newest";
export type QuickFilter = "strong" | "closing" | "funded" | "remote";

/** matched: the user's scored matches. all: every opportunity, unscored, until the profile can be matched. */
export type DiscoverMode = "matched" | "all";

/** Which controls a mode's endpoint can apply; the others are hidden. */
export interface DiscoverSupport {
  search: boolean;
  type: boolean;
  deadline: boolean;
  /** Location and field-of-study options it can filter on. */
  locations: string[];
  fields: string[];
  quick: QuickFilter[];
  /** Available sorts; the first is the default. */
  sorts: SortOrder[];
}

/** Lowest score of a strong match (the "strong" tier). */
export const STRONG_MATCH_MIN = 70;

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

// Labels for these option lists are discover.types / deadlines / sorts / quick.<value>.
export const TYPE_OPTIONS: { value: TypeFilter }[] = [{ value: "all" }, { value: "scholarship" }, { value: "internship" }];

/** Deadline windows in days; "any" has no limit. */
export const DEADLINE_OPTIONS: { value: DeadlineFilter; maxDays?: number }[] = [
  { value: "week", maxDays: 7 },
  { value: "month", maxDays: 30 },
  { value: "3months", maxDays: 90 },
  { value: "any" },
];

export const SORT_OPTIONS: { value: SortOrder }[] = [{ value: "match" }, { value: "deadline" }, { value: "newest" }];

export const QUICK_FILTER_OPTIONS: { value: QuickFilter }[] = [
  { value: "strong" },
  { value: "closing" },
  { value: "funded" },
  { value: "remote" },
];

/** Location option that matches remote opportunities rather than a city. A URL value; shown as common.remote. */
export const REMOTE_LOCATION = "Remote";
