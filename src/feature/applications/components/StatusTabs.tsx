import { cn } from "@/src/feature/dashboard/services/utils";
import { STATUS_TABS, type StatusTab } from "../types/filters";

function badgeClass(selected: boolean, count: number) {
  if (selected) return "bg-primary-50 text-primary-800";
  if (count === 0) return "bg-neutral-50 text-neutral-400";
  return "bg-neutral-100 text-neutral-600";
}

/**
 * Status tabs that double as the status filter: label + count badge, 24px apart, 40px tall.
 * The active tab is green-600 with a 2px underline spanning label and badge. The row scrolls
 * sideways when it doesn't fit, within the page margins.
 */
export function StatusTabs({
  active,
  counts,
  onChange,
}: {
  active: StatusTab;
  counts: Record<StatusTab, number>;
  onChange: (tab: StatusTab) => void;
}) {
  return (
    <div role="group" aria-label="Filter by status" className="flex gap-6 overflow-x-auto">
      {STATUS_TABS.map((tab) => {
        const selected = tab.value === active;
        const count = counts[tab.value];
        return (
          <button
            key={tab.value}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(tab.value)}
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
                badgeClass(selected, count),
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
