"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  ClipboardList,
  Sparkles,
  FolderOpen,
  Settings,
  CircleUserRound,
  LayoutDashboard,
  LogOut,
  Loader2,
} from "lucide-react";
import { cn } from "../../dashboard/services/utils";
import { useAuth } from "@/src/shared/lib/auth/auth-context";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/applications", label: "Applications", icon: ClipboardList },
  { href: "/ai", label: "AI assistant", icon: Sparkles },
  { href: "/documents", label: "Documents", icon: FolderOpen },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  const isNavItemActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const renderNavItem = (href: string, label: string, Icon: any) => {
    const active = isNavItemActive(href);

    return (
      <Link
        key={href}
        href={href}
        aria-label={label}
        title={label}
        className={cn(
          "flex justify-center items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 transition-colors",
          active
            ? "bg-white text-neutral-900"
            : "text-neutral-400 hover:bg-neutral-800 hover:text-white",
          "w-11 h-11 md:w-11 md:h-11",
        )}
      >
        <Icon size={20} strokeWidth={1.75} />
      </Link>
    );
  };

  return (
    <>
      <aside className="hidden md:flex flex-col items-center rounded-lg z-20">
        <nav className="flex flex-col gap-2 bg-neutral-900 shadow-card p-2 rounded-lg">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) =>
            renderNavItem(href, label, Icon),
          )}
        </nav>

        <div className="flex flex-col gap-2 mt-auto">
          <Link
            href="/settings"
            aria-label="Settings"
            title="Settings"
            className="flex justify-center items-center bg-white hover:bg-primary-50 shadow-card rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 w-11 h-11 text-neutral-400 hover:text-primary-800 transition-colors"
          >
            <Settings size={20} strokeWidth={1.75} />
          </Link>
          <Link
            href="/profile"
            aria-label="Profile"
            title="Profile"
            className="flex justify-center items-center bg-white hover:bg-primary-50 shadow-card rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 w-11 h-11 text-neutral-400 hover:text-primary-800 transition-colors"
          >
            <CircleUserRound size={20} strokeWidth={1.75} />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            aria-label="Logout"
            title="Logout"
            className="flex justify-center items-center bg-white hover:bg-danger-50 disabled:opacity-50 shadow-card rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 disabled:pointer-events-none w-11 h-11 text-neutral-400 hover:text-danger-800 transition-colors"
          >
            {isLoggingOut ? (
              <Loader2 size={20} strokeWidth={1.75} className="animate-spin" />
            ) : (
              <LogOut size={20} strokeWidth={1.75} />
            )}
          </button>
        </div>
      </aside>

      <nav className="md:hidden right-3 bottom-3 left-3 z-50 fixed flex justify-between items-center gap-2 shadow-card backdrop-blur-sm p-2 border border-neutral-200 rounded-full">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isNavItemActive(href);

          return (
            <Link
              key={href}
              href={href}
              aria-label={label}
              title={label}
              className={cn(
                "flex flex-1 justify-center items-center rounded-full h-11 transition-colors",
                active
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-500 hover:bg-primary-50 hover:text-primary-800",
              )}
            >
              <Icon size={18} strokeWidth={1.75} />
            </Link>
          );
        })}
      </nav>
    </>
  );
}
