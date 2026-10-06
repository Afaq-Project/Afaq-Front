"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { useOnboardingDraft } from "../../context/OnboardingDraftContext";
import { useOnboardingProgress } from "../../hooks/useOnboardingProgress";
import { useStepSave } from "../../hooks/useStepSave";
import { initialPersonal } from "../../services/initialState";
import { savePersonal } from "../../services/onboardingSync";
import { stepPath } from "../../services/steps";
import { validatePersonalInfo } from "../../services/validation";
import type { PersonalInfoData } from "../../types";
import { OnboardingFooter } from "../layout/OnboardingFooter";
import { LocationSection } from "./LocationSection";
import { NameSection } from "./NameSection";
import { PersonalDetailsSection } from "./PersonalDetailsSection";

/** Step 1: holds the form state and saves it to the profile on Next. */
export function PersonalInfoStep() {
  const router = useRouter();
  const { user } = useAuth();
  const { draft, updatePersonal } = useOnboardingDraft();
  const { step1Done } = useOnboardingProgress();
  const { isSaving, error, run } = useStepSave();

  const [personal, setPersonal] = useState<PersonalInfoData>(() => initialPersonal(draft, user));
  const { today, dobInFuture, isComplete } = validatePersonalInfo(personal);

  const handleNext = () =>
    run(
      // While the server is missing step-1 data, send everything — skipping "unchanged"
      // fields would leave the user stuck behind the onboarding guard.
      () => savePersonal(step1Done ? draft.personal : {}, personal),
      () => {
        updatePersonal(personal);
        router.push(stepPath(2));
      },
    );

  return (
    <div className="flex flex-col flex-grow">
      <main className="flex-grow w-full max-w-3xl mx-auto px-6 pt-8 pb-24 flex flex-col gap-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-on-surface tracking-tight">
          Tell us about yourself
        </h1>
        <NameSection data={personal} onChange={setPersonal} />
        <LocationSection data={personal} onChange={setPersonal} />
        <PersonalDetailsSection
          data={personal}
          onChange={setPersonal}
          maxDateOfBirth={today}
          dobInFuture={dobInFuture}
        />
      </main>

      <OnboardingFooter
        onNext={handleNext}
        nextDisabled={!isComplete}
        isSaving={isSaving}
        saveError={error}
      />
    </div>
  );
}
