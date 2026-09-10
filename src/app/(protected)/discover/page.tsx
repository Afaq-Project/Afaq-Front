import { DiscoverExplorer } from "@/src/feature/discover/components/DiscoverExplorer";

export default function DiscoverPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-h1">Discover opportunities</h1>
        <p className="mt-1 text-neutral-600 text-small">
          Search and filter scholarships, internships, and fellowships
          matched to your profile.
        </p>
      </div>

      <DiscoverExplorer />
    </div>
  );
}
