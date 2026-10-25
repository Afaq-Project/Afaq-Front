"use client";

import { useState } from "react";
import Badge from "@/src/shared/ui/Badge";
import { CompletionDonut } from "@/src/shared/ui/CompletionDonut";
import { NextStepPrompt } from "@/src/shared/ui/NextStepPrompt";
import { Popover } from "@/src/shared/ui/Popover";
import type { MatchFactor, NextStep } from "./completion";
import { MatchFactorList } from "./MatchFactorList";
import { useTranslations } from "next-intl";

interface ProfileCompletionProps {
  percent: number;
  nextStep?: NextStep;
  /** The match factors shown in the breakdown; the breakdown is hidden when empty. */
  factors?: MatchFactor[];
}

/**
 * Donut (which already shows the percentage) plus the next step; a breakdown popover when
 * factors are available; at 100%, a teal "Profile complete" chip in place of the next step.
 */
export function ProfileCompletion({ percent, nextStep, factors = [] }: ProfileCompletionProps) {
  const t = useTranslations("profile.header");
  const [open, setOpen] = useState(false);
  const value = Math.min(100, Math.max(0, Math.round(percent)));
  const label = t("percentComplete", { value });

  // At 100% there's no next step left, so the chip takes its place beside the full ring.
  const prompt =
    value >= 100 ? (
      <Badge tone="teal">{t("complete")}</Badge>
    ) : (
      nextStep && <NextStepPrompt title={nextStep.label} linkLabel={nextStep.impact} href={nextStep.href} />
    );

  if (factors.length === 0) {
    return (
      <div className="flex items-center gap-3">
        <div role="img" aria-label={label}>
          <CompletionDonut percent={value} />
        </div>
        {prompt}
      </div>
    );
  }

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label={t("breakdown")}
      trigger={(triggerProps) => (
        <div className="flex items-center gap-3">
          <button
            type="button"
            {...triggerProps}
            aria-label={t("percentSeeBreakdown", { value })}
            className="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
          >
            <CompletionDonut percent={value} />
          </button>
          <div className="min-w-0">
            {prompt}
            <button
              type="button"
              {...triggerProps}
              className="inline-flex min-h-11 items-center rounded-sm text-small text-neutral-600 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 md:min-h-0"
            >
              {t("seeBreakdown")}
            </button>
          </div>
        </div>
      )}
    >
      <MatchFactorList factors={factors} onNavigate={() => setOpen(false)} />
    </Popover>
  );
}
