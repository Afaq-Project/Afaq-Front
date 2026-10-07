"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { useOnboardingDraft } from "../context/OnboardingDraftContext";
import { markOnboardingFinished } from "../services/onboardingStatus";
import { COMPLETE_PATH } from "../services/steps";

/**
 * Steps 1–3 were saved as the user went and documents upload immediately, so finishing only
 * needs fresh profile data, a cleared draft, and closing the steps.
 */
export function useFinishOnboarding() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { clearDraft } = useOnboardingDraft();
  const [isFinishing, setIsFinishing] = useState(false);

  const finish = async () => {
    setIsFinishing(true);
    try {
      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      clearDraft();
      // From here on every onboarding URL leads to the complete page.
      markOnboardingFinished(user?.id);
      // Replace, so Back from the complete page doesn't return to the last step.
      router.replace(COMPLETE_PATH);
    } finally {
      setIsFinishing(false);
    }
  };

  return { finish, isFinishing };
}
