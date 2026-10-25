"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProficiencyLevels } from "@/src/shared/lib/api/hooks/useReferenceData";
import { useOnboardingDraft } from "../../context/OnboardingDraftContext";
import { useStepSave } from "../../hooks/useStepSave";
import { initialSkills } from "../../services/initialState";
import { saveSkills } from "../../services/onboardingSync";
import { stepPath } from "../../services/steps";
import type { ProficiencyOption, SkillsData } from "../../types";
import { OnboardingFooter } from "../layout/OnboardingFooter";
import { LanguagesSection } from "./LanguagesSection";
import { SkillsSection } from "./SkillsSection";
import { useReferenceName } from "@/src/shared/lib/api/hooks/useReferenceName";
import { useTranslations } from "next-intl";

/** Step 3 (optional): holds skills and languages and saves them on Next. */
export function SkillsStep() {
  const t = useTranslations("onboarding.skills");
  const { name: refName } = useReferenceName();
  const router = useRouter();
  const { draft, updateSkills } = useOnboardingDraft();
  const { isSaving, error, run } = useStepSave();

  const [skills, setSkills] = useState<SkillsData>(() => initialSkills(draft));

  // Only real levels from the API — their IDs are what the backend validates.
  const { data: rawLevels = [] } = useProficiencyLevels();
  const proficiencyLevels: ProficiencyOption[] = rawLevels.map((p) => ({
    id: p.id,
    name: refName(p),
    native: p.nameEn.toLowerCase().includes("native"),
  }));

  const handleNext = () =>
    run(
      () => saveSkills(draft.skills, skills),
      () => {
        updateSkills(skills);
        router.push(stepPath(4));
      },
    );

  return (
    <div className="flex flex-col flex-grow">
      <main className="flex-grow w-full max-w-4xl mx-auto px-6 pt-8 pb-24 flex flex-col gap-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-on-surface mb-2 tracking-tight">
            {t("title")}
          </h1>
          <p className="text-sm text-on-surface-variant">
            {t("subtitle")}
          </p>
        </div>

        <SkillsSection
          skills={skills.skills}
          skillIds={skills.skillIds ?? []}
          onChange={(names, ids) => setSkills((s) => ({ ...s, skills: names, skillIds: ids }))}
        />
        <LanguagesSection
          languages={skills.languages}
          proficiencyLevels={proficiencyLevels}
          onChange={(languages) => setSkills((s) => ({ ...s, languages }))}
        />
      </main>

      <OnboardingFooter
        onNext={handleNext}
        onBack={() => router.push(stepPath(2))}
        onSkip={() => router.push(stepPath(4))}
        isSaving={isSaving}
        saveError={error}
      />
    </div>
  );
}
