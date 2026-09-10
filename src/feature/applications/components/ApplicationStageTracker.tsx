import { Check, Eye, FileEdit, Flag, PenLine, Send } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/src/feature/dashboard/services/utils";
import { DETAIL_STAGES } from "../types/detail";

const STAGE_ICONS: Record<(typeof DETAIL_STAGES)[number], LucideIcon> = {
  "Not Started": FileEdit,
  "In Progress": PenLine,
  Submitted: Send,
  "Under Review": Eye,
  Result: Flag,
};

export function ApplicationStageTracker({
  currentIndex,
}: {
  currentIndex: number;
}) {
  return (
    <ol className="flex items-start w-full">
      {DETAIL_STAGES.map((stage, index) => {
        const isComplete = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === DETAIL_STAGES.length - 1;
        const StageIcon = STAGE_ICONS[stage];

        return (
          <li
            key={stage}
            className={cn("flex items-center", !isLast && "flex-1")}
          >
            <div className="flex flex-col items-center gap-2 w-20 shrink-0 text-center">
              <span
                className={cn(
                  "flex justify-center items-center border-2 rounded-full w-8 h-8 shrink-0",
                  isComplete && "bg-primary-600 border-primary-600 text-white",
                  isCurrent && "bg-white border-primary-600 text-primary-800",
                  !isComplete &&
                    !isCurrent &&
                    "bg-white border-neutral-200 text-neutral-400",
                )}
              >
                {isComplete ? (
                  <Check size={16} strokeWidth={2.5} />
                ) : (
                  <StageIcon size={15} strokeWidth={1.75} />
                )}
              </span>
              <span
                className={cn(
                  "font-medium text-caption whitespace-nowrap",
                  isComplete || isCurrent
                    ? "text-neutral-900"
                    : "text-neutral-400",
                )}
              >
                {stage}
              </span>
            </div>

            {!isLast && (
              <span
                className={cn(
                  "flex-1 mt-4 rounded-full h-0.5",
                  isComplete ? "bg-primary-600" : "bg-neutral-200",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
