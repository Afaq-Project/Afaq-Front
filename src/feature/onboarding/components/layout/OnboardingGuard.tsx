"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { useOnboardingProgress } from "../../hooks/useOnboardingProgress";
import { isOnboardingFinished } from "../../services/onboardingStatus";
import { COMPLETE_PATH, stepPath } from "../../services/steps";

interface OnboardingGuardProps {
  /** 1–4 for the steps, 5 for the complete page. */
  step: number;
  children: ReactNode;
}

/**
 * Keeps users from reaching a step (via URL or history) before finishing the required ones,
 * and from going back to the steps once onboarding is finished.
 */
export function OnboardingGuard({ step, children }: OnboardingGuardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const { isLoading, isError, retry, firstIncompleteStep } = useOnboardingProgress();

  // Once finished, every step leads to the complete page.
  const finishedRedirect = step >= 1 && step <= 4 && isOnboardingFinished(user?.id);

  // Step 1 is always open; every later step needs progress confirmed by the server.
  const needsCheck = step > 1;
  const blockedBy =
    needsCheck && !isLoading && !isError && firstIncompleteStep !== null && step > firstIncompleteStep
      ? firstIncompleteStep
      : null;

  useEffect(() => {
    if (finishedRedirect) {
      router.replace(COMPLETE_PATH);
    } else if (blockedBy !== null) {
      router.replace(stepPath(blockedBy));
    }
  }, [finishedRedirect, blockedBy, router]);

  if (finishedRedirect) return <GuardSpinner />;
  if (!needsCheck) return <>{children}</>;

  // Fail closed: if progress can't be confirmed, don't open the step.
  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center" role="alert">
        <p className="text-sm text-on-surface-variant">We couldn&apos;t check your progress.</p>
        <button
          type="button"
          onClick={retry}
          className="cursor-pointer rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary hover:opacity-90"
        >
          Try again
        </button>
      </div>
    );
  }

  if (isLoading || blockedBy !== null) return <GuardSpinner />;

  return <>{children}</>;
}

function GuardSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background" role="status" aria-label="Loading">
      <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
    </div>
  );
}
