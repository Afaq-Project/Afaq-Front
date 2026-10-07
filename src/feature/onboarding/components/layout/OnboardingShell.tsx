"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { OnboardingSidebar } from "./OnboardingSidebar";
import { OnboardingMobileHeader } from "./OnboardingMobileHeader";

interface OnboardingShellProps {
  /** 1–4 for the steps; anything else (e.g. the complete page) renders without the step chrome. */
  step: number;
  children: ReactNode;
}

export function OnboardingShell({ step, children }: OnboardingShellProps) {
  const router = useRouter();
  const isStep = step >= 1 && step <= 4;

  if (!isStep) {
    return <div className="min-h-screen bg-background flex flex-col">{children}</div>;
  }

  return (
    <>
      {/* ── Desktop: centered card over the background image ── */}
      <div
        className="hidden md:flex h-screen overflow-hidden items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/onboarding-bg.jpg')" }}
      >
        <div
          className="flex w-full max-w-5xl shadow-2xl mx-4 rounded-2xl overflow-hidden bg-white"
          style={{ height: "calc(100vh - 3rem)" }}
        >
          <OnboardingSidebar currentStep={step} />

          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-end px-6 pt-5 pb-0 flex-shrink-0">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="text-xs font-medium text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
              >
                Save &amp; exit
              </button>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col">{children}</div>
          </div>
        </div>
      </div>

      {/* ── Mobile: full-screen with top bar ── */}
      <div className="md:hidden min-h-screen bg-background flex flex-col">
        <OnboardingMobileHeader currentStep={step} />
        <div className="flex-1 flex flex-col overflow-y-auto">{children}</div>
      </div>
    </>
  );
}
