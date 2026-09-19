export type NotificationCategory = "reminder" | "status_update";

export interface NotificationAction {
  label: string;
  variant: "primary" | "ghost";
}

export interface Notification {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timeAgo: string;
  unread: boolean;
  badgeLabel?: string;
  actions?: NotificationAction[];
}
