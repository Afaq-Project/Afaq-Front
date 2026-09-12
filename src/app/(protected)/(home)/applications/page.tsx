import Link from "next/link";
import { Plus } from "lucide-react";

import { ApplicationStatCards } from "@/src/feature/applications/components/ApplicationStatCards";
import { ApplicationsExplorer } from "@/src/feature/applications/components/ApplicationsExplorer";

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3">
        <div>
          <h1 className="text-h1">Applications</h1>
          <p className="mt-1 text-neutral-600 text-small">
            Track the status of every opportunity you&apos;ve applied to.
          </p>
        </div>

        <Link
          href="/applications/new"
          className="inline-flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-800 px-4 rounded-sm w-fit h-10 font-medium text-white text-sm transition-colors"
        >
          <Plus size={16} strokeWidth={2} />
          New Application
        </Link>
      </div>

      <ApplicationStatCards />
      <ApplicationsExplorer />
    </div>
  );
}
