import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { AiAssistantCard } from "@/src/feature/dashboard/components/AiAssistantCard";

import type { ApplicationDetail } from "../types/detail";
import { ApplicationOverviewCard } from "./ApplicationOverviewCard";
import { LinkedDocumentsCard } from "./LinkedDocumentsCard";
import { ActivityLogCard } from "./ActivityLogCard";
import { QuickLinksCard } from "./QuickLinksCard";

export function ApplicationDetailView({
  application,
}: {
  application: ApplicationDetail;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 w-fit text-neutral-600 hover:text-neutral-900 text-small transition-colors"
      >
        <ArrowLeft size={16} strokeWidth={1.75} />
        Back to applications
      </Link>

      <div className="items-start gap-6 grid grid-cols-1 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ApplicationOverviewCard application={application} />
          <LinkedDocumentsCard documents={application.documents} />
        </div>

        <div className="flex flex-col gap-6">
          <AiAssistantCard />
          <ActivityLogCard activity={application.activity} />
          <QuickLinksCard
            officialSiteUrl={application.officialSiteUrl}
            supportEmail={application.supportEmail}
          />
        </div>
      </div>
    </div>
  );
}
