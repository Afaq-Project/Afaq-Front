"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Step2Education } from "@/src/feature/onboarding/components/Step2BackgroundGoals";
import { useProfile } from "@/src/feature/profile/context/ProfileContext";
import type { EducationData } from "@/src/feature/onboarding/types";
import { useEducationLevels } from "@/src/shared/lib/api/hooks/useReferenceData";

export default function Step2Page() {
  const router = useRouter();
  const { profile, updateEducation } = useProfile();

  const [education, setEducation] = useState<EducationData>({
    educationLevel: profile.education.educationLevel || "",
    fieldsOfStudy: profile.education.fieldsOfStudy || [],
    nationality: profile.education.nationality || "",
    educationLevelId: profile.education.educationLevelId,
    fieldIds: profile.education.fieldIds,
    nationalityId: profile.education.nationalityId,
    institutionName: profile.education.institutionName,
    institutionId: profile.education.institutionId,
    gpa: profile.education.gpa,
    gpaScale: profile.education.gpaScale,
    startDate: profile.education.startDate,
    endDate: profile.education.endDate,
    expectedGraduationDate: profile.education.expectedGraduationDate,
    isCurrent: profile.education.isCurrent,
  });

  const { data: educationLevels = [], isLoading: loadingLevels } = useEducationLevels();

  const handleNext = () => {
    updateEducation(education);
    router.push("/onboarding/step-3");
  };

  return (
    <Step2Education
      data={education}
      onChange={setEducation}
      onNext={handleNext}
      onBack={() => router.push("/onboarding/step-1")}
      referenceData={{ educationLevels, isLoading: loadingLevels }}
    />
  );
}
