import { Suspense } from "react";
import Link from "next/link";
import { Compass } from "lucide-react";
import { useTranslations } from "next-intl";
import { ApplicationsSkeleton } from "@/src/feature/applications/components/ApplicationsList";
import { ApplicationsView } from "@/src/feature/applications/components/ApplicationsView";
import { PageGreeting } from "@/src/feature/dashboard/components/PageGreeting";
import { buttonClasses } from "@/src/shared/ui/Button";

export default function ApplicationsPage() {
  const t = useTranslations("applications");
  return (
    <div className="flex flex-col gap-6">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-4">
        <PageGreeting title={t("title")}>{t("subtitle")}</PageGreeting>
        {/* The page's only primary action. (It replaces "New Application", which linked to a missing /applications/new.) */}
        <Link href="/discover" className={buttonClasses("primary", "shrink-0 self-start")}>
          <Compass size={16} strokeWidth={1.75} aria-hidden="true" />
          {t("findOpportunities")}
        </Link>
      </div>

      {/* The view reads its state from the URL (useSearchParams), which needs a Suspense boundary. */}
      <Suspense fallback={<ApplicationsSkeleton />}>
        <ApplicationsView />
      </Suspense>
    </div>
  );
}
