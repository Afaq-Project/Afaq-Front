import type { EducationData, PersonalInfoData, PreferencesData } from "../types";
import { isHighSchoolLevel } from "./educationLevel";
import { getGpaScale, isEndBeforeStart, isGpaOutOfRange } from "@/src/shared/lib/education";

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
  const gpaInvalid = isGpaOutOfRange(education.gpa, education.gpaScale);
  const periodEnd = education.isCurrent ? education.expectedGraduationDate : education.endDate;
  const periodInvalid = isEndBeforeStart(education.startDate, periodEnd);

  const isComplete =
    Boolean(education.educationLevelId) &&
    (isHighSchool || education.fieldsOfStudy.length > 0) &&
    Boolean(preferences.targetDegreeLevelId) &&
    (preferences.targetFieldIds?.length ?? 0) > 0 &&
    !gpaInvalid &&
    !periodInvalid;

  return { isHighSchool, gpaScale, gpaInvalid, periodInvalid, isComplete };
}
