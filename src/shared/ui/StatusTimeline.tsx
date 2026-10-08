import { Check } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";

const STEPS = ["Not started", "In progress", "Submitted", "In review", "Result"];

/**
 * Five-step status tracker (design system "Status timeline"): completed steps are filled
 * green-800 circles with a check, the current step a filled circle with its number, upcoming
 * steps outlined with a muted number. The connecting line fills with green-400.
 */
export function StatusTimeline({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex items-start w-full">
      {STEPS.map((step, index) => {
        const done = index < currentStep;
        const current = index === currentStep;

        return (
          <li
            key={step}
            aria-current={current ? "step" : undefined}
            className="relative flex flex-col flex-1 items-center gap-1.5 min-w-0 text-center"
          >
            {index > 0 && (
              // Line from the previous step's circle to this one.
              <span
                aria-hidden="true"
                className={cn("top-3 right-1/2 -left-1/2 absolute h-0.5", index <= currentStep ? "bg-primary-400" : "bg-neutral-100")}
              />
            )}
            <span
              className={cn(
                "z-10 relative flex justify-center items-center rounded-full size-6 font-medium text-caption",
                done || current ? "bg-primary-800 text-white" : "bg-white border border-neutral-200 text-neutral-400",
              )}
            >
              {done ? <Check size={12} strokeWidth={3} aria-hidden="true" /> : index + 1}
            </span>
            <span className={cn("text-caption leading-tight", current ? "font-medium text-neutral-900" : "text-neutral-600")}>
              {step}
              {done && <span className="sr-only"> (done)</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
