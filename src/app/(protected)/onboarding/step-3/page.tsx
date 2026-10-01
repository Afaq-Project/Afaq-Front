"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Step3SkillsLanguage } from "@/src/feature/onboarding/components/Step3SkillsLanguage";
import { useProfile } from "@/src/feature/profile/context/ProfileContext";
import type { SkillsData } from "@/src/feature/onboarding/types";
import { useProficiencyLevels } from "@/src/shared/lib/api/hooks/useReferenceData";

export default function Step3Page() {
  const router = useRouter();
  const { profile, updateSkills } = useProfile();

  const [skills, setSkills] = useState<SkillsData>({
    skills: profile.skills.skills || [],
    languages: profile.skills.languages.length > 0 ? profile.skills.languages : [],
  });

  const { data: proficiencyLevels = [], isLoading: loadingProf } = useProficiencyLevels();

  const handleNext = () => {
    updateSkills(skills);
    router.push("/onboarding/step-4");
  };

  return (
    <Step3SkillsLanguage
      data={skills}
      onChange={setSkills}
      onNext={handleNext}
      onBack={() => router.push("/onboarding/step-2")}
      onSkip={handleNext}
      referenceData={{ proficiencyLevels, isLoading: loadingProf }}
    />
  );
}
