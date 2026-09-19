"use client";

import { useMemo, useState } from "react";
import { CheckCheck } from "lucide-react";

import PageHeader from "@/src/shared/ui/PageHeader";
import { NOTIFICATIONS } from "../mocks/notifications";
import { CATEGORY_META, groupNotifications } from "../services/utils";
import { NotificationSection } from "./NotificationSection";

export function NotificationsView() {
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const groups = useMemo(
    () => groupNotifications(notifications),
    [notifications],
  );
  const hasUnread = notifications.some((notification) => notification.unread);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, unread: false })),
    );
  };

  const dismiss = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Notifications"
        description="Stay updated with your latest scholarship alerts and system status."
        action={
          <button
            type="button"
            onClick={markAllAsRead}
            disabled={!hasUnread}
            className="inline-flex justify-center items-center gap-2 bg-linear-to-br from-primary-600 to-primary-800 disabled:opacity-50 shadow-sm hover:shadow-card px-4 rounded-sm w-fit h-10 font-medium text-white text-sm transition-all disabled:pointer-events-none"
          >
            <CheckCheck size={16} strokeWidth={2} />
            Mark all as read
          </button>
        }
      />

      {groups.length === 0 ? (
        <div className="flex flex-col items-center gap-2 bg-white shadow-card py-16 rounded-lg text-center">
          <span className="flex justify-center items-center bg-primary-50 mb-1 rounded-full w-12 h-12 text-primary-600">
            <CheckCheck size={22} strokeWidth={1.75} />
          </span>
          <p className="font-medium text-neutral-800 text-small">
            You&apos;re all caught up
          </p>
          <p className="text-neutral-500 text-small">
            New reminders and status updates will show up here.
          </p>
        </div>
      ) : (
        groups.map((group) => (
          <NotificationSection
            key={group.category}
            label={CATEGORY_META[group.category].label}
            icon={CATEGORY_META[group.category].icon}
            tone={CATEGORY_META[group.category].tone}
            items={group.items}
            onDismiss={dismiss}
          />
        ))
      )}
    </div>
  );
}
