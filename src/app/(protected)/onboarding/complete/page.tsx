"use client";

import React from "react";
import { OnboardingComplete } from "@/src/feature/onboarding/components/OnboardingComplete";
import { useProfile } from "@/src/feature/profile/context/ProfileContext";

export default function CompletePage() {
  const { profile, completionPercentage } = useProfile();

  // Dynamic progress score
  const calculateScore = (): number => {
    let score = 40; // Base score for completing Step 1
    if (profile.background.gpa || profile.background.experienceLevel !== "none") score += 15;
    if (profile.skills.skills.length > 0) score += 15;
    if (profile.skills.languages.length > 0) score += 10;
    const hasDocs = Object.values(profile.documents).some(
      (d) => d !== null && d.status === "uploaded"
    );
    if (hasDocs) score += 15;
    return Math.min(100, Math.max(65, score || completionPercentage));
  };

  return <OnboardingComplete completionPercentage={calculateScore()} />;
}
