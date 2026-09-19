import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Clock3,
  ShieldAlert,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

import { RECENT_ACTIVITY } from "../mocks/recentActivity";
import { ActivityTag } from "../types/activity";
import { formatDateTime } from "../services/utils";

const TAG_STYLE: Record<ActivityTag, { icon: LucideIcon; chip: string; pill: string }> = {
  "New user": {
    icon: UserPlus,
    chip: "bg-success-50 text-success-600",
    pill: "bg-success-50 text-success-800",
  },
  "Approval needed": {
    icon: ShieldAlert,
    chip: "bg-warning-50 text-warning-600",
    pill: "bg-warning-50 text-warning-800",
  },
  Upgrade: {
    icon: ArrowUpCircle,
    chip: "bg-primary-50 text-primary-600",
    pill: "bg-primary-50 text-primary-800",
  },
  Downgrade: {
    icon: ArrowDownCircle,
    chip: "bg-danger-50 text-danger-600",
    pill: "bg-danger-50 text-danger-800",
  },
  "Scraper alert": {
    icon: AlertTriangle,
    chip: "bg-neutral-100 text-neutral-600",
    pill: "bg-neutral-100 text-neutral-800",
  },
};

export function RecentActivityFeed() {
  return (
    <div className="flex flex-col gap-4 bg-white shadow-card p-5 rounded-lg h-full">
      <div className="flex items-center gap-2">
        <Clock3 size={18} strokeWidth={1.75} className="text-neutral-500" aria-hidden="true" />
        <h2 className="text-h3">Recent activity</h2>
      </div>

      <ul className="flex flex-col gap-1">
        {RECENT_ACTIVITY.map((item) => {
          const style = TAG_STYLE[item.tag];
          const Icon = style.icon;

          return (
            <li key={item.id} className="flex items-start gap-3 py-2.5">
              <div
                className={`flex justify-center items-center rounded-full w-9 h-9 shrink-0 ${style.chip}`}
              >
                <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 text-small truncate">{item.title}</p>
                <p className="text-neutral-500 text-caption">
                  {item.meta} · {formatDateTime(item.timestamp)}
                </p>
              </div>

              <span
                className={`shrink-0 px-2.5 py-1 rounded-full font-medium text-caption whitespace-nowrap ${style.pill}`}
              >
                {item.tag}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
