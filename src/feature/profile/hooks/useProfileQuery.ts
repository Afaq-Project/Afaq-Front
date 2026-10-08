"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applyPreferenceChanges, type PreferenceIds } from "../services/preferences";
import { profileService } from "../services/profileService";
import type { UpdatePersonalPayload, CreateEducationPayload, AddLanguagePayload } from "../types/api";

export const PROFILE_QUERY_KEY = ["profile", "me"];

export function useProfileQuery({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: profileService.getProfile,
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled,
  });
}

export function usePreferencesQuery() {
  return useQuery({
    queryKey: ["profile", "preferences"],
    queryFn: profileService.getPreferences,
    staleTime: 1000 * 60 * 5,
  });
}

/**
 * Saves target preferences as a whole: adds what's new and removes what was taken out.
 * `current` is what the server has now (from usePreferencesQuery).
 */
export function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ current, next }: { current: PreferenceIds; next: PreferenceIds }) =>
      applyPreferenceChanges(current, current, next),
    // Preferences count toward profile completion, so refresh both.
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile"] }),
  });
}

export function useUpdatePersonal() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdatePersonalPayload) => profileService.updatePersonal(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  });
}

export function useCreateEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateEducationPayload) => profileService.createEducation(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  });
}

export function useUpdateEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateEducationPayload> }) =>
      profileService.updateEducation(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  });
}

export function useDeleteEducation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => profileService.deleteEducation(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  });
}

export function useAddLanguage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: AddLanguagePayload) => profileService.addLanguage(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  });
}

export function useDeleteLanguage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => profileService.deleteLanguage(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  });
}

export function useUploadDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ documentTypeId, file }: { documentTypeId: string; file: File }) =>
      profileService.uploadDocument(documentTypeId, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  });
}

export function useDeleteDocument() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => profileService.deleteDocument(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: PROFILE_QUERY_KEY }),
  });
}
