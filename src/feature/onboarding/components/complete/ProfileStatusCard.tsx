"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CompletionRing } from "./CompletionRing";

interface ProfileStatusCardProps {
  completionPercentage: number;
  isLoading: boolean;
}

/** Profile completion with a link to the profile; the ring animates in once loaded. */
export function ProfileStatusCard({ completionPercentage, isLoading }: ProfileStatusCardProps) {
  const [animatedPercent, setAnimatedPercent] = useState(0);

  useEffect(() => {
    if (isLoading) return;
    const timer = setTimeout(() => setAnimatedPercent(completionPercentage), 150);
    return () => clearTimeout(timer);
  }, [completionPercentage, isLoading]);

  const status = isLoading ? "Calculating…" : animatedPercent >= 75 ? "Almost complete" : "Great start";

  return (
    <div className="bg-surface-container-low w-full rounded-2xl p-5 md:p-6 flex items-center justify-between shadow-sm border border-outline-variant/40 transition-all hover:shadow-md">
      <div className="flex items-center space-x-4">
        <CompletionRing percent={animatedPercent} isLoading={isLoading} />
        <div className="text-left">
          <h3 className="text-sm md:text-base font-semibold text-on-surface">Profile status</h3>
          <p className="text-xs md:text-sm text-on-surface-variant">{status}</p>
        </div>
      </div>

      <Link
        href="/profile"
        aria-label="Complete profile now"
        className="text-primary hover:bg-surface-container-high p-2.5 rounded-full transition-colors flex items-center justify-center"
      >
        <span className="material-symbols-outlined text-lg">arrow_forward_ios</span>
      </Link>
    </div>
  );
}
