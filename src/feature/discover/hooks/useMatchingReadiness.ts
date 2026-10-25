"use client";

import { usePreferencesQuery, useProfileQuery } from "@/src/feature/profile/hooks/useProfileQuery";

export interface MissingField {
  label: string;
  /** Profile section where it's filled in. */
  href: string;
}

/**
 * Whether the profile can be matched (FR-3.11). The backend's `isMatchable` decides when the
 * profile carries it; the three fields matching needs (education level, field of study, i.e.
 * target majors, and nationality) name what's missing. Returns the first one missing, or null.
 * If the profile can't be loaded, it counts as ready, since the gap is unknown rather than confirmed.
 */
export function useMatchingReadiness() {
  const profileQuery = useProfileQuery();
  const preferencesQuery = usePreferencesQuery();
  const profile = profileQuery.data;
  const preferences = preferencesQuery.data;

  const isLoading = profileQuery.isPending || preferencesQuery.isPending;
  const failed = profileQuery.isError || preferencesQuery.isError;

  let missing: MissingField | null = null;
  if (!isLoading && !failed && profile?.isMatchable !== true) {
    if (!profile?.educationLevelId) missing = { label: "education level", href: "/profile#education" };
    else if ((preferences?.targetMajors?.length ?? 0) === 0) missing = { label: "field of study", href: "/profile#background" };
    else if (!profile?.nationalityId) missing = { label: "nationality", href: "/profile#background" };
    // The backend says no but all three are filled in: point at the profile as a whole.
    else if (profile?.isMatchable === false) missing = { label: "profile", href: "/profile" };
  }

  return { isLoading, missing };
}
