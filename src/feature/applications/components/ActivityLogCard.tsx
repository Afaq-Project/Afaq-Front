import Card from "@/src/shared/ui/Card";
import { cn } from "@/src/feature/dashboard/services/utils";
import type { ApplicationActivityItem } from "../types/detail";

export function ActivityLogCard({
  activity,
}: {
  activity: ApplicationActivityItem[];
}) {
  return (
    <Card>
      <h2 className="text-h2">Activity Log</h2>

      <ul className="flex flex-col gap-4 mt-4">
        {activity.map((item, index) => (
          <li key={item.id} className="flex items-start gap-3">
            <span
              className={cn(
                "mt-1.5 rounded-full w-2 h-2 shrink-0",
                index === 0 ? "bg-primary-600" : "bg-neutral-200",
              )}
            />
            <div className="min-w-0">
              <p
                className={cn(
                  "text-small",
                  index === 0
                    ? "font-medium text-neutral-900"
                    : "text-neutral-600",
                )}
              >
                {item.label}
              </p>
              <p className="text-neutral-400 text-caption">
                {item.timestamp}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
