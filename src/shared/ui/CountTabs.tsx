import { cn } from "@/src/feature/dashboard/services/utils";

function badgeClass(selected: boolean, count: number) {
  if (selected) return "bg-primary-50 text-primary-800";
  if (count === 0) return "bg-neutral-50 text-neutral-400";
  return "bg-neutral-100 text-neutral-600";
}

/**
 * Filter tabs with a count badge each: label + badge, 24px apart, 40px tall. The active tab is
 * green-600 with a 2px underline spanning label and badge. Scrolls sideways when it doesn't fit.
 */
export function CountTabs<T extends string>({
  label,
  tabs,
  active,
  onChange,
}: {
  /** Accessible name of the group, e.g. "Filter by status". */
  label: string;
  tabs: { value: T; label: string; count: number }[];
  active: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex gap-6 overflow-x-auto">
      {tabs.map((tab) => {
        const selected = tab.value === active;
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
