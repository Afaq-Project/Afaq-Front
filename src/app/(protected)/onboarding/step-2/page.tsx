"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Step2Education } from "@/src/feature/onboarding/components/Step2BackgroundGoals";
import { useProfile } from "@/src/feature/profile/context/ProfileContext";
import type { EducationData, PreferencesData } from "@/src/feature/onboarding/types";
import { useEducationLevels } from "@/src/shared/lib/api/hooks/useReferenceData";

export default function Step2Page() {
  const router = useRouter();
  const { profile, updateEducation, updatePreferences } = useProfile();

  const [education, setEducation] = useState<EducationData>({
    educationLevel: profile.education.educationLevel || "",
    fieldsOfStudy: profile.education.fieldsOfStudy || [],
    educationLevelId: profile.education.educationLevelId,
    fieldIds: profile.education.fieldIds,
    institutionName: profile.education.institutionName,
    institutionId: profile.education.institutionId,
    gpa: profile.education.gpa,
    gpaScale: profile.education.gpaScale ?? "4.0",
    startDate: profile.education.startDate,
    endDate: profile.education.endDate,
    expectedGraduationDate: profile.education.expectedGraduationDate,
    isCurrent: profile.education.isCurrent,
  });

  const [preferences, setPreferences] = useState<PreferencesData>({
    targetDegreeLevel: profile.preferences?.targetDegreeLevel,
    targetDegreeLevelId: profile.preferences?.targetDegreeLevelId,
    targetFields: profile.preferences?.targetFields ?? [],
    targetFieldIds: profile.preferences?.targetFieldIds ?? [],
    targetCountries: profile.preferences?.targetCountries ?? [],
    targetCountryIds: profile.preferences?.targetCountryIds ?? [],
    targetInstitutions: profile.preferences?.targetInstitutions ?? [],
    targetInstitutionIds: profile.preferences?.targetInstitutionIds ?? [],
  });

  const { data: educationLevels = [], isLoading: loadingLevels } = useEducationLevels();

  const handleNext = () => {
    updateEducation(education);
    updatePreferences(preferences);
    router.push("/onboarding/step-3");
  };

  return (
    <Step2Education
      educationData={education}
      preferencesData={preferences}
      onEducationChange={setEducation}
      onPreferencesChange={setPreferences}
      onNext={handleNext}
      onBack={() => router.push("/onboarding/step-1")}
      referenceData={{ educationLevels, isLoading: loadingLevels }}
    />
  );
}
