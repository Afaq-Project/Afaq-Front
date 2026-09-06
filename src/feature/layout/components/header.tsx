"use client";

import { useState } from "react";
import {
  Search,
  Bell,
  CircleUserRound,
  Settings,
  ChevronDown,
  User,
} from "lucide-react";
import Link from "next/link";
import Brand from "@/shared/ui/Brand";

const menuItems = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="flex justify-between items-center gap-4">
      <Brand />

      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 bg-white shadow-card pr-4 pl-4 rounded-md focus-within:ring-2 focus-within:ring-primary-400 focus-within:ring-offset-2 h-11 transition-shadow">
          <Search size={16} strokeWidth={1.75} />
          <input
            type="search"
            placeholder="Search"
            className="hidden sm:block bg-transparent focus:outline-none w-48 text-neutral-900 text-small placeholder:text-neutral-400"
          />
        </label>

        <div className="lg:hidden relative">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex justify-center items-center gap-2 bg-white hover:bg-primary-50 shadow-card pr-4 pl-4 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 h-11 font-medium text-neutral-800 text-small hover:text-primary-800 transition-colors"
          >
            <ChevronDown
              size={14}
              strokeWidth={1.75}
              className={`transition-transform ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>

          {isOpen && (
            <div className="top-full right-0 z-50 absolute bg-white shadow-card mt-2 p-2 border border-neutral-200 rounded-lg w-52 overflow-hidden">
              {menuItems.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 hover:bg-primary-50 px-3 py-2 rounded-md text-neutral-700 hover:text-primary-800 transition-colors"
                >
                  <Icon size={16} strokeWidth={1.75} />
                  <span className="text-small">{label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="hidden lg:flex justify-center items-center bg-white hover:bg-primary-50 shadow-card rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 w-11 h-11 text-neutral-400 hover:text-primary-800 transition-colors"
        >
          <Bell size={20} strokeWidth={1.75} />
        </button>

        <Link
          href="/profile"
          aria-label="Profile"
          title="Profile"
          className="hidden lg:flex justify-center items-center bg-white hover:bg-primary-50 shadow-card rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 w-11 h-11 text-neutral-400 hover:text-primary-800 transition-colors"
        >
          <CircleUserRound size={20} strokeWidth={1.75} />
        </Link>
      </div>
    </header>
  );
}
