import type { LucideIcon } from "lucide-react";

import { cn } from "@/src/feature/dashboard/services/utils";
import type { Notification } from "../types/notification";
import { NotificationItem } from "./NotificationItem";

const TONE_CLASSES: Record<"amber" | "blue", string> = {
  amber: "bg-linear-to-br from-warning-400 to-warning-600 text-white",
  blue: "bg-linear-to-br from-info-400 to-info-600 text-white",
};

export function NotificationSection({
  label,
  icon: Icon,
  tone,
  items,
  onDismiss,
}: {
  label: string;
  icon: LucideIcon;
  tone: "amber" | "blue";
  items: Notification[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex justify-center items-center rounded-md w-8 h-8 shadow-sm shrink-0",
            TONE_CLASSES[tone],
          )}
        >
          <Icon size={16} strokeWidth={2} />
        </span>
        <h2 className="font-semibold text-neutral-900 text-body">{label}</h2>
        <span className="bg-neutral-100 px-2 py-0.5 rounded-full font-medium text-neutral-500 text-caption">
          {items.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <NotificationItem
            key={item.id}
            notification={item}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  );
}
