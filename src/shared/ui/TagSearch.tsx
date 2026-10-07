"use client";

import React, { useEffect, useRef, useState } from "react";

export interface TagSearchProps<T extends { id: string; name: string }> {
  label: string;
  hint?: string;
  placeholder?: string;
  selectedIds: string[];
  selectedNames: string[];
  items: T[];
  isFetching?: boolean;
  onSearch: (q: string) => void;
  onSelect: (item: T) => void;
  onRemove: (id: string) => void;
  maxItems?: number;
  minSearchLength?: number;
}

/** Multi-select: a search input with a results dropdown, and the selection shown as removable tags. */
export function TagSearch<T extends { id: string; name: string }>({
  label,
  hint,
  placeholder,
  selectedIds,
  selectedNames,
  items,
  isFetching,
  onSearch,
  onSelect,
  onRemove,
  maxItems = 5,
  minSearchLength = 1,
}: TagSearchProps<T>) {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const onSearchRef = useRef(onSearch);
  useEffect(() => {
    onSearchRef.current = onSearch;
  });

  const isAtMax = selectedIds.length >= maxItems;

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setInputValue("");
        onSearchRef.current("");
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showDropdown = open && inputValue.length >= minSearchLength;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onSearch(val);
    setOpen(true);
  };

  const handleSelect = (item: T) => {
    if (selectedIds.includes(item.id)) {
      onRemove(item.id);
    } else {
      if (isAtMax) return;
      onSelect(item);
    }
    setInputValue("");
    onSearch("");
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-2" ref={containerRef}>
      <div className="flex justify-between items-center">
        <label className="font-medium text-on-surface text-sm">
          {label}
          {hint && (
            <span className="ml-1 text-outline font-normal text-xs">
              ({hint})
            </span>
          )}
        </label>
        <span
          className={`text-xs font-medium ${selectedIds.length >= maxItems ? "text-warning font-semibold" : "text-on-surface-variant"}`}
        >
          {selectedIds.length} of {maxItems}
        </span>
      </div>

      <div className="relative">
        <span className="top-1/2 left-3.5 absolute text-[18px] text-on-surface-variant -translate-y-1/2 pointer-events-none material-symbols-outlined">
          search
        </span>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => {
            if (inputValue.length >= minSearchLength) setOpen(true);
          }}
          placeholder={
            isAtMax
              ? `Max ${maxItems} selected`
              : (placeholder ?? `Search ${label.toLowerCase()}…`)
          }
          disabled={isAtMax}
          className={`w-full pl-10 pr-10 py-3 border border-outline-variant rounded-lg bg-white text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-on-surface-variant ${
            isAtMax ? "opacity-50 cursor-not-allowed bg-neutral-50" : ""
          }`}
        />
        {isFetching ? (
          <div className="top-1/2 right-3.5 absolute border-2 border-primary border-t-transparent rounded-full w-4 h-4 -translate-y-1/2 animate-spin" />
        ) : inputValue ? (
          <button
            type="button"
            onClick={() => {
              setInputValue("");
              onSearch("");
            }}
            className="top-1/2 right-3.5 absolute text-on-surface-variant hover:text-on-surface -translate-y-1/2"
          >
            <span className="text-[18px] material-symbols-outlined">close</span>
          </button>
        ) : null}

        {showDropdown && (
          <div className="top-full left-0 z-50 absolute bg-white shadow-xl mt-1.5 border border-neutral-200 rounded-lg w-full max-h-64 overflow-y-auto">
            {isFetching ? (
              <div className="p-3 text-on-surface-variant text-xs text-center">
                Searching…
              </div>
            ) : items.length === 0 ? (
              <div className="p-3 text-on-surface-variant text-xs text-center">
                No results found
              </div>
            ) : (
              items.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const isDisabled = !isSelected && isAtMax;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => !isDisabled && handleSelect(item)}
                    className={`w-full text-left px-4 py-2.5 transition-colors text-sm flex items-center justify-between ${
                      isDisabled
                        ? "opacity-40 cursor-not-allowed"
                        : isSelected
                          ? "text-primary font-semibold bg-primary/5 hover:bg-primary/10 cursor-pointer"
                          : "text-on-surface hover:bg-neutral-50 cursor-pointer"
                    }`}
                  >
                    <span>{item.name}</span>
                    {isSelected && (
                      <span className="text-primary text-sm material-symbols-outlined">
                        check
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      {selectedNames.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(expanded ? selectedNames : selectedNames.slice(0, 1)).map(
            (name, i) => (
              <div
                key={selectedIds[i]}
                className="inline-flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full font-medium text-primary text-sm"
              >
                <span>{name}</span>
                <button
                  type="button"
                  onClick={() => onRemove(selectedIds[i])}
                  className="flex items-center hover:opacity-70"
                >
                  <span className="text-[15px] material-symbols-outlined">
                    close
                  </span>
                </button>
              </div>
            ),
          )}
          {!expanded && selectedNames.length > 1 && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="inline-flex items-center bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full font-medium text-primary text-sm transition-colors"
            >
              +{selectedNames.length - 1}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
