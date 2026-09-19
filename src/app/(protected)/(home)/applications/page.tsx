import Link from "next/link";
import { Plus } from "lucide-react";

import PageHeader from "@/src/shared/ui/PageHeader";
import { ApplicationStatCards } from "@/src/feature/applications/components/ApplicationStatCards";
import { ApplicationsExplorer } from "@/src/feature/applications/components/ApplicationsExplorer";

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Applications"
        description="Track the status of every opportunity you've applied to."
        action={
          <Link
            href="/applications/new"
            className="inline-flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-800 px-4 rounded-sm w-fit h-10 font-medium text-white text-sm transition-colors"
          >
            <Plus size={16} strokeWidth={2} />
            New Application
          </Link>
        }
      />

      <ApplicationStatCards />
      <ApplicationsExplorer />
    </div>
  );
}
