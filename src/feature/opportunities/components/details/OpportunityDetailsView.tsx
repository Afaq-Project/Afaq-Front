import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { OpportunityDetail } from "../../types/opportunity";
import { OverviewCard } from "./OverviewCard";
import { DescriptionSection } from "./DescriptionSection";
import { EligibilityFilesCard } from "./EligibilityFilesCard";
import { GallerySection } from "./GallerySection";
import { ApplyCard } from "./ApplyCard";
import { MatchScoreCard } from "./MatchScoreCard";
import { ImportantFactsCard } from "./ImportantFactsCard";

export function OpportunityDetailsView({
  opportunity,
}: {
  opportunity: OpportunityDetail;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Link
        href="/discover"
        className="flex items-center gap-1.5 w-fit text-neutral-600 text-small hover:text-primary-800 transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        Back to Discover
      </Link>

      <div className="items-start gap-4 grid grid-cols-1 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <OverviewCard opportunity={opportunity} />
          <DescriptionSection opportunity={opportunity} />
          <EligibilityFilesCard opportunity={opportunity} />
          <div className="hidden lg:block">
            <GallerySection opportunity={opportunity} />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="hidden lg:block">
            <ApplyCard opportunity={opportunity} />
          </div>
          <MatchScoreCard opportunity={opportunity} />
          <div className="hidden lg:block">
            <ImportantFactsCard opportunity={opportunity} />
          </div>
        </div>
      </div>
    </div>
  );
}
