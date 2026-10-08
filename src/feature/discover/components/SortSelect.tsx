import { ChevronDown } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { SORT_OPTIONS, type SortOrder } from "../types/filters";
import { CONTROL_BUTTON_CLASS } from "./DiscoverControls";

/**
 * Sort dropdown, styled like the filter buttons: a native select with the browser styling
 * removed and a custom chevron. "Newest" is listed but disabled until opportunities have a
 * published date.
 */
export function SortSelect({
  value,
  onChange,
  newestAvailable,
  className,
}: {
  value: SortOrder;
  onChange: (sort: SortOrder) => void;
  newestAvailable: boolean;
  className?: string;
}) {
  return (
    <label className={cn("flex items-center gap-2 text-neutral-600 text-small", className)}>
      <span className="sm:not-sr-only sr-only">Sort by</span>
      <span className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as SortOrder)}
          className={cn(
            CONTROL_BUTTON_CLASS,
            "appearance-none bg-white pr-9 border-neutral-200 hover:border-neutral-400 text-neutral-800 cursor-pointer",
          )}
        >
          {SORT_OPTIONS.map((option) => {
            const unavailable = option.value === "newest" && !newestAvailable;
            return (
              <option
                key={option.value}
                value={option.value}
                disabled={unavailable}
                title={unavailable ? "Not available yet: opportunities don't have a published date" : undefined}
              >
                {option.label}
              </option>
            );
          })}
        </select>
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
          className="top-1/2 right-3 absolute text-neutral-600 -translate-y-1/2 pointer-events-none"
        />
      </span>
    </label>
  );
}
