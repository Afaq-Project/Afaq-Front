import type { ListOpportunitiesParams } from "@/src/feature/opportunities/types/api";
import { isoDateFromToday } from "@/src/shared/lib/deadline";
import {
  DEADLINE_OPTIONS,
  DEFAULT_QUERY,
  QUICK_FILTER_OPTIONS,
  REMOTE_LOCATION,
  SORT_OPTIONS,
  STRONG_MATCH_MIN,
  TYPE_OPTIONS,
  type DeadlineFilter,
  type DiscoverMode,
  type DiscoverQuery,
  type DiscoverSupport,
  type QuickFilter,
  type SortOrder,
  type TypeFilter,
} from "../types/filters";

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

/**
 * What each mode's endpoint can filter and sort on. Matches only take a minimum score; the
 * opportunities list takes remote, a deadline range and a sort. Everything else waits for the API.
 */
export const MODE_SUPPORT: Record<DiscoverMode, DiscoverSupport> = {
  matched: { search: false, type: false, deadline: false, locations: [], fields: [], quick: ["strong"], sorts: ["match"] },
  all: { search: false, type: false, deadline: true, locations: [REMOTE_LOCATION], fields: [], quick: [], sorts: ["newest", "deadline"] },
};

/** The query with what the mode can't apply reset, so a shared link never shows filters it ignores. */
export function supportedQuery(query: DiscoverQuery, support: DiscoverSupport): DiscoverQuery {
  return {
    q: support.search ? query.q : DEFAULT_QUERY.q,
    type: support.type ? query.type : DEFAULT_QUERY.type,
    deadline: support.deadline ? query.deadline : DEFAULT_QUERY.deadline,
    locations: query.locations.filter((location) => support.locations.includes(location)),
    fields: query.fields.filter((field) => support.fields.includes(field)),
    quick: query.quick.filter((quick) => support.quick.includes(quick)),
    sort: support.sorts.includes(query.sort) ? query.sort : support.sorts[0],
  };
}

/**
 * The opportunities-list params for a (supported) query. Closed opportunities are left out
 * unless the user is searching, since an old one is only worth showing when asked for.
 */
export function toListParams(query: DiscoverQuery): Omit<ListOpportunitiesParams, "page" | "limit"> {
  const maxDays = DEADLINE_OPTIONS.find((option) => option.value === query.deadline)?.maxDays;
  const openOnly = maxDays !== undefined || query.q.trim() === "";
  return {
    sort: query.sort === "deadline" ? "deadline:asc" : "created_at:desc",
    deadline_from: openOnly ? isoDateFromToday(0) : undefined,
    deadline_to: maxDays !== undefined ? isoDateFromToday(maxDays) : undefined,
    is_remote: query.locations.includes(REMOTE_LOCATION) ? true : undefined,
  };
}

/** The matches feed's minimum score for a (supported) query. */
export const toMinScore = (query: DiscoverQuery) => (query.quick.includes("strong") ? STRONG_MATCH_MIN : undefined);
