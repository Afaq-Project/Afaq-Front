import Link from "next/link";
import Brand from "@/src/shared/ui/Brand";
import { ONBOARDING_STEPS } from "../../services/steps";
import { useTranslations } from "next-intl";

/** Mobile top bar with the current step and a progress bar. */
export function OnboardingMobileHeader({ currentStep }: { currentStep: number }) {
  const t = useTranslations("onboarding");
  const labelKey = ONBOARDING_STEPS.find((s) => s.number === currentStep)?.labelKey;
  const label = labelKey ? t(`steps.${labelKey}`) : "";
  const total = ONBOARDING_STEPS.length;

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-white border-b border-neutral-100 flex-shrink-0">
      <Link href="/dashboard" className="hover:opacity-90 transition-opacity">
        <Brand />
      </Link>
      <div className="flex flex-col items-end gap-1.5">
        <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider">
          {t("stepOf", { step: currentStep, total, label })}
        </span>
        <div className="w-28 h-1 bg-neutral-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / total) * 100}%` }}
          />
        </div>
      </div>
    </header>
  );
}
