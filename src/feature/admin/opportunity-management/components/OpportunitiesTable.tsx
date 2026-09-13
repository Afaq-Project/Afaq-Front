import { Pagination } from "@/src/shared/ui/Pagination";
import { ManagedOpportunity } from "../types/opportunity";
import { OpportunityRow } from "./OpportunityRow";

export function OpportunitiesTable({
  opportunities,
  onEdit,
  onUnpublish,
  page,
  pageCount,
  onPageChange,
}: {
  opportunities: ManagedOpportunity[];
  onEdit: (id: string) => void;
  onUnpublish: (id: string) => void;
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
              <th className="px-5 py-4 font-medium">Title</th>
              <th className="px-5 py-4 font-medium">Type</th>
              <th className="px-5 py-4 font-medium">Provider</th>
              <th className="px-5 py-4 font-medium">Field of study</th>
              <th className="px-5 py-4 font-medium">Deadline</th>
              <th className="px-5 py-4 font-medium">Status</th>
              <th className="px-5 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center">
                  <p className="font-medium text-neutral-800 text-small">
                    No opportunities match your filters
                  </p>
                  <p className="mt-1 text-neutral-500 text-small">
                    Try adjusting the filters above.
                  </p>
                </td>
              </tr>
            ) : (
              opportunities.map((opportunity) => (
                <OpportunityRow
                  key={opportunity.id}
                  opportunity={opportunity}
                  onEdit={onEdit}
                  onUnpublish={onUnpublish}
                />
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
