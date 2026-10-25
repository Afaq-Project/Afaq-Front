"use client";

import { useMemo, useState } from "react";
import {
  useInfiniteQuery,
  useQueries,
  useQuery,
  useQueryClient,
  type InfiniteData,
  type QueryClient,
} from "@tanstack/react-query";
import { useAllCountries } from "@/src/shared/lib/api/hooks/useReferenceData";
import { isoDateFromToday } from "@/src/shared/lib/deadline";
import type { MatchTier } from "@/src/feature/dashboard/types/status";
import { fromMatch, fromOpportunity, toDetail, type CountryCodes } from "../services/mappers";
import { opportunityService, recommendationService, type Page } from "../services/opportunityService";
import type { ApiMatch, ListOpportunitiesParams } from "../types/api";
import type { OpportunitySummary } from "../types/opportunity";

/** Discover's grid shows 3 / 2 / 1 columns, so 12 fills whole rows at every width. */
export const FEED_PAGE_SIZE = 12;
const FIVE_MINUTES = 5 * 60 * 1000;
// Short lists fetch this many times what they show, since some results are dropped after the
// fetch (closed ones, listings v1 doesn't show), so they still fill.
const HEADROOM = 3;

const isShown = (o: OpportunitySummary | null): o is OpportunitySummary => o !== null;
/** Still open, or with no deadline listed. Closed ones only belong in search results. */
const isOpenShown = (o: OpportunitySummary | null): o is OpportunitySummary =>
  o !== null && (o.daysLeft === undefined || o.daysLeft >= 0);

/** Lets the API's country names find their flags. Without the list yet, cards show a globe. */
function useMapContext() {
  const { data: countries } = useAllCountries();
  // Captured once so the countdowns don't shift between renders.
  const [now] = useState(() => new Date());
  const countryCodes: CountryCodes = useMemo(
    () =>
      new Map(
        (countries ?? [])
          .filter((c) => c.isoCode2)
          .map((c) => [c.nameEn.toLowerCase(), c.isoCode2!.toLowerCase()]),
      ),
    [countries],
  );
  return useMemo(() => ({ countryCodes, now }), [countryCodes, now]);
}

const nextPage = <T>(last: Page<T>) => (last.hasNext ? last.page + 1 : undefined);

/**
 * The user's open matches, best first, a page at a time. The endpoint can't filter out closed
 * ones, so they're dropped here and a page can show fewer than FEED_PAGE_SIZE.
 */
export function useMatchedFeed({ minScore }: { minScore?: number }) {
  const ctx = useMapContext();
  const query = useInfiniteQuery({
    queryKey: ["recommendations", "feed", { minScore }],
    queryFn: ({ pageParam }) =>
      recommendationService.matchesWithOpportunities({
        page: pageParam,
        limit: FEED_PAGE_SIZE,
        sort: "score_desc",
        min_score: minScore,
      }),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    staleTime: FIVE_MINUTES,
  });
  const opportunities = useMemo(
    () => query.data?.pages.flatMap((page) => page.items.map((m) => fromMatch(m, ctx))).filter(isOpenShown) ?? [],
    [query.data, ctx],
  );
  return { ...query, opportunities, total: query.data?.pages[0]?.total };
}

/** Every opportunity, without scores: for profiles that can't be matched yet. Closed ones are left out by `params`. */
export function useOpportunityFeed({ params, enabled }: { params: Omit<ListOpportunitiesParams, "page" | "limit">; enabled: boolean }) {
  const ctx = useMapContext();
  const query = useInfiniteQuery({
    queryKey: ["opportunities", "feed", params],
    queryFn: ({ pageParam }) => opportunityService.list({ ...params, page: pageParam, limit: FEED_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: nextPage,
    staleTime: FIVE_MINUTES,
    enabled,
  });
  const opportunities = useMemo(
    () => query.data?.pages.flatMap((page) => page.items.map((o) => fromOpportunity(o, ctx))).filter(isShown) ?? [],
    [query.data, ctx],
  );
  return { ...query, opportunities };
}

/** The top `limit` open matches, for the dashboard. */
export function useTopMatches({ limit }: { limit: number }) {
  const ctx = useMapContext();
  const query = useQuery({
    queryKey: ["recommendations", "top", limit],
    queryFn: () => recommendationService.matchesWithOpportunities({ limit: limit * HEADROOM, sort: "score_desc" }),
    staleTime: FIVE_MINUTES,
  });
  const opportunities = useMemo(
    () => (query.data?.items.map((m) => fromMatch(m, ctx)).filter(isOpenShown) ?? []).slice(0, limit),
    [query.data, ctx, limit],
  );
  return { ...query, opportunities };
}

/**
 * The newest `limit` open opportunities, for profiles without matches. Not /opportunities/recent:
 * that feed is only 10 items and keeps closed ones, so it rarely has enough open ones.
 */
export function useNewestOpportunities({ limit, enabled }: { limit: number; enabled: boolean }) {
  const ctx = useMapContext();
  const query = useQuery({
    queryKey: ["opportunities", "newest", limit],
    queryFn: () =>
      opportunityService.list({
        page: 1,
        limit: limit * HEADROOM,
        sort: "created_at:desc",
        deadline_from: isoDateFromToday(0),
      }),
    staleTime: FIVE_MINUTES,
    enabled,
  });
  const opportunities = useMemo(
    () => (query.data?.items.map((o) => fromOpportunity(o, ctx)).filter(isOpenShown) ?? []).slice(0, limit),
    [query.data, ctx, limit],
  );
  return { ...query, opportunities };
}

// Tier floors, matching getMatchTier: strong ≥70, possible 40–69, low below.
const TIER_FLOORS = [0, 40, 70];

/**
 * Matches by tier, from the totals of three one-item requests. These count every type, Arabic
 * listings and closed opportunities too, since the matches endpoint can't filter on them.
 */
export function useMatchTierCounts() {
  const results = useQueries({
    queries: TIER_FLOORS.map((minScore) => ({
      queryKey: ["recommendations", "count", minScore],
      queryFn: () => recommendationService.matches({ limit: 1, min_score: minScore || undefined }),
      staleTime: FIVE_MINUTES,
    })),
  });
  const [all, possibleUp, strong] = results.map((result) => result.data?.total);
  const counts: Record<MatchTier, number> | undefined =
    all !== undefined && possibleUp !== undefined && strong !== undefined
      ? { strong, possible: possibleUp - strong, low: all - possibleUp }
      : undefined;
  return { counts, isPending: results.some((r) => r.isPending), isError: results.some((r) => r.isError) };
}

/** A match already loaded by the feed or dashboard; there's no endpoint for a single one. */
function findCachedMatch(queryClient: QueryClient, opportunityId: string): ApiMatch | undefined {
  const cached = queryClient.getQueriesData<Page<ApiMatch> | InfiniteData<Page<ApiMatch>>>({ queryKey: ["recommendations"] });
  for (const [, data] of cached) {
    if (!data) continue;
    const pages = "pages" in data ? data.pages : [data];
    const match = pages.flatMap((page) => page.items).find((m) => m.opportunity_id === opportunityId);
    if (match) return match;
  }
  return undefined;
}

/** One opportunity for its details page, with its score when a match for it is cached. */
export function useOpportunity(id: string) {
  const ctx = useMapContext();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["opportunities", "detail", id],
    queryFn: () => opportunityService.getById(id),
    staleTime: FIVE_MINUTES,
  });
  const opportunity = useMemo(
    () => (query.data ? toDetail(query.data, findCachedMatch(queryClient, id), ctx) : undefined),
    [query.data, queryClient, id, ctx],
  );
  return { ...query, opportunity };
}
