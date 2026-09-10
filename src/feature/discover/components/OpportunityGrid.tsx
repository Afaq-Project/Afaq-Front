import { OpportunityCard } from "@/src/feature/opportunities/components/OpportunityCard";
import { OpportunitySummary } from "@/src/feature/opportunities/types/opportunity";

export function OpportunityGrid({
  opportunities,
}: {
  opportunities: OpportunitySummary[];
}) {
  if (opportunities.length === 0) {
    return (
      <div className="flex flex-col items-center gap-1 bg-white shadow-card py-16 rounded-lg text-center">
        <p className="font-medium text-neutral-800 text-small">
          No opportunities match your filters
        </p>
        <p className="text-neutral-500 text-small">
          Try adjusting the search or filters above.
        </p>
      </div>
    );
  }

  return (
    <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
      {opportunities.map((opportunity) => (
        <OpportunityCard key={opportunity.id} opportunity={opportunity} />
      ))}
    </div>
  );
}
