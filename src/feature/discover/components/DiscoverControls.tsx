"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronDown, Search, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { Popover } from "@/src/shared/ui/Popover";
import {
  DEADLINE_OPTIONS,
  DEFAULT_QUERY,
  QUICK_FILTER_OPTIONS,
  TYPE_OPTIONS,
  type DeadlineFilter,
  type DiscoverQuery,
  type DiscoverSupport,
} from "../types/filters";
import { activeFilterCount } from "../services/utils";
import { CheckboxList, RadioList } from "./FilterOptions";
import { FiltersSheet } from "./FiltersSheet";

const SEARCH_DEBOUNCE_MS = 200;

/** Filter buttons, the phone "Filters" button and the sort select share this look. */
export const CONTROL_BUTTON_CLASS =
  "inline-flex items-center gap-1.5 px-3 border rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 h-10 font-medium text-small transition-colors disabled:opacity-50";
const controlState = (active: boolean) =>
  active
    ? "bg-primary-50 border-primary-200 text-primary-800"
    : "bg-white border-neutral-200 hover:border-neutral-400 text-neutral-800";

interface DiscoverControlsProps {
  query: DiscoverQuery;
  update: (patch: Partial<DiscoverQuery>) => void;
  /** What the current endpoint can apply; unsupported controls are hidden. */
  support: DiscoverSupport;
  /** Disables every control (e.g. while loading). */
  disabled?: boolean;
  /** The sort control, at the end of the filter row. */
  sort?: ReactNode;
}

function FilterPopover({ label, count, children }: { label: string; count: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const active = count > 0;

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label={label}
      align="start"
      panelClassName="w-64"
      trigger={(triggerProps) => (
        <button type="button" {...triggerProps} className={cn(CONTROL_BUTTON_CLASS, controlState(active))}>
          {label}
          {active && <span>· {count}</span>}
          <ChevronDown
            size={16}
            strokeWidth={1.75}
            aria-hidden="true"
            className={active ? "text-primary-800" : "text-neutral-600"}
          />
        </button>
      )}
    >
      <div className="max-h-72 overflow-y-auto">{children}</div>
    </Popover>
  );
}

/**
 * Discover's controls card: search, then the type control with the filter buttons (a bottom
 * sheet on phones) and the sort, then chips for the active filters. Filters `support` doesn't allow are
 * hidden; search always shows, disabled when unsupported. Green marks only the selected type, active filters
 * and the focused search. Every change goes straight to the URL.
 */
export function DiscoverControls({ query, update, support, disabled = false, sort }: DiscoverControlsProps) {
  // Local copy so typing is instant; it follows the URL when that changes elsewhere (back/forward).
  const [input, setInput] = useState(query.q);
  const [syncedQ, setSyncedQ] = useState(query.q);
  if (query.q !== syncedQ) {
    setSyncedQ(query.q);
    setInput(query.q);
  }
  const searchTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(searchTimer.current), []);

  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetTrigger = useRef<HTMLButtonElement>(null);
  const closeSheet = () => {
    setSheetOpen(false);
    sheetTrigger.current?.focus();
  };

  const onSearch = (value: string) => {
    setInput(value);
    window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => update({ q: value }), SEARCH_DEBOUNCE_MS);
  };

  const clearFilters = () => update({ deadline: DEFAULT_QUERY.deadline, locations: [], fields: [], quick: [] });
  const filterCount = activeFilterCount(query);
  const deadlineLabel = DEADLINE_OPTIONS.find((option) => option.value === query.deadline)?.label;

  const deadlineList = (
    <RadioList<DeadlineFilter>
      legend="Deadline"
      name="deadline"
      options={DEADLINE_OPTIONS}
      value={query.deadline}
      onChange={(deadline) => update({ deadline })}
    />
  );
  const locationList = (
    <CheckboxList legend="Location" options={support.locations} selected={query.locations} onChange={(locations) => update({ locations })} />
  );
  const hasLocations = support.locations.length > 0;
  const hasFields = support.fields.length > 0;
  const hasFilters = support.deadline || hasLocations || hasFields;
  const fieldList = (
    <CheckboxList legend="Field of study" options={support.fields} selected={query.fields} onChange={(fields) => update({ fields })} />
  );

  const chips = [
    // Quick filters have no buttons anymore, but a shared link can still carry them.
    ...QUICK_FILTER_OPTIONS.filter((option) => query.quick.includes(option.value)).map((option) => ({
      key: `quick-${option.value}`,
      label: option.label,
      remove: () => update({ quick: query.quick.filter((q) => q !== option.value) }),
    })),
    ...(query.deadline !== "any"
      ? [{ key: "deadline", label: `Deadline: ${deadlineLabel}`, remove: () => update({ deadline: "any" }) }]
      : []),
    ...query.locations.map((location) => ({
      key: `location-${location}`,
      label: location,
      remove: () => update({ locations: query.locations.filter((l) => l !== location) }),
    })),
    ...query.fields.map((field) => ({
      key: `field-${field}`,
      label: field,
      remove: () => update({ fields: query.fields.filter((f) => f !== field) }),
    })),
  ];

  return (
    <fieldset disabled={disabled} className="flex flex-col gap-3 bg-white m-0 p-4 border border-neutral-100 rounded-lg min-w-0">
      <legend className="sr-only">Search and filter opportunities</legend>

      {/* Always shown; disabled until the API can search, so typing never looks like it failed. */}
      <label
        className={cn(
          "flex items-center gap-2 bg-white px-3 border border-neutral-200 rounded-sm h-10 transition-colors",
          support.search ? "focus-within:border-primary-600 focus-within:ring-2 focus-within:ring-primary-400" : "bg-neutral-50 cursor-not-allowed",
        )}
      >
        <Search
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
          className={cn("shrink-0", support.search ? "text-primary-600" : "text-neutral-400")}
        />
        <span className="sr-only">Search by title or provider</span>
        <input
          type="search"
          value={input}
          onChange={(event) => onSearch(event.target.value)}
          disabled={!support.search}
          placeholder={support.search ? "Search by title or provider" : "Search by title or provider (coming soon)"}
          className="flex-1 bg-transparent min-w-0 text-neutral-900 text-small placeholder:text-neutral-400 focus:outline-none disabled:cursor-not-allowed"
        />
      </label>

      {(support.type || hasFilters || sort) && (
        <div className="flex md:flex-row flex-col md:items-center gap-3">
          {support.type && (
            <div role="group" aria-label="Opportunity type" className="flex bg-neutral-50 p-1 rounded-md w-full md:w-auto">
              {TYPE_OPTIONS.map((option) => {
                const active = query.type === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => update({ type: option.value })}
                    className={cn(
                      "flex-1 md:flex-none px-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 h-9 md:h-8 text-small whitespace-nowrap transition-colors",
                      active ? "bg-primary-600 font-medium text-white" : "text-neutral-600 hover:text-neutral-900",
                    )}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Tablet and up: one popover per filter. */}
          <div className="hidden md:flex flex-wrap items-center gap-2">
            {support.deadline && (
              <FilterPopover label="Deadline" count={query.deadline !== "any" ? 1 : 0}>
                {deadlineList}
              </FilterPopover>
            )}
            {hasLocations && (
              <FilterPopover label="Location" count={query.locations.length}>
                {locationList}
              </FilterPopover>
            )}
            {hasFields && (
              <FilterPopover label="Field of study" count={query.fields.length}>
                {fieldList}
              </FilterPopover>
            )}
          </div>

          {/* Phones: one button for a bottom sheet with every filter. */}
          {hasFilters && (
            <button
              ref={sheetTrigger}
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-haspopup="dialog"
              className={cn(CONTROL_BUTTON_CLASS, controlState(filterCount > 0), "md:hidden justify-center h-11")}
            >
              <SlidersHorizontal size={16} strokeWidth={1.75} aria-hidden="true" />
              Filters
              {filterCount > 0 && <span>· {filterCount}</span>}
            </button>
          )}

          {sort && <div className="md:ms-auto">{sort}</div>}
        </div>
      )}

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <span
              key={chip.key}
              className="inline-flex items-center gap-1 bg-primary-50 py-0.5 pe-1 ps-2.5 border border-primary-200 rounded-full text-caption text-primary-800"
            >
              {chip.label}
              <button
                type="button"
                onClick={chip.remove}
                aria-label={`Remove filter: ${chip.label}`}
                className="after:absolute relative flex justify-center items-center hover:bg-primary-100 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 size-5 text-primary-800 after:-inset-3 after:content-['']"
              >
                <X size={12} strokeWidth={2} aria-hidden="true" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-sm min-h-11 md:min-h-0 font-medium text-neutral-600 text-small hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            Clear all
          </button>
        </div>
      )}

      <FiltersSheet open={sheetOpen} onClose={closeSheet} onClearAll={clearFilters}>
        {support.deadline && deadlineList}
        {hasLocations && locationList}
        {hasFields && fieldList}
      </FiltersSheet>
    </fieldset>
  );
}
