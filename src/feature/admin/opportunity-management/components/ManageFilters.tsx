import Select from "@/src/shared/ui/Select";
import {
  DEADLINE_RANGE_OPTIONS,
  FILTERABLE_STATUSES,
  FILTERABLE_TYPES,
  ManageFilterState,
} from "../types/filters";

export function ManageFilters({
  filters,
  onFiltersChange,
}: {
  filters: ManageFilterState;
  onFiltersChange: (filters: ManageFilterState) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-white shadow-card p-4 rounded-lg">
      <Select
        aria-label="Filter by type"
        value={filters.type}
        onChange={(event) =>
          onFiltersChange({
            ...filters,
            type: event.target.value as ManageFilterState["type"],
          })
        }
        className="sm:w-40"
        options={[
          { value: "all", label: "All types" },
          ...FILTERABLE_TYPES.map((type) => ({ value: type, label: type })),
        ]}
      />

      <Select
        aria-label="Filter by status"
        value={filters.status}
        onChange={(event) =>
          onFiltersChange({
            ...filters,
            status: event.target.value as ManageFilterState["status"],
          })
        }
        className="sm:w-40"
        options={[
          { value: "all", label: "All statuses" },
          ...FILTERABLE_STATUSES.map((status) => ({ value: status, label: status })),
        ]}
      />

      <Select
        aria-label="Filter by deadline"
        value={filters.deadlineRange}
        onChange={(event) =>
          onFiltersChange({
            ...filters,
            deadlineRange: event.target.value as ManageFilterState["deadlineRange"],
          })
        }
        className="sm:w-48"
        options={DEADLINE_RANGE_OPTIONS}
      />
    </div>
  );
}
