import apiClient from "@/src/shared/lib/api/axios-client";
import type {
  ApiProfile,
  ApiEducation,
  ApiLanguageEntry,
  ApiDocument,
  UpdatePersonalPayload,
  CreateEducationPayload,
  AddLanguagePayload,
} from "../types/api";

export const profileService = {
  getProfile: () => apiClient.get<ApiProfile>("/profile/me"),

  updatePersonal: (data: UpdatePersonalPayload) =>
    apiClient.patch<ApiProfile>("/profile/personal", data),

  // Education
  createEducation: (data: CreateEducationPayload) =>
    apiClient.post<ApiEducation>("/profile/educations", data),

  listEducations: () => apiClient.get<ApiEducation[]>("/profile/educations"),

  updateEducation: (
    id: string,
    data: Partial<CreateEducationPayload>
  ) => apiClient.patch<ApiEducation>(`/profile/educations/${id}`, data),

  deleteEducation: (id: string) =>
    apiClient.delete(`/profile/educations/${id}`),

  // Languages
  addLanguage: (data: AddLanguagePayload) =>
    apiClient.post<ApiLanguageEntry>("/profile/languages", data),

  listLanguages: () =>
    apiClient.get<ApiLanguageEntry[]>("/profile/languages"),

  updateLanguage: (
    id: string,
    data: { proficiencyLevelId?: string; isNative?: boolean }
  ) => apiClient.patch<ApiLanguageEntry>(`/profile/languages/${id}`, data),

  deleteLanguage: (id: string) =>
    apiClient.delete(`/profile/languages/${id}`),

  // Documents
  uploadDocument: (documentTypeId: string, file: File) => {
    const formData = new FormData();
    formData.append("documentTypeId", documentTypeId);
    formData.append("file", file);
    return apiClient.post<ApiDocument>("/profile/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  listDocuments: () => apiClient.get<ApiDocument[]>("/profile/documents"),

  getDocumentDownloadUrl: (id: string) =>
    apiClient.get<{ url: string }>(`/profile/documents/${id}/download`),

  deleteDocument: (id: string) =>
    apiClient.delete(`/profile/documents/${id}`),
};
