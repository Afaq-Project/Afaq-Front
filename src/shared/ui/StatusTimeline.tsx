import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";

/** The app-wide status names, in sentence case. */
export const STATUS_STEPS = ["Not started", "In progress", "Submitted", "In review", "Decision"];

interface StatusTimelineProps {
  currentStep: number;
  /** Stacks the steps vertically below 768px (with a vertical connector). */
  stackOnMobile?: boolean;
  /**
   * Wraps a step's content, e.g. in a button that sets the status. Gets the step index, its
   * rendered circle + label, and the classes that lay them out.
   */
  renderStep?: (index: number, content: ReactNode, className: string) => ReactNode;
}

/**
 * Five-step status tracker (design system "Status timeline"): completed steps are filled
 * green-800 circles with a check, the current step a filled circle with its number, upcoming
 * steps outlined with a muted number. The connecting line fills with green-400.
 */
export function StatusTimeline({ currentStep, stackOnMobile = false, renderStep }: StatusTimelineProps) {
  const contentClass = stackOnMobile
    ? "flex md:flex-col items-center gap-3 md:gap-1.5 md:text-center"
    : "flex flex-col items-center gap-1.5 text-center";

  return (
    <ol className={cn("flex w-full", stackOnMobile ? "flex-col md:flex-row md:items-start" : "items-start")}>
      {STATUS_STEPS.map((step, index) => {
        const done = index < currentStep;
        const current = index === currentStep;

        const content = (
          <>
            <span
              className={cn(
                "z-10 relative flex justify-center items-center rounded-full size-6 font-medium text-caption shrink-0",
                done || current ? "bg-primary-800 text-white" : "bg-white border border-neutral-200 text-neutral-400",
              )}
            >
              {done ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : index + 1}
            </span>
            <span className={cn("text-caption leading-tight", current ? "font-medium text-neutral-900" : "text-neutral-600")}>
              {step}
              {done && <span className="sr-only"> (done)</span>}
            </span>
          </>
        );

        return (
          <li
            key={step}
            aria-current={current ? "step" : undefined}
            className={cn("relative min-w-0", stackOnMobile ? "pb-4 last:pb-0 md:pb-0 md:flex-1" : "flex-1")}
          >
            {index > 0 && (
              // Line from the previous step's circle to this one: vertical when stacked, horizontal otherwise.
              <span
                aria-hidden="true"
                className={cn(
                  "absolute",
                  stackOnMobile
                    ? "-top-4 start-2.75 w-0.5 h-4 md:top-3 md:end-1/2 md:-start-1/2 md:w-auto md:h-0.5"
                    : "top-3 end-1/2 -start-1/2 h-0.5",
                  index <= currentStep ? "bg-primary-400" : "bg-neutral-100",
                )}
              />
            )}
            {renderStep ? renderStep(index, content, contentClass) : <span className={contentClass}>{content}</span>}
          </li>
        );
      })}
    </ol>
  );
}
