"use client";

import React, { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { OnboardingHeader } from "@/src/feature/onboarding/components/OnboardingHeader";
import { ProfileProvider } from "@/src/feature/profile/context/ProfileContext";

export default function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  const getStep = (): number => {
    if (pathname.includes("/step-1")) return 1;
    if (pathname.includes("/step-2")) return 2;
    if (pathname.includes("/step-3")) return 3;
    if (pathname.includes("/step-4")) return 4;
    return 0; // complete or root
  };

  const currentStep = getStep();
  const showHeader = currentStep >= 1 && currentStep <= 4;

  return (
    <ProfileProvider>
      <div className="bg-background text-on-background min-h-screen flex flex-col font-sans antialiased">
        {showHeader && (
          <OnboardingHeader currentStep={currentStep} totalSteps={4} />
        )}
        <div className="flex-1 flex flex-col">{children}</div>
      </div>
    </ProfileProvider>
  );
}

