import type { OpportunitySummary } from "@/src/feature/opportunities/types/opportunity";
import {
  DEADLINE_OPTIONS,
  DEFAULT_QUERY,
  QUICK_FILTER_OPTIONS,
  REMOTE_LOCATION,
  SORT_OPTIONS,
  TYPE_OPTIONS,
  type DeadlineFilter,
  type DiscoverQuery,
  type QuickFilter,
  type SortOrder,
  type TypeFilter,
} from "../types/filters";

/** Recently closed opportunities stay listed (dimmed) for this many days. */
const CLOSED_GRACE_DAYS = 30;

const oneOf = <T extends string>(value: string | null, options: { value: T }[], fallback: T): T =>
  options.some((option) => option.value === value) ? (value as T) : fallback;

/** Reads the Discover query from URL params, ignoring anything unknown. */
export function parseQuery(params: URLSearchParams): DiscoverQuery {
  return {
    q: params.get("q") ?? "",
    type: oneOf<TypeFilter>(params.get("type"), TYPE_OPTIONS, DEFAULT_QUERY.type),
    deadline: oneOf<DeadlineFilter>(params.get("deadline"), DEADLINE_OPTIONS, DEFAULT_QUERY.deadline),
    locations: params.getAll("location"),
    fields: params.getAll("field"),
    quick: params.getAll("quick").filter((value): value is QuickFilter =>
      QUICK_FILTER_OPTIONS.some((option) => option.value === value),
    ),
    sort: oneOf<SortOrder>(params.get("sort"), SORT_OPTIONS, DEFAULT_QUERY.sort),
  };
}

/** Writes only what differs from the defaults, so a plain /discover stays clean. */
export function toSearchParams(query: DiscoverQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q.trim()) params.set("q", query.q.trim());
  if (query.type !== DEFAULT_QUERY.type) params.set("type", query.type);
  if (query.deadline !== DEFAULT_QUERY.deadline) params.set("deadline", query.deadline);
  query.locations.forEach((location) => params.append("location", location));
  query.fields.forEach((field) => params.append("field", field));
  query.quick.forEach((quick) => params.append("quick", quick));
  if (query.sort !== DEFAULT_QUERY.sort) params.set("sort", query.sort);
  return params;
}

export const activeFilterCount = (query: DiscoverQuery) =>
  (query.deadline !== "any" ? 1 : 0) + query.locations.length + query.fields.length + query.quick.length;

const QUICK_TEST: Record<QuickFilter, (o: OpportunitySummary) => boolean> = {
  strong: (o) => o.matchScore >= 70,
  closing: (o) => o.daysLeft >= 0 && o.daysLeft <= 7,
  funded: (o) => o.fundingStatus === "Fully Funded",
  remote: (o) => o.isRemote === true,
};

/** Open opportunities plus recently closed ones; older closed ones are hidden. */
export const listable = (opportunities: OpportunitySummary[]) =>
  opportunities.filter((o) => o.daysLeft >= -CLOSED_GRACE_DAYS);

export function filterOpportunities(opportunities: OpportunitySummary[], query: DiscoverQuery) {
  const search = query.q.trim().toLowerCase();
  const maxDays = DEADLINE_OPTIONS.find((option) => option.value === query.deadline)?.maxDays;

  return opportunities.filter((o) => {
    if (search && !o.title.toLowerCase().includes(search) && !(o.provider ?? "").toLowerCase().includes(search)) {
      return false;
    }
    if (query.type !== "all" && o.type.toLowerCase() !== query.type) return false;
    if (maxDays !== undefined && (o.daysLeft < 0 || o.daysLeft > maxDays)) return false;
    if (
      query.locations.length > 0 &&
      !query.locations.some((location) => (location === REMOTE_LOCATION ? o.isRemote : o.location === location))
    ) {
      return false;
    }
    if (query.fields.length > 0 && !query.fields.includes(o.fieldOfStudy)) return false;
    if (!query.quick.every((quick) => QUICK_TEST[quick](o))) return false;
    return true;
  });
}

/** Best match (default) or soonest deadline; closed ones always go last. "Newest" has no data yet. */
export function sortOpportunities(opportunities: OpportunitySummary[], sort: SortOrder) {
  const byMatch = (a: OpportunitySummary, b: OpportunitySummary) => b.matchScore - a.matchScore;
  const byDeadline = (a: OpportunitySummary, b: OpportunitySummary) => a.daysLeft - b.daysLeft;
  const compare = sort === "deadline" ? byDeadline : byMatch;

  return [...opportunities].sort((a, b) => {
    const closedA = a.daysLeft < 0;
    const closedB = b.daysLeft < 0;
    if (closedA !== closedB) return closedA ? 1 : -1;
    return compare(a, b);
  });
}

/** Distinct values for a filter's options, sorted. */
export const distinct = (values: string[]) => Array.from(new Set(values)).sort();
