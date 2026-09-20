"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Step1Education } from "@/src/feature/onboarding/components/Step1Education";
import { useProfile } from "@/src/feature/profile/context/ProfileContext";
import type { EducationData } from "@/src/feature/onboarding/types";

export default function Step1Page() {
  const router = useRouter();
  const { profile, updateEducation } = useProfile();

  const [education, setEducation] = useState<EducationData>({
    educationLevel: profile.education.educationLevel || "",
    fieldsOfStudy: profile.education.fieldsOfStudy || [],
    nationality: profile.education.nationality || "",
  });

  const handleNext = () => {
    updateEducation(education);
    router.push("/onboarding/step-2");
  };

  return (
    <Step1Education
      data={education}
      onChange={setEducation}
      onNext={handleNext}
    />
  );
}
