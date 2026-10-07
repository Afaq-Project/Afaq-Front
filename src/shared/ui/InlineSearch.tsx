"use client";

import React, { useState, useRef, useEffect, useId } from "react";

export interface InlineSearchProps<T extends { id: string; name: string }> {
  label: string;
  hint?: string;
  selectedName?: string;
  placeholder?: string;
  items: T[];
  isFetching?: boolean;
  onSearch: (q: string) => void;
  onSelect: (item: T) => void;
  onClear?: () => void;
  disabled?: boolean;
  filterLocally?: boolean;
  minSearchLength?: number;
  required?: boolean;
  /** Input id; generated when omitted. Links the label and lets callers focus the field. */
  id?: string;
}

export function InlineSearch<T extends { id: string; name: string }>({
  label,
  hint,
  selectedName,
  placeholder,
  items,
  isFetching,
  onSearch,
  onSelect,
  onClear,
  disabled,
  filterLocally = false,
  minSearchLength = 1,
  required,
  id,
}: InlineSearchProps<T>) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [inputValue, setInputValue] = useState(selectedName ?? "");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSearchRef = useRef(onSearch);
  useEffect(() => { onSearchRef.current = onSearch; });

  // When the selection changes from outside (picked, cleared, form reset), show its name.
  // Adjusted during render rather than in an effect, so there's no extra render pass.
  const [prevSelectedName, setPrevSelectedName] = useState(selectedName);
  if (selectedName !== prevSelectedName) {
    setPrevSelectedName(selectedName);
    setInputValue(selectedName ?? "");
  }

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setInputValue(selectedName ?? "");
        onSearchRef.current("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [selectedName]);

  const displayItems = filterLocally
    ? items.filter(
        (i) =>
          inputValue.length >= minSearchLength &&
          (i.name ?? "").toLowerCase().includes(inputValue.toLowerCase()),
      )
    : items;

  const showDropdown = open && inputValue.length >= minSearchLength;

  return (
    <div className="flex flex-col gap-2 relative" ref={containerRef}>
      <label htmlFor={inputId} className="text-sm font-medium text-on-surface">
        {label}
        {required && <span className="text-error ml-0.5">*</span>}
        {hint && <span className="text-xs font-normal text-outline ml-1">({hint})</span>}
      </label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
          search
        </span>
        <input
          id={inputId}
          type="text"
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value;
            setInputValue(val);
            onSearch(val);
            setOpen(true);
            if (!val) onClear?.();
          }}
          onFocus={() => {
            if (inputValue.length >= minSearchLength) setOpen(true);
          }}
          placeholder={placeholder ?? `Search ${label.toLowerCase()}…`}
          disabled={disabled}
          className={`w-full pl-10 pr-10 py-3 border border-outline-variant rounded-lg bg-white text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant ${
            disabled ? "opacity-50 cursor-not-allowed bg-neutral-50" : ""
          }`}
        />
        {isFetching ? (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : (
          inputValue && !disabled && (
            <button
              type="button"
              onClick={() => {
                setInputValue("");
                onSearch("");
                onClear?.();
                setOpen(false);
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )
        )}
      </div>

      {showDropdown && (
        <div className="absolute top-full left-0 w-full mt-1.5 bg-white border border-neutral-200 rounded-lg shadow-xl z-50 max-h-64 overflow-y-auto">
          {isFetching ? (
            <div className="p-3 text-center text-xs text-on-surface-variant">Searching…</div>
          ) : displayItems.length === 0 ? (
            <div className="p-3 text-center text-xs text-on-surface-variant">No results found</div>
          ) : (
            displayItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setInputValue(item.name);
                  onSelect(item);
                  setOpen(false);
                  onSearch("");
                }}
                className={`w-full text-left px-4 py-2.5 hover:bg-neutral-50 transition-colors text-sm flex items-center justify-between cursor-pointer ${
                  selectedName === item.name
                    ? "text-primary font-semibold bg-primary/5"
                    : "text-on-surface"
                }`}
              >
                <span>{item.name}</span>
                {selectedName === item.name && (
                  <span className="material-symbols-outlined text-primary text-sm">check</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
