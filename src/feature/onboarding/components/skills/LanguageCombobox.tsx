"use client";

import { useRef, useState } from "react";
import { useClickOutside } from "@/src/shared/hooks/useClickOutside";
import { useLanguagesSearch } from "@/src/shared/lib/api/hooks/useReferenceData";
import { useDebounce } from "@/src/shared/lib/hooks/useDebounce";

interface LanguageComboboxProps {
  value: string;
  valueId?: string;
  onChange: (name: string, id: string) => void;
}

/** Searchable language picker. */
export function LanguageCombobox({ value, valueId, onChange }: LanguageComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(query, 300);
  const { data: results = [], isFetching } = useLanguagesSearch(debouncedQuery);

  useClickOutside(ref, () => {
    setOpen(false);
    setQuery("");
  });

  return (
    <div className="relative w-full sm:w-[45%]" ref={ref}>
      <div className="relative">
        <input
          type="text"
          value={open ? query : value}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => {
            setQuery("");
            setOpen(true);
          }}
          placeholder="Search language…"
          className="w-full bg-surface-container text-on-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors pr-8"
        />
        {isFetching ? (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none">
            expand_more
          </span>
        )}
      </div>

      {open && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 max-h-52 overflow-y-auto">
          {results.length === 0 && !isFetching ? (
            <div className="px-4 py-3 text-xs text-on-surface-variant text-center">No languages found</div>
          ) : (
            results.map((lang) => (
              <button
                key={lang.id}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(lang.nameEn, lang.id);
                  setOpen(false);
                  setQuery("");
                }}
                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-neutral-50 transition-colors cursor-pointer ${valueId === lang.id ? "text-primary font-semibold bg-primary/5" : "text-on-surface"}`}
              >
                {lang.nameEn}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
