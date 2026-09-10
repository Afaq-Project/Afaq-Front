"use client";

import React from "react";
import Link from "next/link";
import Brand from "@/src/shared/ui/Brand";

interface OnboardingHeaderProps {
  currentStep: number;
  totalSteps?: number;
}

export function OnboardingHeader({
  currentStep,
  totalSteps = 4,
}: OnboardingHeaderProps) {
  const percentage = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <header className="w-full px-4 md:px-6 py-4 flex justify-between items-center bg-surface-container-lowest border-b border-outline-variant/30 sticky top-0 z-40 shadow-sm">
      <Link href="/dashboard" className="hover:opacity-90 transition-opacity">
        <Brand />
      </Link>

      {currentStep <= totalSteps && (
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-xs md:text-sm font-medium text-on-surface-variant whitespace-nowrap">
            Step {currentStep} of {totalSteps}
          </span>
          <div
            className="w-24 md:w-36 h-2 bg-surface-container-highest rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Step ${currentStep} of ${totalSteps}`}
          >
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}
    </header>
  );
}

