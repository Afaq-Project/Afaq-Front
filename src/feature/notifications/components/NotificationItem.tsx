"use client";

import Badge from "@/src/shared/ui/Badge";
import { cn } from "@/src/feature/dashboard/services/utils";
import { CATEGORY_META } from "../services/utils";
import type { Notification } from "../types/notification";

const ICON_TONE_CLASSES: Record<"amber" | "blue", string> = {
  amber: "bg-warning-50 text-warning-600",
  blue: "bg-info-50 text-info-600",
};

export function NotificationItem({
  notification,
  onDismiss,
}: {
  notification: Notification;
  onDismiss: (id: string) => void;
}) {
  const { category, unread, title, description, timeAgo, badgeLabel, actions } =
    notification;
  const Icon = CATEGORY_META[category].icon;
  const tone = CATEGORY_META[category].tone;

  return (
    <div
      className={cn(
        "group flex gap-3 sm:gap-4 p-4 rounded-lg border transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-card",
        unread
          ? "bg-primary-50/50 border-primary-100"
          : "bg-white border-neutral-100",
      )}
    >
      <span
        className={cn(
          "flex justify-center items-center rounded-lg w-11 h-11 shrink-0",
          ICON_TONE_CLASSES[tone],
        )}
      >
        <Icon size={20} strokeWidth={1.75} />
      </span>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-3">
          <p className="font-semibold text-neutral-900 text-small">
            {title}
          </p>
          <span className="flex items-center gap-1.5 text-neutral-400 text-caption whitespace-nowrap shrink-0">
            {unread && (
              <span
                aria-hidden="true"
                className="bg-primary-600 rounded-full w-1.5 h-1.5"
              />
            )}
            {timeAgo}
          </span>
        </div>

        {badgeLabel && (
          <div className="mt-1.5">
            <Badge tone="green">{badgeLabel}</Badge>
          </div>
        )}

        <p className="mt-1.5 text-neutral-600 text-small leading-relaxed">
          {description}
        </p>

        {actions && actions.length > 0 && (
          <div className="flex items-center gap-2 mt-3.5">
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={
                  action.variant === "ghost"
                    ? () => onDismiss(notification.id)
                    : undefined
                }
                className={cn(
                  "inline-flex justify-center items-center gap-1.5 px-4 rounded-sm h-9 font-medium text-caption transition-all",
                  action.variant === "primary"
                    ? "bg-linear-to-br from-primary-600 to-primary-800 text-white shadow-sm hover:shadow-card"
                    : "bg-transparent text-neutral-600 border border-neutral-200 hover:border-neutral-400 hover:text-neutral-900",
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
