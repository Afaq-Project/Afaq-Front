import PageHeader from "@/src/shared/ui/PageHeader";
import { DiscoverExplorer } from "@/src/feature/discover/components/DiscoverExplorer";

export default function DiscoverPage() {
  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Discover opportunities"
        description="Search and filter scholarships, internships, and fellowships matched to your profile."
      />

      <DiscoverExplorer />
    </div>
  );
}
