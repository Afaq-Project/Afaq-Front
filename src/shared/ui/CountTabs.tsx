"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";

function badgeClass(selected: boolean, count: number) {
  if (selected) return "bg-primary-50 text-primary-800";
  if (count === 0) return "bg-neutral-50 text-neutral-400";
  return "bg-neutral-100 text-neutral-600";
}

/**
 * Filter tabs with a count badge each: label + badge, 24px apart, 40px tall. The active tab is
 * green-600 with a 2px underline spanning label and badge. Scrolls sideways when it doesn't fit.
 *
 * By default they're toggle buttons filtering a list. With `panelId` they're a tablist instead:
 * tab roles, arrow keys move between tabs, and each tab controls that panel.
 */
export function CountTabs<T extends string>({
  label,
  tabs,
  active,
  onChange,
  panelId,
}: {
  /** Accessible name of the group, e.g. "Filter by status". */
  label: string;
  tabs: { value: T; label: string; count: number }[];
  active: T;
  onChange: (value: T) => void;
  /** The id of the element the tabs switch; turns on tab semantics. */
  panelId?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const asTabs = panelId !== undefined;

  function handleKeyDown(event: KeyboardEvent, index: number) {
    if (!asTabs) return;
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = (index + step + tabs.length) % tabs.length;
    onChange(tabs[next].value);
    refs.current[next]?.focus();
  }

  return (
    <div role={asTabs ? "tablist" : "group"} aria-label={label} className="flex gap-6 overflow-x-auto">
      {tabs.map((tab, index) => {
        const selected = tab.value === active;
        return (
          <button
            key={tab.value}
            ref={(node) => {
              refs.current[index] = node;
            }}
            type="button"
            {...(asTabs
              ? { role: "tab", "aria-selected": selected, "aria-controls": panelId, tabIndex: selected ? 0 : -1 }
              : { "aria-pressed": selected })}
            onClick={() => onChange(tab.value)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={cn(
              "relative flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-inset h-10 text-small whitespace-nowrap transition-colors shrink-0",
              "after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:content-['']",
              selected ? "font-medium text-primary-600 after:bg-primary-600" : "text-neutral-600 hover:text-neutral-900",
            )}
          >
            {tab.label}
            <span
              className={cn(
                "flex justify-center items-center px-1.5 rounded-full min-w-5 h-5 font-medium text-caption",
                badgeClass(selected, tab.count),
              )}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
