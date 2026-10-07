"use client";

import { useQuery } from "@tanstack/react-query";
import { PROFILE_QUERY_KEY, usePreferencesQuery } from "@/src/feature/profile/hooks/useProfileQuery";
import { profileService } from "@/src/feature/profile/services/profileService";

/**
 * Which required onboarding steps are complete, judged from the server profile (not the local
 * draft) so it holds for returning users and across devices. Mirrors the required fields of
 * steps 1 and 2; steps 3 and 4 have no required fields.
 */
export function useOnboardingProgress() {
  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: profileService.getProfile,
  });
  const preferencesQuery = usePreferencesQuery();

  const profile = profileQuery.data;
  const preferences = preferencesQuery.data;

  const step1Done = Boolean(
    profile?.firstName &&
      profile.lastName &&
      profile.dateOfBirth &&
      profile.nationalityId &&
      profile.countryOfResidenceId,
  );

  const hasEducationLevel = Boolean(profile?.educationLevelId);
  const hasTargetPreferences =
    (preferences?.targetDegrees?.length ?? 0) > 0 && (preferences?.targetMajors?.length ?? 0) > 0;
  const step2Done = hasEducationLevel && hasTargetPreferences;

  return {
    isLoading: profileQuery.isPending || preferencesQuery.isPending,
    isError: profileQuery.isError || preferencesQuery.isError,
    retry: () => {
      if (profileQuery.isError) profileQuery.refetch();
      if (preferencesQuery.isError) preferencesQuery.refetch();
    },
    step1Done,
    step2Done,
    hasEducationLevel,
    hasTargetPreferences,
    /** First step whose required data is missing, or null when steps 1–2 are done. */
    firstIncompleteStep: !step1Done ? 1 : !step2Done ? 2 : null,
  };
}
