"use client";

import { useMemo } from "react";
import { OPPORTUNITIES } from "@/src/feature/opportunities/mocks/opportunities";
import { useDiscoverQuery } from "../hooks/useDiscoverQuery";
import { useMatchingReadiness } from "../hooks/useMatchingReadiness";
import { DEFAULT_QUERY, REMOTE_LOCATION, type SortOrder } from "../types/filters";
import {
  distinct,
  filterOpportunities,
  listable,
  sortOpportunities,
  toSearchParams,
} from "../services/utils";
import { DiscoverControls } from "./DiscoverControls";
import { NoResultsState, ProfileIncompleteState, RelaxedResultsBanner } from "./DiscoverStates";
import { OpportunityGrid, OpportunityGridSkeleton } from "./OpportunityGrid";
import { SortSelect } from "./SortSelect";

const CATALOG = listable(OPPORTUNITIES);
const LOCATION_OPTIONS = [REMOTE_LOCATION, ...distinct(CATALOG.map((o) => o.location))];
const FIELD_OPTIONS = distinct(CATALOG.map((o) => o.fieldOfStudy));

// TODO: enable "Newest" once opportunities carry a published date.
const NEWEST_AVAILABLE = false;

/** Discover: the controls card, a result count with sort, and the results or the right empty state. */
export function DiscoverExplorer() {
  const { query, update } = useDiscoverQuery();
  const readiness = useMatchingReadiness();
  // A shared "newest" link still sorts by best match until that sort exists.
  const sort: SortOrder = query.sort === "newest" && !NEWEST_AVAILABLE ? "match" : query.sort;

  const results = useMemo(
    () => sortOpportunities(filterOpportunities(CATALOG, query), sort),
    [query, sort],
  );
  // TODO: the matching API should say when it relaxed the hard filters; for now it's inferred
  // from the mock's meetsRequirements flags.
  const relaxed = results.length > 0 && results.every((o) => o.meetsRequirements === false);

  const clearAll = () => update({ ...DEFAULT_QUERY, sort: query.sort });

  return (
    <div className="flex flex-col gap-4">
      <DiscoverControls
        query={query}
        update={update}
        locationOptions={LOCATION_OPTIONS}
        fieldOptions={FIELD_OPTIONS}
        resultCount={results.length}
        disabled={readiness.isLoading || readiness.missing !== null}
      />

      {readiness.isLoading ? (
        <OpportunityGridSkeleton />
      ) : readiness.missing ? (
        <ProfileIncompleteState missing={readiness.missing} />
      ) : (
        <>
          <div className="flex justify-between items-center gap-3">
            <p aria-live="polite" className="text-neutral-600 text-small">
              {results.length} {results.length === 1 ? "opportunity" : "opportunities"}
            </p>
            <SortSelect value={sort} onChange={(next) => update({ sort: next })} newestAvailable={NEWEST_AVAILABLE} />
          </div>

          {results.length === 0 ? (
            <NoResultsState onClearAll={clearAll} />
          ) : (
            <>
              {relaxed && <RelaxedResultsBanner />}
              <OpportunityGrid key={toSearchParams({ ...query, sort }).toString()} opportunities={results} />
            </>
          )}
        </>
      )}
    </div>
  );
}
