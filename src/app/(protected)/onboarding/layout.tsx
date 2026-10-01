"use client";

import React, { type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ProfileProvider } from "@/src/feature/profile/context/ProfileContext";
import Brand from "@/src/shared/ui/Brand";

const STEPS = [
  { number: 1, label: "Education", path: "/onboarding/step-1" },
  { number: 2, label: "Background & Goals", path: "/onboarding/step-2" },
  { number: 3, label: "Skills & Language", path: "/onboarding/step-3" },
  { number: 4, label: "Documents", path: "/onboarding/step-4" },
];

function getStep(pathname: string): number {
  if (pathname.includes("/step-1")) return 1;
  if (pathname.includes("/step-2")) return 2;
  if (pathname.includes("/step-3")) return 3;
  if (pathname.includes("/step-4")) return 4;
  return 0;
}

export default function OnboardingLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const currentStep = getStep(pathname);
  const showSidebar = currentStep >= 1 && currentStep <= 4;

  if (!showSidebar) {
    // Complete page: render plain
    return (
      <ProfileProvider>
        <div className="min-h-screen bg-background flex flex-col">{children}</div>
      </ProfileProvider>
    );
  }

  return (
    <ProfileProvider>
      <div
        className="h-screen overflow-hidden flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #97c459 0%, #c0dd97 50%, #eaf3de 100%)" }}
      >
        <div className="flex w-full max-w-5xl shadow-2xl mx-4 rounded-2xl overflow-hidden bg-white" style={{ height: "calc(100vh - 3rem)" }}>
          {/* ─── Left sidebar panel ─── */}
          <aside className="w-64 flex-shrink-0 bg-white border-r border-neutral-100 flex flex-col py-8 px-6">
            {/* Brand */}
            <Link href="/dashboard" className="mb-10 hover:opacity-90 transition-opacity inline-block">
              <Brand />
            </Link>

            {/* Step list */}
            <nav className="flex flex-col gap-5 flex-1">
              {STEPS.map((step) => {
                const isCompleted = step.number < currentStep;
                const isActive = step.number === currentStep;
                const isPending = step.number > currentStep;

                return (
                  <div key={step.number} className="flex items-center gap-3">
                    {/* Circle */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold transition-colors ${
                        isCompleted
                          ? "bg-primary text-white"
                          : isActive
                          ? "border-2 border-neutral-300 text-neutral-700 bg-white"
                          : "bg-neutral-100 text-neutral-400"
                      }`}
                    >
                      {isCompleted ? (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      ) : (
                        step.number
                      )}
                    </div>

                    {/* Label */}
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide ${
                        isActive
                          ? "text-neutral-900"
                          : isCompleted
                          ? "text-neutral-600"
                          : "text-neutral-300"
                      }`}
                    >
                      {step.label}
                    </span>

                    {/* Arrow for active step */}
                    {isActive && (
                      <span className="material-symbols-outlined text-primary text-[18px] ml-auto">
                        arrow_forward
                      </span>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Illustration */}
            <div className="mt-auto pt-6 flex justify-center">
              <Image
                src="/Globalization-pana.png"
                alt=""
                width={200}
                height={160}
                className="object-contain"
                aria-hidden="true"
                priority
              />
            </div>
          </aside>

          {/* ─── Right content panel ─── */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Save & exit — always visible */}
            <div className="flex justify-end px-6 pt-5 pb-0 flex-shrink-0">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="text-xs font-medium text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
              >
                Save &amp; exit
              </button>
            </div>

            {/* Step content — scrollable section */}
            <div className="flex-1 overflow-y-auto flex flex-col">{children}</div>
          </div>
        </div>
      </div>
    </ProfileProvider>
  );
}
