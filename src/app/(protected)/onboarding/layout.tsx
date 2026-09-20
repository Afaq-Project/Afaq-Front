"use client";

import React, { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { OnboardingSidebar } from "@/src/feature/onboarding/components/OnboardingSidebar";
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
  const showSidebar = currentStep >= 1 && currentStep <= 4;

  return (
    <ProfileProvider>
      <div className="bg-gradient-to-br from-[#d2f3c6] via-[#e2f4d9] to-[#ebf7e5] min-h-screen flex items-center justify-center font-sans antialiased p-4 sm:p-6 lg:p-12">
        <div className="w-full max-w-[1100px] h-[85vh] min-h-[600px] max-h-[850px] bg-white rounded-[24px] shadow-2xl shadow-black/5 flex overflow-hidden border border-black/5 relative">
          {showSidebar && (
            <OnboardingSidebar currentStep={currentStep} totalSteps={4} />
          )}
          <div className="flex-1 flex flex-col relative z-10 bg-white overflow-y-auto overflow-x-hidden scrollbar-minimal">
            {children}
          </div>
        </div>
      </div>
    </ProfileProvider>
  );
}
