"use client";

import { OpportunityCard } from "@/src/feature/opportunities/components/OpportunityCard";
import { OpportunityCardSkeleton } from "@/src/feature/opportunities/components/OpportunityCardSkeleton";
import type { OpportunitySummary } from "@/src/feature/opportunities/types/opportunity";
import Button from "@/src/shared/ui/Button";

const SKELETON_COUNT = 6;
const GRID_CLASS = "gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

/** 3 / 2 / 1 columns; cards in a row share a height. "Load more" fetches the next page. */
export function OpportunityGrid({
  opportunities,
  hasMore,
  loadingMore,
  onLoadMore,
}: {
  opportunities: OpportunitySummary[];
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMore: () => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <ul className={GRID_CLASS}>
        {opportunities.map((opportunity) => (
          <li key={opportunity.id}>
            <OpportunityCard opportunity={opportunity} />
          </li>
        ))}
      </ul>

      {hasMore && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={onLoadMore} disabled={loadingMore}>
            {loadingMore ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </div>
  );
}

export function OpportunityGridSkeleton() {
  return (
    <div role="status" className={GRID_CLASS}>
      <span className="sr-only">Loading opportunities</span>
      {Array.from({ length: SKELETON_COUNT }, (_, index) => (
        <OpportunityCardSkeleton key={index} />
      ))}
    </div>
  );
}
