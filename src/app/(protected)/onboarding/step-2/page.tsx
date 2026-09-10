"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Step2BackgroundGoals } from "@/src/feature/onboarding/components/Step2BackgroundGoals";
import { useProfile } from "@/src/feature/profile/context/ProfileContext";
import type { BackgroundData } from "@/src/feature/onboarding/types";

export default function Step2Page() {
  const router = useRouter();
  const { profile, updateBackground } = useProfile();

  const [background, setBackground] = useState<BackgroundData>({
    gpa: profile.background.gpa || "",
    gpaScale: profile.background.gpaScale || "4.0",
    experienceLevel: profile.background.experienceLevel || "entry",
    financialNeed: profile.background.financialNeed || "prefer_not",
    goals: profile.background.goals || "",
  });

  useEffect(() => {
    if (
      profile.background.gpa ||
      profile.background.goals ||
      profile.background.experienceLevel
    ) {
      setBackground({
        gpa: profile.background.gpa || "",
        gpaScale: profile.background.gpaScale || "4.0",
        experienceLevel: profile.background.experienceLevel || "entry",
        financialNeed: profile.background.financialNeed || "prefer_not",
        goals: profile.background.goals || "",
      });
    }
  }, [profile.background]);

  const handleNext = () => {
    updateBackground(background);
    router.push("/onboarding/step-3");
  };

  const handleBack = () => {
    router.push("/onboarding/step-1");
  };

  const handleSkip = () => {
    updateBackground(background);
    router.push("/onboarding/step-3");
  };

  return (
    <Step2BackgroundGoals
      data={background}
      onChange={setBackground}
      onNext={handleNext}
      onBack={handleBack}
      onSkip={handleSkip}
    />
  );
}
