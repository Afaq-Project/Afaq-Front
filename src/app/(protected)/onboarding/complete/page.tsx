"use client";

import React from "react";
import { OnboardingComplete } from "@/src/feature/onboarding/components/OnboardingComplete";
import { useProfileQuery } from "@/src/feature/profile/hooks/useProfileQuery";

export default function CompletePage() {
  const { data: profile } = useProfileQuery();
  return <OnboardingComplete completionPercentage={profile?.completionPct ?? 0} />;
}
