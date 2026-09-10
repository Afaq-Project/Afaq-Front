import { Search } from "lucide-react";

import Select from "@/src/shared/ui/Select";
import { ALL_OPTION, DEADLINE_FILTER_OPTIONS, DiscoverFilterState } from "../types/filters";

interface DiscoverFiltersProps {
  filters: DiscoverFilterState;
  locations: string[];
  fieldsOfStudy: string[];
  onChange: (filters: DiscoverFilterState) => void;
}

const TYPE_OPTIONS = [
  { value: ALL_OPTION, label: "All types" },
  { value: "Scholarship", label: "Scholarship" },
  { value: "Internship", label: "Internship" },
  { value: "Fellowship", label: "Fellowship" },
];

export function DiscoverFilters({
  filters,
  locations,
  fieldsOfStudy,
  onChange,
}: DiscoverFiltersProps) {
  const locationOptions = [
    { value: ALL_OPTION, label: "All locations" },
    ...locations.map((location) => ({ value: location, label: location })),
  ];

  const fieldOfStudyOptions = [
    { value: ALL_OPTION, label: "All fields of study" },
    ...fieldsOfStudy.map((field) => ({ value: field, label: field })),
  ];

  return (
    <div className="flex flex-col gap-4 bg-white shadow-card p-4 rounded-lg">
      <label className="flex items-center gap-2 bg-neutral-50 px-4 rounded-sm focus-within:ring-2 focus-within:ring-primary-400 h-11 transition-shadow">
        <Search size={16} strokeWidth={1.75} className="text-neutral-400 shrink-0" />
        <input
          type="search"
          placeholder="Search opportunities"
          value={filters.search}
          onChange={(event) =>
            onChange({ ...filters, search: event.target.value })
          }
          className="bg-transparent focus:outline-none w-full text-neutral-900 text-small placeholder:text-neutral-400"
        />
      </label>

      <div className="gap-3 grid grid-cols-2 lg:grid-cols-4">
        <Select
          aria-label="Type"
          options={TYPE_OPTIONS}
          value={filters.type}
          onChange={(event) =>
            onChange({
              ...filters,
              type: event.target.value as DiscoverFilterState["type"],
            })
          }
        />
        <Select
          aria-label="Deadline"
          options={DEADLINE_FILTER_OPTIONS}
          value={filters.deadline}
          onChange={(event) =>
            onChange({
              ...filters,
              deadline: event.target.value as DiscoverFilterState["deadline"],
            })
          }
        />
        <Select
          aria-label="Location"
          options={locationOptions}
          value={filters.location}
          onChange={(event) =>
            onChange({ ...filters, location: event.target.value })
          }
        />
        <Select
          aria-label="Field of study"
          options={fieldOfStudyOptions}
          value={filters.fieldOfStudy}
          onChange={(event) =>
            onChange({ ...filters, fieldOfStudy: event.target.value })
          }
        />
      </div>
    </div>
  );
}
