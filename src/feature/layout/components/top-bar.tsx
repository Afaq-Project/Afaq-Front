"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/feature/dashboard/services/utils";
import { NotificationsDropdown } from "@/src/feature/notifications/components/NotificationsDropdown";
import {
  HOME_HREF,
  NAV_ITEMS,
  SHOW_GLOBAL_SEARCH,
  isNavActive,
  type ShellVariant,
} from "./shell-config";
import { TopBarSearch } from "./top-bar-search";
import { UserMenu } from "./user-menu";

/** Sticky white bar: logo, text nav (tablet and up), then search, bell and the user menu. */
export function TopBar({ variant }: { variant: ShellVariant }) {
  const pathname = usePathname();

  return (
    <header className="top-0 z-40 sticky bg-white px-4 md:px-6 xl:px-8 border-neutral-100 border-b">
      {/* 55/59px + the 1px border = a 56/60px bar. */}
      <div className="flex items-center gap-4 lg:gap-8 mx-auto w-full max-w-360 h-13.75 md:h-14.75">
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={HOME_HREF[variant]}
            className="flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
          >
            <Image src="/afaq.png" alt="" width={32} height={32} className="size-8" priority />
            <span className="text-h3 text-primary-800">Afaq</span>
          </Link>
          {variant === "admin" && (
            <span className="bg-neutral-50 px-2 py-0.5 rounded-full text-caption text-neutral-800">
              Admin
            </span>
          )}
        </div>

        <nav aria-label="Main" className="hidden md:flex self-stretch gap-4 lg:gap-6">
          {NAV_ITEMS[variant].map(({ href, label, badge, badgeLabel }) => {
            const active = isNavActive(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative flex items-center focus-visible:outline-none whitespace-nowrap transition-colors",
                  // The underline sits on the bar's bottom border.
                  "after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:content-['']",
                  active
                    ? "font-medium text-primary-600 after:bg-primary-600"
                    : "text-neutral-600 hover:text-neutral-900",
                )}
              >
                <span className="flex items-center gap-1.5 rounded-sm group-focus-visible:ring-2 group-focus-visible:ring-primary-400 group-focus-visible:ring-offset-2">
                  {label}
                  {badge ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="bg-warning-50 px-1.5 rounded-full min-w-5 text-caption text-warning-800 text-center"
                      >
                        {badge > 99 ? "99+" : badge}
                      </span>
                      <span className="sr-only">
                        , {badge} {badgeLabel}
                      </span>
                    </>
                  ) : null}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 md:gap-2 ml-auto">
          {SHOW_GLOBAL_SEARCH && <TopBarSearch />}
          <NotificationsDropdown />
          <UserMenu variant={variant} />
        </div>
      </div>
    </header>
  );
}
