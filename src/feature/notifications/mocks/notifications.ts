import type { Notification } from "../types/notification";

export const NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    category: "reminder",
    title: "Deadline in 3 days: KAUST Scholarship",
    description:
      "Don't forget to finalize your research proposal and secure your two letters of recommendation before the window closes.",
    timeAgo: "2h ago",
    unread: true,
    actions: [
      { label: "Complete Application", variant: "primary" },
      { label: "Dismiss", variant: "ghost" },
    ],
  },
  {
    id: "notif-2",
    category: "reminder",
    title: "Deadline in 7 days: Misk Leadership Program",
    description:
      "Review your personality assessment results. They are required for the first round of the Misk Leadership selection.",
    timeAgo: "1d ago",
    unread: false,
  },
  {
    id: "notif-3",
    category: "status_update",
    title: "Status changed: Qatar Foundation (Submitted)",
    description:
      "Your application has been successfully received by the committee. The review phase typically takes 14 business days.",
    timeAgo: "Just now",
    unread: true,
    badgeLabel: "New Status",
  },
];
