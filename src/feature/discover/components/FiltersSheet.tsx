"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { buttonClasses } from "@/src/shared/ui/Button";

interface FiltersSheetProps {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  onClearAll: () => void;
  children: ReactNode;
}

/**
 * Bottom sheet holding every filter on small screens. Filters apply as they change; the footer
 * button just closes it. Escape or the backdrop closes it, and the caller returns focus.
 */
export function FiltersSheet({ open, onClose, resultCount, onClearAll, children }: FiltersSheetProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    // Keep the page behind the sheet from scrolling.
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="md:hidden z-50 fixed inset-0">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-neutral-900/40" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-sheet-title"
        tabIndex={-1}
        className="right-0 bottom-0 left-0 absolute flex flex-col bg-white pb-[env(safe-area-inset-bottom)] rounded-t-lg max-h-[85vh] focus:outline-none"
      >
        <div className="flex justify-between items-center px-4 py-3 border-neutral-100 border-b">
          <h2 id="filters-sheet-title" className="text-h3 text-neutral-900">
            Filters
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex justify-center items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 size-11 text-neutral-600"
          >
            <X size={20} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>
        <div className="flex flex-col gap-5 px-4 py-4 overflow-y-auto">{children}</div>
        <div className="flex items-center gap-3 px-4 py-3 border-neutral-100 border-t">
          <button
            type="button"
            onClick={onClearAll}
            className="rounded-sm min-h-11 font-medium text-neutral-600 text-small hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
          >
            Clear all
          </button>
          <button type="button" onClick={onClose} className={buttonClasses("primary", "flex-1")}>
            Show {resultCount} {resultCount === 1 ? "result" : "results"}
          </button>
        </div>
      </div>
    </div>
  );
}
