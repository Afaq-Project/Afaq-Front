"use client";

import { useState } from "react";
import { CircleCheck, CircleDashed, CircleMinus, Info, type LucideIcon } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { Popover } from "@/src/shared/ui/Popover";
import type { MatchFactorKey, MatchFit } from "../types/opportunity";

// The match score's weights (Sprint 3 matching spec).
const FACTORS: { key: MatchFactorKey; label: string; weight: number }[] = [
  { key: "fieldOfStudy", label: "Field of study", weight: 30 },
  { key: "skills", label: "Skills & interests", weight: 25 },
  { key: "gpa", label: "GPA", weight: 20 },
  { key: "language", label: "Language", weight: 15 },
  { key: "experience", label: "Work experience", weight: 10 },
];

const FIT: Record<MatchFit, { label: string; icon: LucideIcon; className: string }> = {
  strong: { label: "Strong fit", icon: CircleCheck, className: "text-success-800" },
  partial: { label: "Partial fit", icon: CircleDashed, className: "text-warning-800" },
  missing: { label: "Missing", icon: CircleMinus, className: "text-neutral-600" },
};

/** Info button that explains a match score factor by factor. */
export function MatchWhyPopover({ factors }: { factors: Record<MatchFactorKey, MatchFit> }) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label="Why this match"
      align="start"
      trigger={(triggerProps) => (
        <button
          type="button"
          {...triggerProps}
          aria-label="Why this match"
          className="after:absolute relative flex justify-center items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 size-6 text-neutral-400 hover:text-neutral-800 transition-colors after:-inset-2.5 after:content-['']"
        >
          <Info size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      )}
    >
      <p className="font-medium text-neutral-900 text-small">Why this match</p>
      <ul className="flex flex-col gap-2 mt-3">
        {FACTORS.map((factor) => {
          const fit = FIT[factors[factor.key]];
          const Icon = fit.icon;
          return (
            <li key={factor.key} className="flex justify-between items-center gap-3 text-small">
              <span className="text-neutral-800">
                {factor.label} <span className="text-neutral-600">{factor.weight}%</span>
              </span>
              <span className={cn("flex items-center gap-1 text-caption shrink-0", fit.className)}>
                <Icon size={14} strokeWidth={2} aria-hidden="true" />
                {fit.label}
              </span>
            </li>
          );
        })}
      </ul>
    </Popover>
  );
}
