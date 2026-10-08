import { Suspense } from "react";
import { PageGreeting } from "@/src/feature/dashboard/components/PageGreeting";
import { DiscoverExplorer } from "@/src/feature/discover/components/DiscoverExplorer";
import { OpportunityGridSkeleton } from "@/src/feature/discover/components/OpportunityGrid";

export default function DiscoverPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageGreeting title="Discover opportunities">Scholarships and internships matched to your profile.</PageGreeting>

      {/* The explorer reads its state from the URL (useSearchParams), which needs a Suspense boundary. */}
      <Suspense fallback={<OpportunityGridSkeleton />}>
        <DiscoverExplorer />
      </Suspense>
    </div>
  );
}
