import { Bell } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { getDeadlineUrgency } from "@/src/shared/lib/deadline";
import { content } from "../../../content/en";
import { Card } from "../../ui/Card";
import { DEADLINE_TEXT } from "../../ui/DeadlineText";

/** One of the cards peeking out under the front card. */
function StackedCard({ className }: { className: string }) {
  return <div className={cn("absolute bg-white border border-neutral-100 rounded-lg", className)} />;
}

/**
 * Decorative deadline reminder: a front card with two cards stacked behind it (10px and 20px
 * lower, 20px narrower each, at 80% and 50% opacity). Hidden from assistive tech.
 */
export function HeroReminder({ className }: { className?: string }) {
  const { reminder } = content.hero;

  return (
    <div aria-hidden="true" className={cn("pointer-events-none select-none", className)}>
      <div className="relative">
        <StackedCard className="inset-x-5 [inset-block-start:20px] [inset-block-end:-20px] opacity-50" />
        <StackedCard className="inset-x-2.5 [inset-block-start:10px] [inset-block-end:-10px] opacity-80" />

        <Card floating className="z-10 relative flex items-start gap-3 p-3.5 lg:p-3.5">
          {/* Accent bar: inset 12px from top and bottom so it never meets the rounded corners. */}
          <span className="absolute inset-y-3 bg-primary-600 rounded-full w-0.75 start-1.5" />
          <span className="inline-flex justify-center items-center bg-primary-50 rounded-sm size-7 text-primary-800 shrink-0">
            <Bell size={16} strokeWidth={1.75} />
          </span>
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-landing-caption text-neutral-600">{reminder.meta}</p>
            <p className="font-medium text-landing-small text-neutral-800">
              {reminder.text}{" "}
              <span className={cn(DEADLINE_TEXT[getDeadlineUrgency(reminder.daysLeft)], "font-semibold")}>{reminder.deadline}</span>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
