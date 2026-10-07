"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { OnboardingDraftProvider } from "../../context/OnboardingDraftContext";
import { getStepFromPath } from "../../services/steps";
import { OnboardingGuard } from "./OnboardingGuard";
import { OnboardingShell } from "./OnboardingShell";

/**
 * Everything around an onboarding page: the draft, access control, and the visual shell.
 * The guard wraps the shell so the sidebar and step header never show a step the user
 * isn't allowed on, not even while access is being checked.
 */
export function OnboardingLayout({ children }: { children: ReactNode }) {
  const step = getStepFromPath(usePathname());

  return (
    <OnboardingDraftProvider>
      <OnboardingGuard step={step}>
        <OnboardingShell step={step}>{children}</OnboardingShell>
      </OnboardingGuard>
    </OnboardingDraftProvider>
  );
}
