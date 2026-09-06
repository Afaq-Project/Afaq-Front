import {
  AlarmClockCheck,
  CalendarClock,
  CalendarRange,
  type LucideIcon,
} from "lucide-react";

import Card from "@/shared/ui/Card";
import { DeadlineTone } from "../types/status";
import { APPLICATIONS } from "../mocks/dashboard";
import { cn, formatDeadline, getDeadlineTone } from "../services/utils";

const TONE_CLASSES: Record<
  DeadlineTone,
  { bg: string; icon: string; text: string; symbol: LucideIcon }
> = {
  danger: {
    bg: "bg-danger-50",
    icon: "text-danger-800",
    text: "text-danger-600",
    symbol: AlarmClockCheck,
  },
  warning: {
    bg: "bg-warning-50",
    icon: "text-warning-800",
    text: "text-warning-600",
    symbol: CalendarClock,
  },
  info: {
    bg: "bg-info-50",
    icon: "text-info-800",
    text: "text-info-600",
    symbol: CalendarRange,
  },
};

export function DeadlinesCard() {
  const upcoming = [...APPLICATIONS]
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 3);

  return (
    <Card className="h-full">
      <h2 className="text-h2">Upcoming deadlines</h2>

      <ul className="flex flex-col gap-4 mt-4">
        {upcoming.map((application) => {
          const classes = TONE_CLASSES[getDeadlineTone(application.daysLeft)];
          const Icon = classes.symbol;

          return (
            <li key={application.id} className="flex items-center gap-3">
              <span
                className={cn(
                  "flex justify-center items-center rounded-md w-10 h-10 shrink-0",
                  classes.bg,
                )}
              >
                <Icon size={18} strokeWidth={1.75} className={classes.icon} />
              </span>
              <div className="min-w-0">
                <p className="font-medium text-neutral-900 text-small truncate">
                  {application.title}
                </p>
                <p className={cn("font-medium text-caption", classes.text)}>
                  {formatDeadline(application.daysLeft)}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
