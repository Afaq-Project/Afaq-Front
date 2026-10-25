import { ChevronDown } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { SORT_OPTIONS, type SortOrder } from "../types/filters";
import { CONTROL_BUTTON_CLASS } from "./DiscoverControls";
import { useTranslations } from "next-intl";

/**
 * Sort dropdown, styled like the filter buttons: a native select with the browser styling
 * removed and a custom chevron. Lists only the sorts the current results can use.
 */
export function SortSelect({
  value,
  onChange,
  options,
  className,
}: {
  value: SortOrder;
  onChange: (sort: SortOrder) => void;
  options: SortOrder[];
  className?: string;
}) {
  const t = useTranslations("discover");
  return (
    <label className={cn("flex items-center gap-2 text-neutral-600 text-small", className)}>
      <span className="sm:not-sr-only sr-only">{t("sortBy")}</span>
      <span className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value as SortOrder)}
          className={cn(
            CONTROL_BUTTON_CLASS,
            "appearance-none bg-white pe-9 border-neutral-200 hover:border-neutral-400 text-neutral-800 cursor-pointer",
          )}
        >
          {SORT_OPTIONS.filter((option) => options.includes(option.value)).map((option) => (
            <option key={option.value} value={option.value}>
              {t(`sorts.${option.value}`)}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
          className="top-1/2 end-3 absolute text-neutral-600 -translate-y-1/2 pointer-events-none"
        />
      </span>
    </label>
  );
}
