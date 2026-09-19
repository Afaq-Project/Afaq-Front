"use client";

import { useRef, useState } from "react";
import {
  Search,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Loader2,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import Brand from "@/src/shared/ui/Brand";
import { Avatar } from "@/src/shared/ui/Avatar";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { useClickOutside } from "@/src/shared/hooks/useClickOutside";

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  useClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <header className="flex items-center gap-4">
      <Brand />

      <div className="hidden lg:flex flex-1 justify-center items-center min-w-0">
        <div className="inline-flex items-center gap-2.5 bg-white shadow-card p-1.5 border border-neutral-100 rounded-full max-w-xl h-13">
          <span className="relative flex justify-center items-center bg-linear-to-br from-primary-600 to-primary-800 rounded-full w-10 h-10 text-white shrink-0">
            <CalendarDays size={16} strokeWidth={2} />
            <span className="top-0 right-0 absolute bg-danger-600 border-2 border-white rounded-full w-3 h-3">
              <span className="absolute inset-0 bg-danger-600 rounded-full animate-ping" />
            </span>
          </span>
          <p className="min-w-0 font-medium text-neutral-700 text-small truncate">
            <span className="text-neutral-400">Free workshop:</span> Preparing
            your scholarship application
          </p>
          <span className="flex items-center gap-1 bg-primary-50 px-3.5 rounded-full h-9 font-semibold text-primary-700 text-caption whitespace-nowrap shrink-0">
            Learn more
            <ArrowRight size={12} strokeWidth={2.5} />
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-3 ml-auto lg:ml-0">
        <label className="flex items-center gap-2 bg-white shadow-card pr-4 pl-4 rounded-md focus-within:ring-2 focus-within:ring-primary-400 focus-within:ring-offset-2 h-11 transition-shadow">
          <Search size={16} strokeWidth={1.75} />
          <input
            type="search"
            placeholder="Search"
            className="hidden sm:block bg-transparent focus:outline-none w-48 text-neutral-900 text-small placeholder:text-neutral-400"
          />
        </label>

        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="hidden lg:flex justify-center items-center bg-white hover:bg-primary-50 shadow-card rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 w-11 h-11 text-neutral-400 hover:text-primary-800 transition-colors"
        >
          <Bell size={20} strokeWidth={1.75} />
        </button>

        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            aria-label="Account menu"
            className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 shadow-card pr-3 pl-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 h-11 font-medium text-neutral-300 text-small hover:text-white transition-colors"
          >
            <Avatar
              name={user ? `${user.firstName} ${user.lastName}` : "?"}
              className="w-8 h-8 text-xs"
            />
            <span className="hidden lg:block max-w-28 truncate">
              {user?.firstName ?? "Account"}
            </span>
            <ChevronDown
              size={14}
              strokeWidth={1.75}
              className={`text-neutral-500 transition-transform ${
                isUserMenuOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {isUserMenuOpen && (
            <div className="top-full right-0 z-50 absolute bg-white shadow-card mt-2 p-2 border border-neutral-200 rounded-lg w-48 overflow-hidden">
              <Link
                href="/profile"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-3 hover:bg-primary-50 px-3 py-2 rounded-md text-neutral-700 hover:text-primary-800 transition-colors"
              >
                <User size={16} strokeWidth={1.75} />
                <span className="text-small">Profile</span>
              </Link>
              <Link
                href="/notifications"
                onClick={() => setIsUserMenuOpen(false)}
                className="lg:hidden flex items-center gap-3 hover:bg-primary-50 px-3 py-2 rounded-md text-neutral-700 hover:text-primary-800 transition-colors"
              >
                <Bell size={16} strokeWidth={1.75} />
                <span className="text-small">Notifications</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center gap-3 hover:bg-danger-50 disabled:opacity-50 px-3 py-2 rounded-md w-full text-neutral-700 text-small hover:text-danger-800 text-left transition-colors disabled:pointer-events-none"
              >
                {isLoggingOut ? (
                  <Loader2
                    size={16}
                    strokeWidth={1.75}
                    className="animate-spin"
                  />
                ) : (
                  <LogOut size={16} strokeWidth={1.75} />
                )}
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
