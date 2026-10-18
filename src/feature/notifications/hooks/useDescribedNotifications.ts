"use client";

import { useNotifications } from "../services/notificationsStore";
import { describe, type NotificationView } from "../services/utils";
import type { Notification } from "../types/notification";

export interface DescribedNotification {
  notification: Notification;
  view: NotificationView;
}

/** Notifications that still apply, with their copy and action. Newest first. */
export function useDescribedNotifications(): DescribedNotification[] {
  return useNotifications().flatMap((notification) => {
    const view = describe(notification);
    return view ? [{ notification, view }] : [];
  });
}
