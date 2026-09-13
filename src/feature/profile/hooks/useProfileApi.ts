import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../services/profileService";
import { getErrorMessage } from "@/src/shared/lib/api/get-error-message";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import type { UserProfile } from "../types";

export const PROFILE_QUERY_KEY = ["profile"] as const;

/**
 * TanStack Query hook to fetch user profile via GET /profile
 */
export function useProfileQuery() {
  const { isAuthenticated } = useAuth();

  return useQuery<UserProfile, Error>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileService.getProfile(),
    enabled: isAuthenticated,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}

/**
 * TanStack Mutation hook to update user profile via PATCH /profile
 */
export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updatedProfile: UserProfile) =>
      profileService.updateProfile(updatedProfile),
    onSuccess: () => {
      // Invalidate profile query key to trigger refetch upon mutation success
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });
}

/**
 * Unified Profile API hook exposing query state, mutation state, and error handling
 */
export function useProfileApi() {
  const { user } = useAuth();
  const query = useProfileQuery();
  const mutation = useUpdateProfileMutation();

  const rawError = query.error || mutation.error;
  const error = rawError ? getErrorMessage(rawError) : null;

  // Fallback name/email from authenticated user if profile data is loading or empty
  const profile: UserProfile | null = query.data
    ? query.data
    : user
    ? {
        name: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName || "",
        email: user.email || "",
        avatarUrl: "",
        education: { educationLevel: "", fieldsOfStudy: [], nationality: "" },
        background: { gpa: "", gpaScale: "4.0", experienceLevel: "entry", financialNeed: "prefer_not", goals: "" },
        skills: { skills: [], languages: [] },
        documents: { resume: null, essay: null, transcript: null, recommendation: null, other: null },
      }
    : null;

  return {
    profile,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSaving: mutation.isPending,
    error,
    refetchProfile: query.refetch,
    updateProfile: mutation.mutateAsync,
  };
}
