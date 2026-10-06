"use client";

import { useRef, useState } from "react";
import { useClickOutside } from "@/src/shared/hooks/useClickOutside";
import { useMajorOptions } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import type { Option } from "../../types";
import { FieldLabel } from "../common/FieldLabel";

interface MajorMultiSelectProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  max: number;
  selected: Option[];
  onChange: (selected: Option[]) => void;
}

/** Search majors and pick up to `max`; picks show as chips, collapsed to the first one. */
export function MajorMultiSelect({ label, required, optional, max, selected, onChange }: MajorMultiSelectProps) {
  const majors = useMajorOptions();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setOpen(false));

  const isAtMax = selected.length >= max;
  const isSelected = (option: Option) => selected.some((s) => s.id === option.id);

  const toggle = (option: Option) => {
    if (isSelected(option)) {
      onChange(selected.filter((s) => s.id !== option.id));
    } else if (!isAtMax) {
      onChange([...selected, option]);
    }
  };

  const clearSearch = () => {
    majors.setQuery("");
    setOpen(false);
  };

  const visible = expanded ? selected : selected.slice(0, 1);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <FieldLabel required={required} optional={optional}>{label}</FieldLabel>
        <span className={`text-sm font-medium ${isAtMax ? "text-warning font-semibold" : "text-on-surface-variant"}`}>
          {selected.length} of {max}
        </span>
      </div>

      <div className="relative" ref={containerRef}>
        <span className="top-1/2 left-3.5 absolute text-on-surface-variant -translate-y-1/2 pointer-events-none material-symbols-outlined">
          search
        </span>
        <input
          type="text"
          value={majors.query}
          onChange={(e) => {
            majors.setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Type to search fields of study…"
          className="bg-white py-3 pr-10 pl-11 border focus:border-primary rounded-lg border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/30 w-full text-on-surface placeholder:text-on-surface-variant text-sm transition-all"
        />
        {majors.isFetching && (
          <div className="top-1/2 right-3.5 absolute border-2 border-primary border-t-transparent rounded-full w-4 h-4 -translate-y-1/2 animate-spin" />
        )}
        {majors.query && !majors.isFetching && (
          <button
            type="button"
            onClick={clearSearch}
            aria-label="Clear search"
            className="top-1/2 right-3.5 absolute text-on-surface-variant hover:text-on-surface -translate-y-1/2"
          >
            <span className="text-[18px] material-symbols-outlined">close</span>
          </button>
        )}

        {open && majors.debouncedQuery.trim().length >= 2 && (
          <div className="top-full left-0 z-50 absolute bg-white shadow-xl mt-1.5 border border-neutral-200 rounded-lg w-full max-h-64 overflow-y-auto">
            {majors.options.length === 0 && !majors.isFetching ? (
              <div className="p-4 text-on-surface-variant text-sm text-center">
                No fields found for &ldquo;{majors.debouncedQuery}&rdquo;
              </div>
            ) : (
              majors.options.map((major) => {
                const checked = isSelected(major);
                const disabled = !checked && isAtMax;
                return (
                  <label
                    key={major.id}
                    className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-neutral-50"}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      disabled={disabled}
                      onChange={() => toggle(major)}
                      className="rounded border-outline-variant focus:ring-primary w-4 h-4 text-primary cursor-pointer disabled:cursor-not-allowed shrink-0"
                    />
                    <span className={`text-sm ${checked ? "font-semibold text-primary" : "text-on-surface"}`}>
                      {major.name}
                    </span>
                  </label>
                );
              })
            )}
          </div>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {visible.map((option) => (
            <div
              key={option.id}
              className="inline-flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full font-medium text-primary text-sm"
            >
              <span>{option.name}</span>
              <button
                type="button"
                onClick={() => toggle(option)}
                aria-label={`Remove ${option.name}`}
                className="flex items-center hover:opacity-70"
              >
                <span className="text-[15px] material-symbols-outlined">close</span>
              </button>
            </div>
          ))}
          {!expanded && selected.length > 1 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full font-medium text-primary text-sm transition-colors"
            >
              +{selected.length - 1}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
