import { Pagination } from "@/src/shared/ui/Pagination";
import { ApplicationSummary } from "../types/application";
import { ApplicationRow } from "./ApplicationRow";

export function ApplicationsTable({
  applications,
  page,
  pageCount,
  onPageChange,
}: {
  applications: ApplicationSummary[];
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="bg-white shadow-card rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-neutral-100 text-caption text-neutral-800 uppercase tracking-wide">
              <th className="px-5 py-4 font-medium">Opportunity</th>
              <th className="px-5 py-4 font-medium">Deadline</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center">
                  <p className="font-medium text-neutral-800 text-small">
                    No applications match your filters
                  </p>
                  <p className="mt-1 text-neutral-500 text-small">
                    Try adjusting the search or filters above.
                  </p>
                </td>
              </tr>
            ) : (
              applications.map((application) => (
                <ApplicationRow key={application.id} application={application} />
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        pageCount={pageCount}
        onPageChange={onPageChange}
        className="px-5 py-4 border-neutral-100 border-t"
      />
    </div>
  );
}
