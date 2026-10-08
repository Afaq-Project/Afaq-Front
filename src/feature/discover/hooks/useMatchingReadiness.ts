"use client";

import { usePreferencesQuery, useProfileQuery } from "@/src/feature/profile/hooks/useProfileQuery";

export interface MissingField {
  label: string;
  /** Profile section where it's filled in. */
  href: string;
}

/**
 * Whether the profile has the three fields matching needs (FR-3.11): education level, field of
 * study (target majors) and nationality. Returns the first one missing, or null. If the profile
 * can't be loaded it doesn't block results, since the gap is unknown rather than confirmed.
 */
export function useMatchingReadiness() {
  const profileQuery = useProfileQuery();
  const preferencesQuery = usePreferencesQuery();
  const profile = profileQuery.data;
  const preferences = preferencesQuery.data;

  const isLoading = profileQuery.isPending || preferencesQuery.isPending;
  const failed = profileQuery.isError || preferencesQuery.isError;

  let missing: MissingField | null = null;
  if (!isLoading && !failed) {
    if (!profile?.educationLevelId) missing = { label: "education level", href: "/profile#education" };
    else if ((preferences?.targetMajors?.length ?? 0) === 0) missing = { label: "field of study", href: "/profile#background" };
    else if (!profile?.nationalityId) missing = { label: "nationality", href: "/profile#background" };
  }

  return { isLoading, missing };
}
