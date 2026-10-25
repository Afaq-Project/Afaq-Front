"use client";

import { useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { Popover } from "@/src/shared/ui/Popover";
import type { MatchBreakdown } from "../types/opportunity";
import { FIT_TEXT, FitIcon, matchFactorRows, type KnownFactorKey } from "./matchFactors";
import { useTranslations } from "next-intl";

/** Info button that explains a match score factor by factor. */
export function MatchWhyPopover({ breakdown }: { breakdown: MatchBreakdown }) {
  const t = useTranslations("opportunity");
  const [open, setOpen] = useState(false);

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      label={t("whyMatch")}
      align="start"
      trigger={(triggerProps) => (
        <button
          type="button"
          {...triggerProps}
          aria-label={t("whyMatch")}
          className="after:absolute relative flex justify-center items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 size-6 text-neutral-400 hover:text-neutral-800 transition-colors after:-inset-2.5 after:content-['']"
        >
          <Info size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
      )}
    >
      <p className="font-medium text-neutral-900 text-small">{t("whyMatch")}</p>
      <ul className="flex flex-col gap-2 mt-3">
        {matchFactorRows(breakdown).map((factor) => (
          <li key={factor.key} className="flex justify-between items-center gap-3 text-small">
            <span className="text-neutral-800">
              {factor.known ? t(`factors.${factor.key as KnownFactorKey}`) : factor.label} <span className="text-neutral-600">{factor.weight}%</span>
            </span>
            <span className={cn("flex items-center gap-1.5 text-caption shrink-0", FIT_TEXT[factor.fit])}>
              <FitIcon fit={factor.fit} />
              {t(`fit.${factor.fit}`)}
            </span>
          </li>
        ))}
      </ul>
    </Popover>
  );
}
