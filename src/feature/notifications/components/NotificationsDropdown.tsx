"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

import { useClickOutside } from "@/src/shared/hooks/useClickOutside";
import { cn } from "@/src/feature/dashboard/services/utils";
import { NOTIFICATIONS } from "../mocks/notifications";
import { CATEGORY_META } from "../services/utils";

const PREVIEW_LIMIT = 5;

const ICON_TONE_CLASSES: Record<"amber" | "blue", string> = {
  amber: "bg-warning-50 text-warning-600",
  blue: "bg-info-50 text-info-600",
};

export function NotificationsDropdown({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isActive =
    pathname === "/notifications" || pathname.startsWith("/notifications/");

  useClickOutside(containerRef, () => setIsOpen(false));

  const items = NOTIFICATIONS.slice(0, PREVIEW_LIMIT);
  const unreadCount = NOTIFICATIONS.filter(
    (notification) => notification.unread,
  ).length;

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifications"
        aria-haspopup="true"
        aria-expanded={isOpen}
        title="Notifications"
        className={cn(
          "relative flex justify-center items-center shadow-card rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 w-11 h-11 transition-colors",
          isActive
            ? "bg-neutral-900 text-white"
            : "bg-neutral-900  text-neutral-400 hover:bg-primary-50 hover:text-primary-800",
        )}
      >
        <Bell size={20} strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="-top-1 -right-1 absolute flex justify-center items-center bg-danger-600 shadow-sm px-1 border-2 border-white rounded-full min-w-4.5 h-4.5 font-semibold text-[10px] text-white leading-none">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="top-full right-0 z-50 absolute bg-white shadow-card mt-2 border border-neutral-200 rounded-lg w-80 sm:w-96 overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 border-neutral-100 border-b">
            <p className="font-semibold text-neutral-900 text-small">
              Notifications
            </p>
            {unreadCount > 0 && (
              <span className="bg-primary-50 px-2 py-0.5 rounded-full font-medium text-caption text-primary-800">
                {unreadCount} unread
              </span>
            )}
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-8 text-neutral-500 text-small text-center">
              You&apos;re all caught up
            </p>
          ) : (
            <ul className="flex flex-col divide-y divide-neutral-100 max-h-96 overflow-y-auto">
              {items.map((notification) => {
                const Icon = CATEGORY_META[notification.category].icon;
                const tone = CATEGORY_META[notification.category].tone;

                return (
                  <li key={notification.id}>
                    <Link
                      href="/notifications"
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-start gap-3 hover:bg-neutral-50 px-4 py-3 transition-colors",
                        notification.unread && "bg-primary-50/40",
                      )}
                    >
                      <span
                        className={cn(
                          "flex justify-center items-center rounded-md w-9 h-9 shrink-0",
                          ICON_TONE_CLASSES[tone],
                        )}
                      >
                        <Icon size={16} strokeWidth={1.75} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900 text-small truncate">
                          {notification.title}
                        </p>
                        <p className="mt-0.5 text-caption text-neutral-400">
                          {notification.timeAgo}
                        </p>
                      </div>
                      {notification.unread && (
                        <span
                          aria-hidden="true"
                          className="bg-primary-600 mt-1.5 rounded-full w-1.5 h-1.5 shrink-0"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          <Link
            href="/notifications"
            onClick={() => setIsOpen(false)}
            className="block bg-neutral-50 hover:bg-primary-50 px-4 py-3 font-medium text-primary-800 text-small text-center transition-colors"
          >
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
