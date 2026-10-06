import Link from "next/link";
import Image from "next/image";
import Brand from "@/src/shared/ui/Brand";
import { ONBOARDING_STEPS } from "../../services/steps";

/** Desktop step list with the current step's illustration. */
export function OnboardingSidebar({ currentStep }: { currentStep: number }) {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-neutral-100 flex flex-col py-8 px-6">
      <Link href="/dashboard" className="mb-10 hover:opacity-90 transition-opacity inline-block">
        <Brand />
      </Link>

      <nav className="flex flex-col gap-5 flex-1">
        {ONBOARDING_STEPS.map((step) => {
          const isCompleted = step.number < currentStep;
          const isActive = step.number === currentStep;

          return (
            <div key={step.number} className="flex items-center gap-3">
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
              <span
                className={`text-xs font-semibold uppercase tracking-wide ${
                  isActive ? "text-neutral-900" : isCompleted ? "text-neutral-600" : "text-neutral-300"
                }`}
              >
                {step.label}
              </span>
              {isActive && (
                <span className="material-symbols-outlined text-primary text-[18px] ml-auto">
                  arrow_forward
                </span>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 flex justify-center">
        <Image
          src={`/onboarding/step-${currentStep}.svg`}
          alt=""
          width={200}
          height={160}
          className="object-contain"
          aria-hidden="true"
          priority
        />
      </div>
    </aside>
  );
}
