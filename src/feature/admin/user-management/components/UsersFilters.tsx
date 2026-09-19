import { Search } from "lucide-react";

import Select from "@/src/shared/ui/Select";
import {
  FILTERABLE_SIGNUP_METHODS,
  FILTERABLE_TIERS,
  UserFilterState,
} from "../types/filters";

export function UsersFilters({
  filters,
  onFiltersChange,
}: {
  filters: UserFilterState;
  onFiltersChange: (filters: UserFilterState) => void;
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
          onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
          placeholder="Search by name or email"
          className="pl-9 border-neutral-200 rounded-sm focus:ring-2 focus:ring-primary-400 w-full h-10 text-sm focus:outline-none focus:border-transparent"
        />
      </div>

      <Select
        aria-label="Filter by tier"
        value={filters.tier}
        onChange={(event) =>
          onFiltersChange({
            ...filters,
            tier: event.target.value as UserFilterState["tier"],
          })
        }
        className="sm:w-40"
        options={[
          { value: "all", label: "All tiers" },
          ...FILTERABLE_TIERS.map((tier) => ({ value: tier, label: tier })),
        ]}
      />

      <Select
        aria-label="Filter by signup method"
        value={filters.signupMethod}
        onChange={(event) =>
          onFiltersChange({
            ...filters,
            signupMethod: event.target.value as UserFilterState["signupMethod"],
          })
        }
        className="sm:w-44"
        options={[
          { value: "all", label: "All signup methods" },
          ...FILTERABLE_SIGNUP_METHODS.map((method) => ({ value: method, label: method })),
        ]}
      />
    </div>
  );
}
