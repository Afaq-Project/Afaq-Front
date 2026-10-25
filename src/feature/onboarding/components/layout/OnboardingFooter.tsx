"use client";

import { useTranslations } from "next-intl";
interface OnboardingFooterProps {
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  nextIcon?: string;
  /** Disables Next only, e.g. while required fields are empty. */
  nextDisabled?: boolean;
  /** Disables every action and shows progress on Next. */
  isSaving?: boolean;
  saveError?: string | null;
}

export function OnboardingFooter({
  onNext,
  onBack,
  onSkip,
  nextLabel,
  nextIcon = "arrow_forward",
  nextDisabled = false,
  isSaving = false,
  saveError,
}: OnboardingFooterProps) {
  const t = useTranslations("onboarding");
  // The default arrow points forward, so it mirrors in Arabic; a check mark doesn't.
  const mirrorIcon = nextIcon.startsWith("arrow");

  return (
    <>
      {saveError && (
        <p
          role="alert"
          className="mx-6 mb-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {saveError}
        </p>
      )}
      <nav className="sticky bottom-0 z-30 mt-auto flex w-full items-center justify-between border-t border-neutral-200/80 bg-white/95 px-6 py-4 shadow-[0_-4px_16px_rgba(0,0,0,0.04)] backdrop-blur-md">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={isSaving}
              className="flex cursor-pointer items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-50 md:py-2"
            >
              <span className="material-symbols-outlined text-[18px] rtl:-scale-x-100">arrow_back</span>
              {t("back")}
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              disabled={isSaving}
              className="cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-container/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("skip")}
            </button>
          )}
          <button
            type="button"
            onClick={onNext}
            disabled={nextDisabled || isSaving}
            aria-busy={isSaving}
            className="flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-on-primary shadow-sm transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
          >
            {isSaving ? t("saving") : (nextLabel ?? t("next"))}
            {!isSaving && (
              <span className={`material-symbols-outlined text-[18px] ${mirrorIcon ? "rtl:-scale-x-100" : ""}`}>{nextIcon}</span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
