"use client";

import React from "react";
import Link from "next/link";
import Brand from "@/src/shared/ui/Brand";
import Image from "next/image";

interface OnboardingSidebarProps {
  currentStep: number;
  totalSteps?: number;
}

const STEPS = [
  { step: 1, label: "EDUCATION" },
  { step: 2, label: "BACKGROUND & GOALS" },
  { step: 3, label: "SKILLS & LANGUAGE" },
  { step: 4, label: "DOCUMENTS" },
];

export function OnboardingSidebar({
  currentStep,
}: OnboardingSidebarProps) {
  return (
    <aside className="hidden md:flex flex-col w-[300px] bg-white border-r border-neutral-100 relative z-20 py-10 px-8 shrink-0">
      {/* Brand */}
      <Link href="/dashboard" className="mb-16 inline-block">
        <Brand />
      </Link>

      {/* Steps List */}
      <nav className="flex flex-col gap-8">
        {STEPS.map((s) => {
          const isCompleted = s.step < currentStep;
          const isActive = s.step === currentStep;

          return (
            <div key={s.step} className="flex items-center gap-4">
              {isCompleted ? (
                <div className="w-[26px] h-[26px] rounded-full flex items-center justify-center bg-[#397A0F] text-white">
                  <span className="material-symbols-outlined text-[16px]">check</span>
                </div>
              ) : (
                <div
                  className={`w-[26px] h-[26px] rounded-full flex items-center justify-center text-[11px] font-bold transition-colors border ${
                    isActive
                      ? "border-[#397A0F] text-[#397A0F]"
                      : "border-neutral-200 text-neutral-300"
                  }`}
                >
                  {s.step}
                </div>
              )}
              
              <span
                className={`text-[11px] font-bold tracking-wider flex-1 ${
                  isCompleted || isActive
                    ? "text-neutral-900"
                    : "text-neutral-400"
                }`}
              >
                {s.label}
              </span>
              
              {isActive && (
                <span className="material-symbols-outlined text-[#397A0F] text-[18px]">
                  arrow_forward
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Illustration */}
      <div className="mt-auto relative w-full h-[220px] flex items-end justify-center">
        <div className="w-full h-full relative">
          <Image 
            src="/images/onboarding-img-v2.png" 
            alt="Onboarding Illustration" 
            fill
            className="object-contain mix-blend-multiply" 
            priority
          />
        </div>
      </div>
    </aside>
  );
}
