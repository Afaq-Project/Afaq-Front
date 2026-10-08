"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Search } from "lucide-react";
import { ICON_BUTTON_CLASS } from "./shell-config";

const FIELD_CLASS =
  "flex items-center gap-2 bg-white px-3 border border-neutral-200 rounded-sm focus-within:ring-2 focus-within:ring-primary-400 focus-within:ring-offset-2 h-10 text-neutral-600";
const INPUT_CLASS =
  "flex-1 bg-transparent min-w-0 focus:outline-none text-neutral-900 text-small placeholder:text-neutral-400";

/**
 * Compact search input on desktop; below 1024px an icon button that opens a full-width row
 * under the bar. Not wired to anything yet, so the shell hides it behind SHOW_GLOBAL_SEARCH.
 */
export function TopBarSearch() {
  const [open, setOpen] = useState(false);
  const rowId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  return (
    <>
      <label className={`hidden lg:flex w-64 ${FIELD_CLASS}`}>
        <Search size={16} strokeWidth={1.75} aria-hidden="true" />
        <span className="sr-only">Search opportunities</span>
        <input type="search" placeholder="Search opportunities" className={INPUT_CLASS} />
      </label>

      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Search opportunities"
        aria-expanded={open}
        aria-controls={rowId}
        className={`lg:hidden ${ICON_BUTTON_CLASS}`}
      >
        <Search size={20} strokeWidth={1.75} aria-hidden="true" />
      </button>

      {open && (
        // Positioned against the sticky header, so it spans the full bar width.
        <div
          id={rowId}
          className="lg:hidden top-full absolute inset-x-0 bg-white px-4 md:px-6 xl:px-8 py-3 border-neutral-100 border-b"
        >
          <label className={FIELD_CLASS}>
            <Search size={16} strokeWidth={1.75} aria-hidden="true" />
            <span className="sr-only">Search opportunities</span>
            <input
              ref={inputRef}
              type="search"
              placeholder="Search opportunities"
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  setOpen(false);
                  buttonRef.current?.focus();
                }
              }}
              className={INPUT_CLASS}
            />
          </label>
        </div>
      )}
    </>
  );
}
