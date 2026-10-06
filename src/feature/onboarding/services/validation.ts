import type { EducationData, PersonalInfoData, PreferencesData } from "../types";
import { isHighSchoolLevel } from "./educationLevel";
import { getGpaScale } from "./gpaScales";

/** Today as YYYY-MM-DD in the user's local time zone. */
export function todayIso(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────
export function validatePersonalInfo(personal: PersonalInfoData) {
  const today = todayIso();
  const dobInFuture = Boolean(personal.dateOfBirth && personal.dateOfBirth > today);

  const isComplete =
    Boolean(personal.firstName?.trim()) &&
    Boolean(personal.lastName?.trim()) &&
    Boolean(personal.dateOfBirth) &&
    !dobInFuture &&
    Boolean(personal.nationalityId) &&
    Boolean(personal.countryOfResidenceId);

  return { today, dobInFuture, isComplete };
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────
export function validateEducationStep(education: EducationData, preferences: PreferencesData) {
  // High-school students may not have a major yet, so Field of Study is optional for them.
  const isHighSchool = isHighSchoolLevel(education.educationLevel);

  const gpaScale = getGpaScale(education.gpaScale);
  const gpaValue = education.gpa ? Number(education.gpa) : undefined;
  const gpaInvalid =
    gpaValue !== undefined && (Number.isNaN(gpaValue) || gpaValue < 0 || gpaValue > gpaScale.max);

  const periodEnd = education.isCurrent ? education.expectedGraduationDate : education.endDate;
  const periodInvalid = Boolean(education.startDate && periodEnd && periodEnd < education.startDate);

  const isComplete =
    Boolean(education.educationLevelId) &&
    (isHighSchool || education.fieldsOfStudy.length > 0) &&
    Boolean(preferences.targetDegreeLevelId) &&
    (preferences.targetFieldIds?.length ?? 0) > 0 &&
    !gpaInvalid &&
    !periodInvalid;

  return { isHighSchool, gpaScale, gpaInvalid, periodInvalid, isComplete };
}
