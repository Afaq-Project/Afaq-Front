"use client";

import { useMemo, useState } from "react";

import Button from "@/src/shared/ui/Button";
import { OPPORTUNITIES } from "@/src/feature/opportunities/mocks/opportunities";
import { DiscoverFilters } from "./DiscoverFilters";
import { OpportunityGrid } from "./OpportunityGrid";
import { DEFAULT_FILTERS } from "../types/filters";
import { filterOpportunities } from "../services/utils";

const PAGE_SIZE = 6;

export function DiscoverExplorer() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const locations = useMemo(
    () => Array.from(new Set(OPPORTUNITIES.map((o) => o.location))).sort(),
    [],
  );
  const fieldsOfStudy = useMemo(
    () => Array.from(new Set(OPPORTUNITIES.map((o) => o.fieldOfStudy))).sort(),
    [],
  );

  const filtered = useMemo(
    () => filterOpportunities(OPPORTUNITIES, filters),
    [filters],
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  function handleFiltersChange(next: typeof filters) {
    setFilters(next);
    setVisibleCount(PAGE_SIZE);
  }

  return (
    <div className="flex flex-col gap-4">
      <DiscoverFilters
        filters={filters}
        locations={locations}
        fieldsOfStudy={fieldsOfStudy}
        onChange={handleFiltersChange}
      />

      <OpportunityGrid opportunities={visible} />

      {hasMore && (
        <div className="flex justify-center mt-2">
          <Button
            variant="secondary"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Load more opportunities
          </Button>
        </div>
      )}
    </div>
  );
}
