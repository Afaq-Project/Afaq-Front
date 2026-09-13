import Select from "@/src/shared/ui/Select";
import { ApprovalFilterState, FILTERABLE_TYPES } from "../types/filters";

export function ApprovalsFilters({
  filters,
  onFiltersChange,
  sources,
}: {
  filters: ApprovalFilterState;
  onFiltersChange: (filters: ApprovalFilterState) => void;
  sources: string[];
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 bg-white shadow-card p-4 rounded-lg">
      <Select
        aria-label="Filter by source"
        value={filters.source}
        onChange={(event) =>
          onFiltersChange({ ...filters, source: event.target.value })
        }
        className="sm:w-48"
        options={[
          { value: "all", label: "All sources" },
          ...sources.map((source) => ({ value: source, label: source })),
        ]}
      />

      <Select
        aria-label="Filter by type"
        value={filters.type}
        onChange={(event) =>
          onFiltersChange({
            ...filters,
            type: event.target.value as ApprovalFilterState["type"],
          })
        }
        className="sm:w-40"
        options={[
          { value: "all", label: "All types" },
          ...FILTERABLE_TYPES.map((type) => ({ value: type, label: type })),
        ]}
      />

      <div className="flex gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="dateScrapedFrom" className="font-medium text-neutral-800 text-xs">
            Scraped from
          </label>
          <input
            id="dateScrapedFrom"
            type="date"
            value={filters.dateScrapedFrom}
            onChange={(event) =>
              onFiltersChange({ ...filters, dateScrapedFrom: event.target.value })
            }
            className="border-neutral-200 rounded-sm focus:ring-2 focus:ring-primary-400 px-3 h-10 text-neutral-900 text-sm focus:outline-none focus:border-transparent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="dateScrapedTo" className="font-medium text-neutral-800 text-xs">
            Scraped to
          </label>
          <input
            id="dateScrapedTo"
            type="date"
            value={filters.dateScrapedTo}
            onChange={(event) =>
              onFiltersChange({ ...filters, dateScrapedTo: event.target.value })
            }
            className="border-neutral-200 rounded-sm focus:ring-2 focus:ring-primary-400 px-3 h-10 text-neutral-900 text-sm focus:outline-none focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
