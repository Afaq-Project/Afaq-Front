"use client";

import { useState } from "react";
import { OpportunityCard } from "@/src/feature/opportunities/components/OpportunityCard";
import { OpportunityCardSkeleton } from "@/src/feature/opportunities/components/OpportunityCardSkeleton";
import type { OpportunitySummary } from "@/src/feature/opportunities/types/opportunity";
import Button from "@/src/shared/ui/Button";

const PAGE_SIZE = 12;
const SKELETON_COUNT = 6;
const GRID_CLASS = "gap-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

/** 3 / 2 / 1 columns; cards in a row share a height. Shows 12 at a time with "Load more". */
export function OpportunityGrid({ opportunities }: { opportunities: OpportunitySummary[] }) {
  // The parent keys this by query, so a new search starts back at the first page.
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = opportunities.slice(0, visibleCount);

  return (
    <div className="flex flex-col gap-6">
      <ul className={GRID_CLASS}>
        {visible.map((opportunity) => (
          <li key={opportunity.id}>
            <OpportunityCard opportunity={opportunity} />
          </li>
        ))}
      </ul>

      {visibleCount < opportunities.length && (
        <div className="flex justify-center">
          <Button variant="secondary" onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}>
            Load more
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
