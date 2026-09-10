"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface OnboardingCompleteProps {
  completionPercentage?: number;
}

export function OnboardingComplete({
  completionPercentage = 75,
}: OnboardingCompleteProps) {
  const router = useRouter();
  const [animatedPercent, setAnimatedPercent] = useState(0);

  // Animate progress ring on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercent(completionPercentage);
    }, 150);
    return () => clearTimeout(timer);
  }, [completionPercentage]);

  // Circle geometry for r = 42
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ~263.89
  const strokeDashoffset =
    circumference - (animatedPercent / 100) * circumference;

  return (
    <main className="flex-grow flex items-center justify-center px-4 md:px-6 py-12">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-6">
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center mb-2 animate-bounce">
          <span
            className="material-symbols-outlined text-on-primary-container text-5xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            check_circle
          </span>
        </div>

        {/* Header */}
        <h1 className="text-2xl md:text-3xl lg:text-[34px] font-semibold text-on-surface tracking-tight">
          You&apos;re all set!
        </h1>

        {/* Subtext */}
        <p className="text-sm md:text-base text-on-surface-variant max-w-sm leading-relaxed">
          Your account has been created successfully. Finish the rest of your profile later to get even better scholarship and internship matches.
        </p>

        {/* Profile Completion Card */}
        <div className="bg-surface-container-low w-full rounded-2xl p-5 md:p-6 flex items-center justify-between shadow-sm border border-outline-variant/40 transition-all hover:shadow-md">
          <div className="flex items-center space-x-4">
            {/* Progress Ring */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-surface-container-highest"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                />
                <circle
                  className="text-primary transition-all duration-1000 ease-out"
                  cx="50"
                  cy="50"
                  fill="transparent"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs md:text-sm text-on-surface font-bold">
                {animatedPercent}%
              </div>
            </div>

            <div className="text-left">
              <h3 className="text-sm md:text-base font-semibold text-on-surface">
                Profile status
              </h3>
              <p className="text-xs md:text-sm text-on-surface-variant">
                {animatedPercent >= 75 ? "Almost complete" : "Great start"}
              </p>
            </div>
          </div>

          <Link
            href="/profile"
            aria-label="Complete profile now"
            className="text-primary hover:bg-surface-container-high p-2.5 rounded-full transition-colors flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-lg">
              arrow_forward_ios
            </span>
          </Link>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="bg-primary hover:opacity-90 text-on-primary font-semibold text-base md:text-lg rounded-xl px-6 py-3.5 flex items-center justify-center w-full transition-all space-x-2 shadow-sm cursor-pointer active:scale-[0.99]"
        >
          <span>Go to my dashboard</span>
          <span className="material-symbols-outlined text-xl">arrow_forward</span>
        </button>

        {/* Secondary Action: Complete profile */}
        <Link
          href="/profile"
          className="inline-block text-xs md:text-sm font-medium text-primary hover:underline pt-1"
        >
          Or review full profile settings
        </Link>
      </div>
    </main>
  );
}
