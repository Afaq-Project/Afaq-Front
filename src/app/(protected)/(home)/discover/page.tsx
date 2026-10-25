import { Suspense } from "react";
import { PageGreeting } from "@/src/feature/dashboard/components/PageGreeting";
import { DiscoverExplorer } from "@/src/feature/discover/components/DiscoverExplorer";
import { OpportunityGridSkeleton } from "@/src/feature/discover/components/OpportunityGrid";
import { useTranslations } from "next-intl";

export default function DiscoverPage() {
  const t = useTranslations("discover");

  return (
    <div className="flex flex-col gap-6">
      <PageGreeting title={t("title")}>{t("subtitle")}</PageGreeting>

      {/* The explorer reads its state from the URL (useSearchParams), which needs a Suspense boundary. */}
      <Suspense fallback={<OpportunityGridSkeleton />}>
        <DiscoverExplorer />
      </Suspense>
    </div>
  );
}
