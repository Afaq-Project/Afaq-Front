"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { Popover } from "@/src/shared/ui/Popover";
import type { MatchFactorKey, MatchFit } from "../types/opportunity";
import { FIT_LABEL, FIT_TEXT, FitIcon, MATCH_FACTORS } from "./matchFactors";

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
        {MATCH_FACTORS.map((factor) => {
          const fit = factors[factor.key];
          return (
            <li key={factor.key} className="flex justify-between items-center gap-3 text-small">
              <span className="text-neutral-800">
                {factor.label} <span className="text-neutral-600">{factor.weight}%</span>
              </span>
              <span className={cn("flex items-center gap-1.5 text-caption shrink-0", FIT_TEXT[fit])}>
                <FitIcon fit={fit} />
                {FIT_LABEL[fit]}
              </span>
            </li>
          );
        })}
      </ul>
    </Popover>
  );
}
