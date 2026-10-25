"use client";

import { Pagination } from "@/src/shared/ui/Pagination";
import { Skeleton } from "@/src/shared/ui/Skeleton";
import type { ApplicationSummary } from "../types/application";
import type { ApplicationStatus } from "../types/status";
import { ApplicationDeadline, ApplicationProgress, OpportunityCell, RowActions } from "./ApplicationParts";

interface ApplicationsListProps {
  applications: ApplicationSummary[];
  /** Index of the first shown application in the full list, for "Showing x–y of n". */
  offset: number;
  total: number;
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onRemove: (application: ApplicationSummary, trigger: HTMLElement | null) => void;
}

const TH_CLASS = "px-5 py-3 font-medium text-caption text-neutral-600";

/**
 * Applications as a table from 768px (whole row links to the opportunity through the title's
 * stretched link; the action cell sits above it) and as stacked cards below, with a shared
 * "Showing x–y of n" footer and pagination.
 */
export function ApplicationsList({
  applications,
  offset,
  total,
  page,
  pageCount,
  onPageChange,
  onStatusChange,
  onRemove,
}: ApplicationsListProps) {
  const footer = (
    <div className="flex justify-between items-center gap-3 px-5 py-3 border-neutral-100 border-t">
      <p className="text-neutral-600 text-small">
        Showing {offset + 1}–{offset + applications.length} of {total}
      </p>
      <Pagination page={page} pageCount={pageCount} onPageChange={onPageChange} />
    </div>
  );

  return (
    <>
      {/* No overflow-hidden: it would clip the row menus at the card's bottom edge. */}
      <div className="hidden md:block bg-white border border-neutral-100 rounded-lg">
        <table className="w-full text-start">
          <thead>
            <tr className="border-neutral-100 border-b">
              <th scope="col" className={TH_CLASS}>
                Opportunity
              </th>
              <th scope="col" className={TH_CLASS}>
                Deadline
              </th>
              <th scope="col" className={TH_CLASS}>
                Progress
              </th>
              <th scope="col" className={`${TH_CLASS} text-end`}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {applications.map((application) => (
              <tr key={application.id} className="relative hover:bg-neutral-50 transition-colors">
                {/* max-w-0 + width lets the title truncate instead of widening the table. */}
                <td className="px-5 py-3 w-[45%] max-w-0 h-16">
                  <OpportunityCell application={application} linked />
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <ApplicationDeadline application={application} />
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  <ApplicationProgress status={application.status} />
                </td>
                <td className="px-5 py-3">
                  <RowActions application={application} onStatusChange={onStatusChange} onRemove={onRemove} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {footer}
      </div>

      <div className="md:hidden flex flex-col gap-3">
        <ul className="flex flex-col gap-3">
          {applications.map((application) => (
            <li
              key={application.id}
              className="relative flex flex-col gap-3 bg-white p-4 border border-neutral-100 hover:border-neutral-200 rounded-lg transition-colors"
            >
              <OpportunityCell application={application} linked />
              <ApplicationProgress status={application.status} />
              <ApplicationDeadline application={application} />
              <RowActions application={application} onStatusChange={onStatusChange} onRemove={onRemove} fullWidth />
            </li>
          ))}
        </ul>
        <div className="bg-white border border-neutral-100 rounded-lg overflow-hidden [&>div]:border-t-0">{footer}</div>
      </div>
    </>
  );
}

/** Loading placeholder shaped like the table rows. */
export function ApplicationsSkeleton() {
  return (
    <div role="status" className="bg-white border border-neutral-100 rounded-lg overflow-hidden">
      <span className="sr-only">Loading applications</span>
      <div className="px-5 py-3 border-neutral-100 border-b">
        <Skeleton className="w-24 h-3" />
      </div>
      {Array.from({ length: 5 }, (_, index) => (
        <div key={index} className="flex items-center gap-4 px-5 border-neutral-100 border-b last:border-b-0 h-16">
          <Skeleton className="rounded-[6px] w-10 h-7.5" />
          <div className="flex flex-col flex-1 gap-1.5">
            <Skeleton className="w-48 h-3.5" />
            <Skeleton className="w-32 h-3" />
          </div>
          <Skeleton className="hidden md:block w-24 h-3.5" />
          <Skeleton className="hidden md:block rounded-full w-28 h-5" />
          <Skeleton className="w-16 h-8" />
        </div>
      ))}
    </div>
  );
}
