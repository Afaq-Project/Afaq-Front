import { Search } from "lucide-react";

import Select from "@/src/shared/ui/Select";
import {
  ApplicationFilterState,
  FILTERABLE_STATUSES,
  FILTERABLE_TYPES,
} from "../types/filters";
import { STATUS_LABEL } from "../types/status";

export function ApplicationsFilters({
  filters,
  onFiltersChange,
}: {
  filters: ApplicationFilterState;
  onFiltersChange: (filters: ApplicationFilterState) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 bg-white shadow-card p-4 rounded-lg">
      <div className="relative flex-1">
        <Search
          size={16}
          strokeWidth={1.75}
          className="top-1/2 left-3 absolute text-neutral-400 -translate-y-1/2"
        />
        <input
          type="text"
          value={filters.search}
          onChange={(event) =>
            onFiltersChange({ ...filters, search: event.target.value })
          }
          placeholder="Search by opportunity or provider"
          className="pl-9 border-neutral-200 rounded-sm focus:ring-2 focus:ring-primary-400 w-full h-10 text-sm focus:outline-none focus:border-transparent"
        />
      </div>

      <Select
        aria-label="Filter by status"
        value={filters.status}
        onChange={(event) =>
          onFiltersChange({
            ...filters,
            status: event.target.value as ApplicationFilterState["status"],
          })
        }
        className="sm:w-48"
      >
        <option value="all">All statuses</option>
        {FILTERABLE_STATUSES.map((status) => (
          <option key={status} value={status}>
            {STATUS_LABEL[status]}
          </option>
        ))}
      </Select>

      <Select
        aria-label="Filter by type"
        value={filters.type}
        onChange={(event) =>
          onFiltersChange({
            ...filters,
            type: event.target.value as ApplicationFilterState["type"],
          })
        }
        className="sm:w-40"
      >
        <option value="all">All types</option>
        {FILTERABLE_TYPES.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </Select>
    </div>
  );
}
