import { MoreHorizontal } from "lucide-react";
import { TickGauge } from "@/shared/ui/TickGauge";
import Card from "@/shared/ui/Card";
import { PROFILE_COMPLETION, PROFILE_SECTIONS } from "../mocks/dashboard";
import { cn } from "../services/utils";

export function ProfileProgressCard() {
  return (
    <Card className="hidden lg:block">
      <div className="flex justify-between items-center">
        <h2 className="text-h2">Profile progress</h2>
        <button
          type="button"
          aria-label="More options"
          className="flex justify-center items-center hover:bg-neutral-50 rounded-md w-8 h-8 text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          <MoreHorizontal size={18} strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex flex-col items-center gap-6 mt-4">
        <div className="relative w-35 h-35">
          <TickGauge value={PROFILE_COMPLETION} />
          <div className="absolute inset-0 flex flex-col justify-center items-center">
            <span className="text-h1">{PROFILE_COMPLETION}%</span>
            <span className="text-caption text-neutral-600">Complete</span>
          </div>
        </div>

        <ul className="flex flex-col gap-2.5 w-full">
          {PROFILE_SECTIONS.map((section) => (
            <li
              key={section.label}
              className="flex justify-between items-center text-small"
            >
              <span className="flex items-center gap-2 text-neutral-700">
                <span
                  className={cn(
                    "rounded-full w-2 h-2",
                    section.complete ? "bg-primary-600" : "bg-neutral-200",
                  )}
                />
                {section.label}
              </span>
              <span
                className={
                  section.complete ? "text-primary-800" : "text-neutral-400"
                }
              >
                {section.complete ? "Done" : "Pending"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
