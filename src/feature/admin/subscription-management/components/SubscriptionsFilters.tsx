import Select from "@/src/shared/ui/Select";
import { FILTERABLE_EVENT_TYPES, SubscriptionFilterState } from "../types/filters";

export function SubscriptionsFilters({
  filters,
  onFiltersChange,
}: {
  filters: SubscriptionFilterState;
  onFiltersChange: (filters: SubscriptionFilterState) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 bg-white shadow-card p-4 rounded-lg">
      <Select
        aria-label="Filter by event type"
        value={filters.eventType}
        onChange={(event) =>
          onFiltersChange({
            ...filters,
            eventType: event.target.value as SubscriptionFilterState["eventType"],
          })
        }
        className="sm:w-56"
        options={[
          { value: "all", label: "All event types" },
          ...FILTERABLE_EVENT_TYPES.map((type) => ({ value: type, label: type })),
        ]}
      />

      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="subDateFrom" className="font-medium text-neutral-800 text-xs">
            Date from
          </label>
          <input
            id="subDateFrom"
            type="date"
            value={filters.dateFrom}
            onChange={(event) => onFiltersChange({ ...filters, dateFrom: event.target.value })}
            className="border-neutral-200 rounded-sm focus:ring-2 focus:ring-primary-400 px-3 h-10 text-neutral-900 text-sm focus:outline-none focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="subDateTo" className="font-medium text-neutral-800 text-xs">
            Date to
          </label>
          <input
            id="subDateTo"
            type="date"
            value={filters.dateTo}
            onChange={(event) => onFiltersChange({ ...filters, dateTo: event.target.value })}
            className="border-neutral-200 rounded-sm focus:ring-2 focus:ring-primary-400 px-3 h-10 text-neutral-900 text-sm focus:outline-none focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
