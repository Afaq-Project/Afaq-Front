"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Step3SkillsLanguage } from "@/src/feature/onboarding/components/Step3SkillsLanguage";
import { useProfile } from "@/src/feature/profile/context/ProfileContext";
import type { SkillsData } from "@/src/feature/onboarding/types";

export default function Step3Page() {
  const router = useRouter();
  const { profile, updateSkills } = useProfile();

  const [skills, setSkills] = useState<SkillsData>({
    skills: profile.skills.skills || ["Python", "Data Analysis"],
    languages:
      profile.skills.languages.length > 0
        ? profile.skills.languages
        : [
            { id: "lang-1", language: "English", level: "C2 Proficient" },
          ],
  });

  useEffect(() => {
    if (profile.skills.skills.length > 0 || profile.skills.languages.length > 0) {
      setSkills({
        skills: profile.skills.skills || [],
        languages: profile.skills.languages || [],
      });
    }
  }, [profile.skills]);

  const handleNext = () => {
    updateSkills(skills);
    router.push("/onboarding/step-4");
  };

  const handleBack = () => {
    router.push("/onboarding/step-2");
  };

  const handleSkip = () => {
    updateSkills(skills);
    router.push("/onboarding/step-4");
  };

  return (
    <Step3SkillsLanguage
      data={skills}
      onChange={setSkills}
      onNext={handleNext}
      onBack={handleBack}
      onSkip={handleSkip}
    />
  );
}
