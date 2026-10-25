"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, CheckCheck } from "lucide-react";

import { useClickOutside } from "@/src/shared/hooks/useClickOutside";
import { cn } from "@/src/feature/dashboard/services/utils";
import Button from "@/src/shared/ui/Button";
import { markAllRead, setRead } from "../services/notificationsStore";
import { CompactNotificationRow } from "./NotificationRow";
import { useDescribedNotifications } from "../hooks/useDescribedNotifications";

const PREVIEW_LIMIT = 5;

/** The top-bar bell: unread count badge, then the latest 5 (unread first) in the same rows as the page. */
export function NotificationsDropdown({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  // Relative times are measured from when the panel opened.
  const [openedAt, setOpenedAt] = useState(() => new Date());
  const containerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isActive = pathname === "/notifications" || pathname.startsWith("/notifications/");
  const items = useDescribedNotifications();

  useClickOutside(containerRef, () => setIsOpen(false));

  const unreadCount = items.filter(({ notification }) => !notification.read).length;
  // Stable sort: unread first, newest first within each.
  const preview = [...items].sort((a, b) => Number(a.notification.read) - Number(b.notification.read)).slice(0, PREVIEW_LIMIT);
  const close = () => setIsOpen(false);

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          if (!isOpen) setOpenedAt(new Date());
          setIsOpen(!isOpen);
        }}
        aria-label={unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={cn(
          "relative inline-flex justify-center items-center rounded-md size-10 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 transition-colors after:absolute after:-inset-0.5 after:content-['']",
          isActive ? "text-primary-600" : "text-neutral-600 hover:text-neutral-900",
        )}
      >
        <Bell size={20} strokeWidth={1.75} aria-hidden="true" />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="top-1 end-1 absolute flex justify-center items-center bg-danger-600 px-1 border-2 border-white rounded-full min-w-4 h-4 font-semibold text-[10px] text-white leading-none"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        // Below 640px the bell isn't at the screen edge, so the panel spans the viewport instead.
        <div className="top-16 sm:top-full end-4 sm:end-0 start-4 sm:start-auto z-50 fixed sm:absolute bg-white shadow-sm sm:mt-2 border border-neutral-100 rounded-lg sm:w-104 overflow-hidden">
          <div className="flex justify-between items-center gap-3 py-2 pe-2 ps-4 border-neutral-100 border-b">
            <h2 className="text-h3 text-neutral-900">Notifications</h2>
            <Button variant="ghost" onClick={markAllRead} disabled={unreadCount === 0} className="px-2 md:h-8 text-small">
              <CheckCheck size={16} strokeWidth={1.75} aria-hidden="true" />
              Mark all as read
            </Button>
          </div>

          {preview.length === 0 ? (
            <p className="px-4 py-8 text-neutral-600 text-small text-center">You&apos;re all caught up</p>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto">
              {preview.map(({ notification, view }) => (
                <CompactNotificationRow
                  key={notification.id}
                  notification={notification}
                  view={view}
                  now={openedAt}
                  onOpen={() => {
                    setRead(notification.id, true);
                    close();
                  }}
                />
              ))}
            </ul>
          )}

          <Link
            href="/notifications"
            onClick={close}
            className="block hover:bg-neutral-50 px-4 py-3 border-neutral-100 border-t font-medium text-primary-600 text-small text-center transition-colors"
          >
            View all
          </Link>
        </div>
      )}
    </div>
  );
}
