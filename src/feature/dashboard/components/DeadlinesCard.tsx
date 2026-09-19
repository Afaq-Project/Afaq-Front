import Card from "@/src/shared/ui/Card";
import { DeadlineTone } from "@/src/feature/applications/types/status";
import { APPLICATIONS } from "@/src/feature/applications/mocks/applications";
import {
  formatDeadline,
  getDeadlineTone,
} from "@/src/feature/applications/services/utils";
import { cn } from "../services/utils";

const TONE_CLASSES: Record<
  DeadlineTone,
  { bar: string; tile: string; text: string }
> = {
  danger: {
    bar: "border-danger-600",
    tile: "bg-danger-600",
    text: "text-danger-600",
  },
  warning: {
    bar: "border-warning-600",
    tile: "bg-warning-600",
    text: "text-warning-600",
  },
  info: {
    bar: "border-info-600",
    tile: "bg-info-600",
    text: "text-info-600",
  },
};

function daysLeftTile(daysLeft: number): { value: string; unit: string } {
  if (daysLeft <= 0) return { value: "0", unit: "today" };
  if (daysLeft === 1) return { value: "1", unit: "day" };
  return { value: String(daysLeft), unit: "days" };
}

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
          const tile = daysLeftTile(application.daysLeft);

          return (
            <li
              key={application.id}
              className={cn(
                "flex items-center gap-3 pl-3 border-l-4 rounded-sm",
                classes.bar,
              )}
            >
              <span
                className={cn(
                  "flex flex-col justify-center items-center rounded-md w-12 h-12 text-white shrink-0",
                  classes.tile,
                )}
              >
                <span className="font-bold text-base leading-none">
                  {tile.value}
                </span>
                <span className="mt-0.5 text-[10px] text-white/80 uppercase leading-none tracking-wide">
                  {tile.unit}
                </span>
              </span>
              <div className="min-w-0">
                <p className="font-medium text-neutral-900 text-sm truncate">
                  {application.title}
                </p>
                <p className={cn("font-medium text-xs", classes.text)}>
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
