import Link from "next/link";
import { RECOMMENDED_OPPORTUNITIES } from "@/src/feature/opportunities/mocks/opportunities";
import { OpportunityCard } from "@/src/feature/opportunities/components/OpportunityCard";

export function OpportunitiesSection() {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-h2">Best opportunities for you</h2>
        <Link
          href="/discover"
          className="font-medium text-primary-600 text-small hover:text-primary-800 transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
        {RECOMMENDED_OPPORTUNITIES.map((opportunity) => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </div>
  );
}
