import type { EducationData, OnboardingDraft, PersonalInfoData, PreferencesData, SkillsData } from "../types";
import { normalizeGpaScale } from "@/src/shared/lib/education";
import { validId } from "./ids";

// Builds each step's starting form state from the saved draft, fixing up values that older
// drafts may hold so the forms never start with data the API would reject.

export function initialPersonal(
  draft: OnboardingDraft,
  account?: { firstName?: string; lastName?: string } | null,
): PersonalInfoData {
  const p = draft.personal;
  return {
    // Names were already given at signup — start from those if the draft has none.
    firstName: p.firstName || account?.firstName || "",
    lastName: p.lastName || account?.lastName || "",
    dateOfBirth: p.dateOfBirth ?? "",
    gender: p.gender?.toUpperCase() ?? "",
    nationality: p.nationality ?? "",
    nationalityId: p.nationalityId ?? "",
    maritalStatus: p.maritalStatus ?? "",
    maritalStatusId: p.maritalStatusId ?? "",
    countryOfResidence: p.countryOfResidence ?? "",
    countryOfResidenceId: p.countryOfResidenceId ?? "",
    currentCity: p.currentCity ?? "",
    currentCityId: p.currentCityId ?? "",
  };
}

export function initialEducation(draft: OnboardingDraft): EducationData {
  const e = draft.education;
  // A level with a placeholder ID is cleared so the user re-picks a real one.
  const levelId = validId(e.educationLevelId);
  const legacyScale = e.gpaScale as string | undefined;

  return {
    serverId: e.serverId,
    educationLevel: levelId ? e.educationLevel || "" : "",
    educationLevelId: levelId,
    fieldsOfStudy: e.fieldsOfStudy || [],
    fieldIds: e.fieldIds,
    institutionName: e.institutionName,
    institutionId: e.institutionId,
    gpa: legacyScale === "letter" ? "" : e.gpa,
    gpaScale: normalizeGpaScale(legacyScale),
    startDate: e.startDate,
    endDate: e.endDate,
    expectedGraduationDate: e.expectedGraduationDate,
    isCurrent: e.isCurrent,
  };
}

export function initialPreferences(draft: OnboardingDraft): PreferencesData {
  const p = draft.preferences;
  const degreeId = validId(p.targetDegreeLevelId);

  return {
    targetDegreeLevel: degreeId ? p.targetDegreeLevel : undefined,
    targetDegreeLevelId: degreeId,
    targetFields: p.targetFields ?? [],
    targetFieldIds: p.targetFieldIds ?? [],
    targetCountries: p.targetCountries ?? [],
    targetCountryIds: p.targetCountryIds ?? [],
    targetInstitutions: p.targetInstitutions ?? [],
    targetInstitutionIds: p.targetInstitutionIds ?? [],
  };
}

export function initialSkills(draft: OnboardingDraft): SkillsData {
  const s = draft.skills;
  return {
    skills: s.skills || [],
    skillIds: s.skillIds,
    // Languages whose proficiency is a placeholder ID lose it, so the user re-picks a level.
    languages: (s.languages ?? []).map((l) =>
      validId(l.proficiencyLevelId) ? l : { ...l, proficiencyLevelId: undefined, level: "" },
    ),
  };
}
