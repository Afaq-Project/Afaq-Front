import type { ReactNode } from "react";

/** The accented uppercase heading used for each section of an onboarding step. */
export function StepSectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-sm font-semibold text-on-surface uppercase tracking-wider">
      <span className="inline-block w-1 h-4 bg-primary rounded-sm" />
      {children}
    </h2>
  );
}
