"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useEducationLevels } from "@/src/shared/lib/api/hooks/useReferenceData";
import { useOnboardingDraft } from "../../context/OnboardingDraftContext";
import { useOnboardingProgress } from "../../hooks/useOnboardingProgress";
import { useStepSave } from "../../hooks/useStepSave";
import { initialEducation, initialPreferences } from "../../services/initialState";
import { saveEducation, savePreferences } from "../../services/onboardingSync";
import { stepPath } from "../../services/steps";
import { validateEducationStep } from "../../services/validation";
import type { EducationData, Option, PreferencesData } from "../../types";
import { OnboardingFooter } from "../layout/OnboardingFooter";
import { CurrentEducationSection } from "./CurrentEducationSection";
import { StudyGoalsSection } from "./StudyGoalsSection";

/** Step 2: holds the education and goals forms and saves both on Next. */
export function EducationStep() {
  const router = useRouter();
  const { draft, updateEducation, updatePreferences } = useOnboardingDraft();
  const { hasEducationLevel, hasTargetPreferences } = useOnboardingProgress();
  const { isSaving, error, run } = useStepSave();

  const [education, setEducation] = useState<EducationData>(() => initialEducation(draft));
  const [preferences, setPreferences] = useState<PreferencesData>(() => initialPreferences(draft));

  // Only real levels from the API are selectable — their IDs are what the backend validates.
  const { data: rawLevels = [], isLoading: loadingLevels } = useEducationLevels();
  const educationLevels: Option[] = rawLevels.map((l) => ({ id: l.id, name: l.nameEn }));

  const { isHighSchool, gpaInvalid, periodInvalid, isComplete } = validateEducationStep(education, preferences);

  // For any part the server is missing, compare against nothing so it is always sent —
  // skipping it as "unchanged" would leave the user stuck behind the onboarding guard.
  const prevEducation = hasEducationLevel ? draft.education : { ...draft.education, educationLevelId: undefined };
  const prevPreferences = hasTargetPreferences ? draft.preferences : {};

  const handleNext = () =>
    run(
      async () => {
        const { serverId, changed: educationChanged } = await saveEducation(prevEducation, education);
        // Remember what was saved right away, so a retry after a preferences failure neither
        // re-sends the education nor creates a duplicate record.
        const saved = { ...education, serverId };
        setEducation(saved);
        updateEducation(saved);
        const preferencesChanged = await savePreferences(prevPreferences, preferences);
        return educationChanged || preferencesChanged;
      },
      () => {
        updatePreferences(preferences);
        router.push(stepPath(3));
      },
    );

  return (
    <div className="flex flex-col flex-grow">
      <main className="flex flex-col flex-grow gap-10 mx-auto px-6 pt-8 pb-24 w-full max-w-3xl">
        <h1 className="font-semibold text-on-surface text-2xl md:text-3xl tracking-tight">Education</h1>

        <CurrentEducationSection
          education={education}
          onChange={setEducation}
          educationLevels={educationLevels}
          loadingLevels={loadingLevels}
          isHighSchool={isHighSchool}
          gpaInvalid={gpaInvalid}
          periodInvalid={periodInvalid}
        />
        <StudyGoalsSection
          preferences={preferences}
          onChange={setPreferences}
          educationLevels={educationLevels}
          loadingLevels={loadingLevels}
        />
      </main>

      <OnboardingFooter
        onNext={handleNext}
        onBack={() => router.push(stepPath(1))}
        nextDisabled={!isComplete}
        isSaving={isSaving}
        saveError={error}
      />
    </div>
  );
}
