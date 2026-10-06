import type { ApiPreferences } from "../types/api";
import { profileService } from "./profileService";

/** Target preferences as plain ID lists. Target countries have no API endpoint, so they're not here. */
export interface PreferenceIds {
  degrees: string[];
  majors: string[];
  institutions: string[];
}

export function preferenceIdsFromApi(preferences?: ApiPreferences): PreferenceIds {
  return {
    degrees: (preferences?.targetDegrees ?? []).map((d) => d.educationLevelId),
    majors: (preferences?.targetMajors ?? []).map((m) => m.majorId),
    institutions: (preferences?.targetInstitutions ?? []).map((i) => i.institutionId),
  };
}

/** Items in `next` missing from the server, and items in `removable` dropped from `next` that the server still has. */
function diffIds(removable: string[], next: string[], server: string[]) {
  return {
    toAdd: next.filter((id) => !server.includes(id)),
    toRemove: removable.filter((id) => !next.includes(id) && server.includes(id)),
  };
}

/**
 * Brings the server's preferences to `next` using the per-item endpoints (there is no bulk
 * update). Only IDs listed in `removable` are ever deleted, so a caller can protect items it
 * didn't add. Resolves to the number of requests made.
 */
export async function applyPreferenceChanges(
  server: PreferenceIds,
  removable: PreferenceIds,
  next: PreferenceIds,
): Promise<number> {
  const degrees = diffIds(removable.degrees, next.degrees, server.degrees);
  const majors = diffIds(removable.majors, next.majors, server.majors);
  const institutions = diffIds(removable.institutions, next.institutions, server.institutions);

  const requests = [
    ...degrees.toRemove.map(profileService.removeTargetDegree),
    ...degrees.toAdd.map(profileService.addTargetDegree),
    ...majors.toRemove.map(profileService.removeTargetMajor),
    ...majors.toAdd.map(profileService.addTargetMajor),
    ...institutions.toRemove.map(profileService.removeTargetInstitution),
    ...institutions.toAdd.map(profileService.addTargetInstitution),
  ];
  await Promise.all(requests);
  return requests.length;
}
