import { isAxiosError } from "axios";
import { applyPreferenceChanges, preferenceIdsFromApi } from "@/src/feature/profile/services/preferences";
import { profileService } from "@/src/feature/profile/services/profileService";
import type { CreateEducationPayload, UpdatePersonalPayload } from "@/src/feature/profile/types/api";
import type { PersonalInfoData, EducationData, PreferencesData, SkillsData } from "../types";
import { DEFAULT_GPA_SCALE } from "@/src/shared/lib/education";
import { validId } from "./ids";

// Each step is saved when the user leaves it. `prev` is what onboarding last saved (the draft),
// `next` is what the user has now. A save only calls the API for the parts that changed, and
// only removes items onboarding itself saved before, so data added from the profile page is
// never deleted by re-running onboarding.
//
// Every save resolves to `true` when it wrote something, `false` when there was nothing to send.

function isNotFound(error: unknown): boolean {
  return isAxiosError(error) && error.response?.status === 404;
}

/** Order-insensitive for object keys, so two payloads built in different orders compare equal. */
function sameJson(a: unknown, b: unknown): boolean {
  const stable = (value: unknown): unknown =>
    Array.isArray(value)
      ? value.map(stable)
      : value && typeof value === "object"
      ? Object.fromEntries(
          Object.entries(value)
            .sort(([x], [y]) => x.localeCompare(y))
            .map(([k, v]) => [k, stable(v)]),
        )
      : value;
  return JSON.stringify(stable(a)) === JSON.stringify(stable(b));
}

/** Items in `next` that are not on the server, and items dropped since `prev` that still are. */
function diffIds(prev: string[], next: string[], server: string[]) {
  return {
    toAdd: next.filter((id) => !server.includes(id)),
    toRemove: prev.filter((id) => !next.includes(id) && server.includes(id)),
  };
}

// ─── Step 1 ───────────────────────────────────────────────────────────────────
function personalPayload(personal: PersonalInfoData): UpdatePersonalPayload {
  return {
    ...(personal.firstName && { firstName: personal.firstName }),
    ...(personal.lastName && { lastName: personal.lastName }),
    ...(personal.dateOfBirth && { dateOfBirth: personal.dateOfBirth }),
    ...(personal.gender && { gender: personal.gender.toUpperCase() }),
    ...(personal.maritalStatusId && { maritalStatusId: personal.maritalStatusId }),
    ...(personal.nationalityId && { nationalityId: personal.nationalityId }),
    ...(personal.countryOfResidenceId && { countryOfResidenceId: personal.countryOfResidenceId }),
    ...(personal.currentCityId && { currentCityId: personal.currentCityId }),
  };
}

export async function savePersonal(prev: PersonalInfoData, next: PersonalInfoData): Promise<boolean> {
  const payload = personalPayload(next);
  if (Object.keys(payload).length === 0 || sameJson(payload, personalPayload(prev))) return false;
  await profileService.updatePersonal(payload);
  return true;
}

// ─── Step 2 ───────────────────────────────────────────────────────────────────
function educationPayload(education: EducationData): CreateEducationPayload | null {
  const educationLevelId = validId(education.educationLevelId);
  const [majorId, minorMajorId] = education.fieldIds ?? [];
  if (!educationLevelId && !education.institutionId && !majorId) return null;

  return {
    ...(educationLevelId && { educationLevelId }),
    ...(education.institutionId && { institutionId: education.institutionId }),
    ...(majorId && { majorId }),
    ...(minorMajorId && { minorMajorId }),
    ...(education.gpa && !Number.isNaN(parseFloat(education.gpa)) && {
      gpaRaw: parseFloat(education.gpa),
      gpaScale: education.gpaScale ?? DEFAULT_GPA_SCALE,
    }),
    ...(education.startDate && { startDate: education.startDate }),
    ...(education.isCurrent && education.expectedGraduationDate && {
      expectedGraduationDate: education.expectedGraduationDate,
    }),
    ...(!education.isCurrent && education.endDate && { endDate: education.endDate }),
    isCurrent: education.isCurrent ?? false,
  };
}

/** Saves the education step and returns the server ID of the education record. */
export async function saveEducation(
  prev: EducationData,
  next: EducationData,
): Promise<{ serverId?: string; changed: boolean }> {
  let changed = false;

  // The profile's current level mirrors the education level picked here.
  const levelId = validId(next.educationLevelId);
  if (levelId && levelId !== validId(prev.educationLevelId)) {
    await profileService.updatePersonal({ educationLevelId: levelId });
    changed = true;
  }

  const payload = educationPayload(next);
  const unchanged = next.serverId && sameJson(payload, educationPayload(prev));
  if (!payload || unchanged) return { serverId: next.serverId, changed };

  if (next.serverId) {
    try {
      await profileService.updateEducation(next.serverId, payload);
      return { serverId: next.serverId, changed: true };
    } catch (error) {
      // The record was deleted from the profile page — fall through and recreate it.
      if (!isNotFound(error)) throw error;
    }
  }

  const created = await profileService.createEducation(payload);
  return { serverId: created.id, changed: true };
}

function preferenceIds(preferences: PreferencesData) {
  const degree = validId(preferences.targetDegreeLevelId);
  return {
    degrees: degree ? [degree] : [],
    majors: preferences.targetFieldIds ?? [],
    institutions: preferences.targetInstitutionIds ?? [],
  };
}

export async function savePreferences(prev: PreferencesData, next: PreferencesData): Promise<boolean> {
  // Target countries are not part of this: the API has no endpoint for them.
  const before = preferenceIds(prev);
  const after = preferenceIds(next);
  if (sameJson(before, after)) return false;

  // Only remove what onboarding itself saved before (`before`), never preferences added elsewhere.
  const server = preferenceIdsFromApi(await profileService.getPreferences());
  return (await applyPreferenceChanges(server, before, after)) > 0;
}

// ─── Step 3 ───────────────────────────────────────────────────────────────────
function languageEntries(skills: SkillsData) {
  return skills.languages
    .filter((l) => l.languageId && l.proficiencyLevelId)
    .map((l) => ({
      languageId: l.languageId!,
      proficiencyLevelId: l.proficiencyLevelId!,
      isNative: l.isNative ?? false,
    }));
}

export async function saveSkills(prev: SkillsData, next: SkillsData): Promise<boolean> {
  let changed = false;

  // Skills are stored as `experiences` (major IDs) and replaced as a whole.
  const prevSkillIds = (prev.skillIds ?? []).filter(Boolean);
  const skillIds = (next.skillIds ?? []).filter(Boolean);
  if (!sameJson(prevSkillIds, skillIds)) {
    await profileService.updatePersonal({ experiences: skillIds });
    changed = true;
  }

  const prevLangs = languageEntries(prev);
  const nextLangs = languageEntries(next);
  if (sameJson(prevLangs, nextLangs)) return changed;

  const server = await profileService.listLanguages();
  const serverById = new Map(server.map((l) => [l.languageId, l]));
  const { toRemove } = diffIds(
    prevLangs.map((l) => l.languageId),
    nextLangs.map((l) => l.languageId),
    server.map((l) => l.languageId),
  );

  const requests = [
    ...toRemove.map(profileService.deleteLanguage),
    ...nextLangs.flatMap((l) => {
      const existing = serverById.get(l.languageId);
      if (!existing) return [profileService.addLanguage(l)];
      if (existing.proficiencyLevelId !== l.proficiencyLevelId || existing.isNative !== l.isNative) {
        return [
          profileService.updateLanguage(l.languageId, {
            proficiencyLevelId: l.proficiencyLevelId,
            isNative: l.isNative,
          }),
        ];
      }
      return [];
    }),
  ];
  await Promise.all(requests);
  return changed || requests.length > 0;
}
