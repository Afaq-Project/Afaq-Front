"use client";

import { useLocale, useTranslations } from "next-intl";
import { useDeadlineText } from "@/src/shared/lib/useDeadlineText";
import { useNotifications } from "../services/notificationsStore";
import { describe, type NotificationView } from "../services/utils";
import type { Notification } from "../types/notification";

export interface DescribedNotification {
  notification: Notification;
  view: NotificationView;
}

/** Notifications that still apply, with their copy and action in the app's language. Newest first. */
export function useDescribedNotifications(): DescribedNotification[] {
  const t = useTranslations("notifications");
  const locale = useLocale();
  const deadline = useDeadlineText();
  return useNotifications().flatMap((notification) => {
    const view = describe(notification, t, locale, deadline);
    return view ? [{ notification, view }] : [];
  });
}
