"use client";

import { useEffect } from "react";
import { useMatchedFeed, useOpportunityFeed } from "@/src/feature/opportunities/hooks/useOpportunities";
import { ErrorState } from "@/src/shared/ui/ErrorState";
import { useDiscoverQuery } from "../hooks/useDiscoverQuery";
import { useMatchingReadiness } from "../hooks/useMatchingReadiness";
import { DEFAULT_QUERY, type DiscoverMode } from "../types/filters";
import { activeFilterCount, MODE_SUPPORT, supportedQuery, toListParams, toMinScore } from "../services/utils";
import { DiscoverControls } from "./DiscoverControls";
import { MatchesPendingBanner, NoResultsState, ProfileIncompleteBanner } from "./DiscoverStates";
import { OpportunityGrid, OpportunityGridSkeleton } from "./OpportunityGrid";
import { SortSelect } from "./SortSelect";

/**
 * Discover: the controls card (with the sort), and the results or the right empty state. The user's
 * matches come first, best first. With none (profile incomplete, or scores not calculated yet)
 * it's every opportunity without scores, with a banner saying why.
 */
export function DiscoverExplorer() {
  const { query, update } = useDiscoverQuery();
  // Only for the banner: the backend scores incomplete profiles too, so matches are always tried.
  const readiness = useMatchingReadiness();

  const matchedQuery = supportedQuery(query, MODE_SUPPORT.matched);
  const minScore = toMinScore(matchedQuery);
  const matched = useMatchedFeed({ minScore });
  // None at all, or none v1 shows (e.g. all in Arabic) once every page is checked.
  const noMatches =
    matched.isSuccess && !matched.hasNextPage && matched.opportunities.length === 0 && minScore === undefined;

  const mode: DiscoverMode = noMatches ? "all" : "matched";
  const support = MODE_SUPPORT[mode];
  const effective = mode === "matched" ? matchedQuery : supportedQuery(query, support);
  const all = useOpportunityFeed({ params: toListParams(effective), enabled: mode === "all" });
  const feed = mode === "matched" ? matched : all;

  // Closed matches are dropped after the fetch, so a page can come back with nothing to show.
  // Keep going until there's something or nothing's left, instead of an empty grid with "Load more".
  // A failed page stops it; the error state offers the retry.
  const { opportunities, hasNextPage, isFetching, isError, fetchNextPage } = feed;
  const fillingEmptyPage = opportunities.length === 0 && hasNextPage && !isError;
  useEffect(() => {
    if (fillingEmptyPage && !isFetching) fetchNextPage();
  }, [fillingEmptyPage, isFetching, fetchNextPage]);

  const loading = feed.isPending || fillingEmptyPage;
  const filtered = activeFilterCount(effective) > 0;
  const clearAll = () => update({ ...DEFAULT_QUERY, sort: query.sort });

  let results;
  if (loading) {
    results = <OpportunityGridSkeleton />;
  } else if (feed.isError) {
    results = <ErrorState title="We couldn't load opportunities" onRetry={() => feed.refetch()} />;
  } else if (feed.opportunities.length === 0 && !feed.hasNextPage) {
    results = <NoResultsState onClearAll={filtered ? clearAll : undefined} />;
  } else {
    results = (
      <OpportunityGrid
        opportunities={feed.opportunities}
        hasMore={feed.hasNextPage}
        loadingMore={feed.isFetchingNextPage}
        onLoadMore={() => feed.fetchNextPage()}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <DiscoverControls
        query={effective}
        update={update}
        support={support}
        disabled={loading}
        sort={
          support.sorts.length > 1 && (
            <SortSelect value={effective.sort} onChange={(next) => update({ sort: next })} options={support.sorts} />
          )
        }
      />

      {readiness.missing ? (
        <ProfileIncompleteBanner missing={readiness.missing} hasMatches={mode === "matched"} />
      ) : (
        noMatches && !readiness.isLoading && <MatchesPendingBanner hiddenMatches={(matched.total ?? 0) > 0} />
      )}

      {results}
    </div>
  );
}
