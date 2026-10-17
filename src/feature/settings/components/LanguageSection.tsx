"use client";

import { useId } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { SettingsRow, SettingsSection } from "./SettingsSection";

const LANGUAGES = [
  { code: "en", label: "English", dir: "ltr" },
  { code: "ar", label: "عربي", dir: "rtl" },
] as const;

// TODO: wire to i18n once the app has translations (there is no i18n setup yet). Until then
// the control shows English, can't be changed, and says Arabic is coming soon.
const CURRENT = "en";

export function LanguageSection() {
  const tooltipId = useId();

  return (
    <SettingsSection id="language" title="Language">
      <SettingsRow label="Display language" help="The language Afaq uses for menus and messages.">
        {/* aria-disabled rather than disabled, so the options stay focusable and the tooltip reachable by keyboard. */}
        <div className="group/tip relative flex">
          <div
            role="radiogroup"
            aria-label="Language"
            aria-disabled="true"
            aria-describedby={tooltipId}
            className="flex gap-1 bg-neutral-50 p-1 border border-neutral-100 rounded-md w-full md:w-auto"
          >
            {LANGUAGES.map(({ code, label, dir }) => {
              const selected = code === CURRENT;
              return (
                <button
                  key={code}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  aria-disabled="true"
                  tabIndex={selected ? 0 : -1}
                  lang={code}
                  dir={dir}
                  className={cn(
                    "flex-1 md:flex-none px-4 rounded-sm min-w-20 min-h-11 md:min-h-9 text-small cursor-not-allowed",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
                    selected ? "bg-white shadow-sm font-medium text-neutral-900" : "text-neutral-600",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <span
            role="tooltip"
            id={tooltipId}
            className="bottom-full left-1/2 z-20 absolute bg-neutral-900 opacity-0 group-focus-within/tip:opacity-100 group-hover/tip:opacity-100 mb-1 px-2 py-1 rounded-sm text-caption text-white whitespace-nowrap transition-opacity -translate-x-1/2 pointer-events-none"
          >
            Coming soon
          </span>
        </div>
      </SettingsRow>
    </SettingsSection>
  );
}
