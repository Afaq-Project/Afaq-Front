"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CompletionRing } from "./CompletionRing";
import { useTranslations } from "next-intl";

interface ProfileStatusCardProps {
  completionPercentage: number;
  isLoading: boolean;
}

/** Profile completion with a link to the profile; the ring animates in once loaded. */
export function ProfileStatusCard({ completionPercentage, isLoading }: ProfileStatusCardProps) {
  const t = useTranslations("onboarding.complete");
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => setAnimatedPercent(completionPercentage), 150);
    return () => clearTimeout(timer);
  }, [completionPercentage, isLoading]);

  const status = isLoading ? t("calculating") : animatedPercent >= 75 ? t("almostComplete") : t("greatStart");

  return (
    <div className="bg-surface-container-low w-full rounded-2xl p-5 md:p-6 flex items-center justify-between shadow-sm border border-outline-variant/40 transition-all hover:shadow-md">
      <div className="flex items-center space-x-4">
        <CompletionRing percent={animatedPercent} isLoading={isLoading} />
        <div className="text-start">
          <h3 className="text-sm md:text-base font-semibold text-on-surface">{t("profileStatus")}</h3>
          <p className="text-xs md:text-sm text-on-surface-variant">{status}</p>
        </div>
      </div>

      <Link
        href="/profile"
        aria-label={t("completeNow")}
        className="text-primary hover:bg-surface-container-high p-2.5 rounded-full transition-colors flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-lg rtl:-scale-x-100">arrow_forward_ios</span>
      </Link>
    </div>
  );
}
