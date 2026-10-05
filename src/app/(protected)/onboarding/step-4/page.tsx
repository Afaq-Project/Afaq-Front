"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Step4Documents, type Step4DocumentsState, type DocumentSlotKey } from "@/src/feature/onboarding/components/Step4Documents";
import { useProfile } from "@/src/feature/profile/context/ProfileContext";
import { profileService } from "@/src/feature/profile/services/profileService";
import { useDocumentTypes } from "@/src/shared/lib/api/hooks/useReferenceData";

const IDLE_SLOT = { status: "idle" as const, progress: 0 };

const INITIAL_STATE: Step4DocumentsState = {
  resume: IDLE_SLOT,
  essay: IDLE_SLOT,
  transcript: IDLE_SLOT,
  recommendation: IDLE_SLOT,
  other: IDLE_SLOT,
};

function mapGpaScale(scale: string): string {
  if (scale === "4.0") return "OUT_OF_4";
  if (scale === "percent") return "PERCENTAGE";
  return "LETTER_GRADE";
}

export default function Step4Page() {
  const router = useRouter();
  const { profile } = useProfile();
  const [state, setState] = useState<Step4DocumentsState>(INITIAL_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: documentTypes = [], isLoading: loadingDocTypes } = useDocumentTypes();

  const handleUpload = async (_slotKey: DocumentSlotKey, file: File, documentTypeId: string): Promise<string> => {
    const doc = await profileService.uploadDocument(documentTypeId, file);
    return doc.id;
  };

  const handleDeleteDoc = async (apiId: string) => {
    await profileService.deleteDocument(apiId);
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    try {
      const { education, background, skills, personal } = profile;

      // 1. Update personal info — Step 1 personal fields + Step 2 nationality/education level + Step 3 skills
      const experienceIds = (skills.skillIds ?? []).filter(Boolean);
      await profileService.updatePersonal({
        ...(personal.firstName && { firstName: personal.firstName }),
        ...(personal.lastName && { lastName: personal.lastName }),
        ...(personal.dateOfBirth && { dateOfBirth: personal.dateOfBirth }),
        ...(personal.gender && { gender: personal.gender }),
        ...(personal.maritalStatusId && { maritalStatusId: personal.maritalStatusId }),
        ...(personal.countryOfResidenceId && { countryOfResidenceId: personal.countryOfResidenceId }),
        ...(personal.currentCityId && { currentCityId: personal.currentCityId }),
        ...(education.nationalityId && { nationalityId: education.nationalityId }),
        ...(education.educationLevelId && { educationLevelId: education.educationLevelId }),
        ...(background.phone && { phone: background.phone }),
        ...(background.bio && { bio: background.bio }),
        ...(experienceIds.length > 0 && { experiences: experienceIds }),
      });

      // 2. Create education record
      const primaryFieldId = education.fieldIds?.[0];
      const minorFieldId = education.fieldIds?.[1];
      if (primaryFieldId || education.educationLevelId || education.institutionId) {
        await profileService.createEducation({
          ...(education.educationLevelId && { educationLevelId: education.educationLevelId }),
          ...(education.institutionId && { institutionId: education.institutionId }),
          ...(primaryFieldId && { majorId: primaryFieldId }),
          ...(minorFieldId && { minorMajorId: minorFieldId }),
          ...(education.gpa && { gpaRaw: parseFloat(education.gpa), gpaScale: mapGpaScale(education.gpaScale ?? "4.0") }),
          ...(education.startDate && { startDate: education.startDate }),
          ...(education.isCurrent && education.expectedGraduationDate && { expectedGraduationDate: education.expectedGraduationDate }),
          ...(!education.isCurrent && education.endDate && { endDate: education.endDate }),
          isCurrent: education.isCurrent ?? false,
        });
      }

      // 3. Submit preferences
      const { preferences } = profile;
      if (
        preferences?.targetDegreeLevelId ||
        (preferences?.targetFieldIds?.length ?? 0) > 0 ||
        (preferences?.targetCountryIds?.length ?? 0) > 0 ||
        (preferences?.targetInstitutionIds?.length ?? 0) > 0
      ) {
        await profileService.updatePreferences({
          ...(preferences.targetDegreeLevelId && { targetDegreeIds: [preferences.targetDegreeLevelId] }),
          ...(preferences.targetFieldIds?.length && { targetMajorIds: preferences.targetFieldIds }),
          ...(preferences.targetCountryIds?.length && { targetCountryIds: preferences.targetCountryIds }),
          ...(preferences.targetInstitutionIds?.length && { targetInstitutionIds: preferences.targetInstitutionIds }),
        });
      }

      // 4. Add languages
      const languagesToSubmit = skills.languages.filter((l) => l.languageId && l.proficiencyLevelId);
      await Promise.all(
        languagesToSubmit.map((l) =>
          profileService.addLanguage({
            languageId: l.languageId!,
            proficiencyLevelId: l.proficiencyLevelId!,
            isNative: l.isNative ?? false,
          })
        )
      );

      router.push("/onboarding/complete");
    } catch (err) {
      console.error("Onboarding submission error:", err);
      router.push("/onboarding/complete");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Step4Documents
      state={state}
      onChange={setState}
      onFinish={handleFinish}
      onBack={() => router.push("/onboarding/step-3")}
      onSkip={() => router.push("/onboarding/complete")}
      referenceData={{ documentTypes, isLoading: loadingDocTypes }}
      onUpload={handleUpload}
      onDeleteDoc={handleDeleteDoc}
    />
  );
}
