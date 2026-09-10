import Image from "next/image";

import Badge from "@/src/shared/ui/Badge";
import { OpportunityDetail } from "../../types/opportunity";
import { OverviewQuickActions } from "./OverviewQuickActions";
import { OverviewFacts } from "./OverviewFacts";

export function OverviewCard({
  opportunity,
}: {
  opportunity: OpportunityDetail;
}) {
  return (
    <div className="flex flex-col bg-white shadow-card rounded-lg overflow-hidden">
      <div className="relative w-full h-56 sm:h-72">
        <Image
          src={opportunity.imageUrl}
          alt={opportunity.title}
          fill
          sizes="(min-width: 1024px) 66vw, 100vw"
          className="object-cover"
          priority
        />
        <OverviewQuickActions opportunity={opportunity} />
      </div>

      <div className="flex flex-col gap-3 p-5">
        <div>
          <h1 className="text-h1">{opportunity.title}</h1>
          <p className="mt-1 text-neutral-600 text-small">
            {opportunity.provider}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge tone="gray">{opportunity.type}</Badge>
          {opportunity.keywords.map((keyword) => (
            <Badge key={keyword} tone="green">
              {keyword}
            </Badge>
          ))}
        </div>

        <OverviewFacts opportunity={opportunity} />
      </div>
    </div>
  );
}
