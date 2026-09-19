import { AlarmClock, History, type LucideIcon } from "lucide-react";

import type {
  Notification,
  NotificationCategory,
} from "../types/notification";

export const CATEGORY_META: Record<
  NotificationCategory,
  { label: string; icon: LucideIcon; tone: "amber" | "blue" }
> = {
  reminder: { label: "Reminders", icon: AlarmClock, tone: "amber" },
  status_update: { label: "Status Updates", icon: History, tone: "blue" },
};

export interface NotificationGroup {
  category: NotificationCategory;
  items: Notification[];
}

export function groupNotifications(
  notifications: Notification[],
): NotificationGroup[] {
  return (Object.keys(CATEGORY_META) as NotificationCategory[])
    .map((category) => ({
      category,
      items: notifications.filter((n) => n.category === category),
    }))
    .filter((group) => group.items.length > 0);
}
