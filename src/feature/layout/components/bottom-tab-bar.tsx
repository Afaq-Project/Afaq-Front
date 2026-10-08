"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/feature/dashboard/services/utils";
import { NAV_ITEMS, isNavActive, type ShellVariant } from "./shell-config";

/** Fixed bottom navigation below 768px; the top bar's text nav takes over from there. */
export function BottomTabBar({ variant }: { variant: ShellVariant }) {
  const pathname = usePathname();
  const items = NAV_ITEMS[variant].filter((item) => !item.menuOnMobile);

  return (
    <nav
      aria-label="Main"
      className="md:hidden bottom-0 z-40 fixed inset-x-0 bg-white pb-[env(safe-area-inset-bottom)] border-neutral-100 border-t"
    >
      <ul className="flex h-16">
        {items.map(({ href, label, icon: Icon, badge, badgeLabel }) => {
          const active = isNavActive(pathname, href);

          return (
            <li key={href} className="flex-1 min-w-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col justify-center items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-400 h-full text-caption transition-colors",
                  active ? "text-primary-600" : "text-neutral-600",
                )}
              >
                <span className="relative">
                  <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                  {badge ? (
                    <span
                      aria-hidden="true"
                      className="-top-1.5 left-3 absolute bg-warning-50 px-1 rounded-full min-w-4 text-[10px] text-warning-800 text-center leading-4"
                    >
                      {badge > 99 ? "99+" : badge}
                    </span>
                  ) : null}
                </span>
                <span className="max-w-full truncate">{label}</span>
                {badge ? (
                  <span className="sr-only">
                    , {badge} {badgeLabel}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
