import { Pagination } from "@/src/shared/ui/Pagination";
import { SubscriptionEvent } from "../types/event";
import { SubscriptionEventRow } from "./SubscriptionEventRow";

export function SubscriptionEventsTable({
  events,
  page,
  pageCount,
  onPageChange,
}: {
  events: SubscriptionEvent[];
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
              <th className="px-5 py-4 font-medium">User</th>
              <th className="px-5 py-4 font-medium">Event type</th>
              <th className="px-5 py-4 font-medium">Date</th>
              <th className="px-5 py-4 font-medium">Billing cycle</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-center">
                  <p className="font-medium text-neutral-800 text-small">
                    No subscription events match your filters
                  </p>
                  <p className="mt-1 text-neutral-500 text-small">
                    Try adjusting the filters above.
                  </p>
                </td>
              </tr>
            ) : (
              events.map((event) => <SubscriptionEventRow key={event.id} event={event} />)
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
