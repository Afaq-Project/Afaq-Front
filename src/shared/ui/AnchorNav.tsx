"use client";

import type { MouseEvent } from "react";
import type { LucideIcon } from "lucide-react";
import { smoothScrollToHash } from "../lib/scroll";
import { useScrollSpy } from "../hooks/useScrollSpy";

export interface AnchorNavItem {
  id: string;
  label: string;
  icon?: LucideIcon;
}

/**
 * In-page section navigation: a sticky vertical list on desktop and a horizontal scrollable
 * chip row on mobile. The active item follows the scroll position.
 * Active style: primary text, medium weight, green-50 tint (not a solid fill).
 */
export function AnchorNav({ items, label }: { items: AnchorNavItem[]; label: string }) {
  const [activeId, setActiveId] = useScrollSpy(items.map((i) => i.id));

  const jumpTo = (event: MouseEvent, id: string) => {
    smoothScrollToHash(event, `#${id}`);
    setActiveId(id);
  };

  const linkClass = (active: boolean) =>
    `flex items-center gap-2 rounded-md text-body transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 ${
      active ? "bg-primary-50 font-medium text-primary-600" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
    }`;

  return (
    <>
      {/* Desktop: sticky vertical list */}
      <nav aria-label={label} className="sticky top-0 hidden w-52 shrink-0 self-start md:block">
        <ul className="flex flex-col gap-1">
          {items.map(({ id, label: itemLabel, icon: Icon }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={(e) => jumpTo(e, id)}
                aria-current={activeId === id ? "location" : undefined}
                className={`${linkClass(activeId === id)} px-3 py-2`}
              >
                {Icon && <Icon size={20} strokeWidth={1.75} aria-hidden="true" />}
                {itemLabel}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile: chip row pinned to the top while scrolling */}
      <nav aria-label={label} className="sticky top-0 z-10 -mx-4 bg-background px-4 py-2 md:hidden">
        <ul className="flex gap-2 overflow-x-auto">
          {items.map(({ id, label: itemLabel }) => (
            <li key={id} className="shrink-0">
              <a
                href={`#${id}`}
                onClick={(e) => jumpTo(e, id)}
                aria-current={activeId === id ? "location" : undefined}
                className={`${linkClass(activeId === id)} min-h-11 whitespace-nowrap rounded-full border border-neutral-100 bg-white px-4 ${
                  activeId === id ? "border-primary-100" : ""
                }`}
              >
                {itemLabel}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
