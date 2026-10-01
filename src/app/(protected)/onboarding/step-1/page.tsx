"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Step1BasicInfo } from "@/src/feature/onboarding/components/Step1BasicInfo";
import { useProfile } from "@/src/feature/profile/context/ProfileContext";
import type { PersonalInfoData } from "@/src/feature/onboarding/types";

export default function Step1Page() {
  const router = useRouter();
  const { profile, updatePersonal } = useProfile();

  const [personal, setPersonal] = useState<PersonalInfoData>({
    firstName: profile.personal?.firstName ?? "",
    lastName: profile.personal?.lastName ?? "",
    dateOfBirth: profile.personal?.dateOfBirth ?? "",
    gender: profile.personal?.gender ?? "",
    maritalStatus: profile.personal?.maritalStatus ?? "",
    maritalStatusId: profile.personal?.maritalStatusId ?? "",
    countryOfResidence: profile.personal?.countryOfResidence ?? "",
    countryOfResidenceId: profile.personal?.countryOfResidenceId ?? "",
    currentCity: profile.personal?.currentCity ?? "",
    currentCityId: profile.personal?.currentCityId ?? "",
  });

  const handleNext = () => {
    updatePersonal(personal);
    router.push("/onboarding/step-2");
  };

  return (
    <Step1BasicInfo
      data={personal}
      onChange={setPersonal}
      onNext={handleNext}
      onSkip={handleNext}
    />
  );
}
