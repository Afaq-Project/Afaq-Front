"use client";

import { cn } from "@/src/feature/dashboard/services/utils";
import { useScrollSpy } from "@/src/shared/hooks/useScrollSpy";
import { smoothScrollToHash } from "@/src/shared/lib/scroll";
import { useTranslations } from "next-intl";

export interface SettingsNavItem {
  id: string;
  label: string;
}

/** Sticky list of the page's sections (1024px and up). The active item follows the scroll; a click smooth-scrolls. */
export function SettingsNav({ items }: { items: SettingsNavItem[] }) {
  const t = useTranslations("settings");
  const [activeId, setActiveId] = useScrollSpy(items.map((item) => item.id));

  return (
    <nav aria-label={t("nav")} className="hidden lg:block top-21 sticky self-start">
      <ul className="flex flex-col gap-1">
        {items.map(({ id, label }) => {
          const active = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(event) => {
                  smoothScrollToHash(event, `#${id}`);
                  setActiveId(id);
                }}
                aria-current={active ? "location" : undefined}
                className={cn(
                  "flex items-center px-3 rounded-md min-h-10 text-body transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                  active
                    ? "bg-primary-50 font-medium text-primary-800"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
                )}
              >
                {label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
