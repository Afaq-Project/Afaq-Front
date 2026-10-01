import apiClient from "./axios-client";
import type {
  RefCountry,
  RefCity,
  RefEducationLevel,
  RefMajorCategory,
  RefMajor,
  RefLanguage,
  RefProficiencyLevel,
  RefDocumentType,
  RefInstitution,
  RefStandardizedTest,
  RefSpecialStatus,
  RefMaritalStatus,
} from "@/src/feature/profile/types/api";

export const referenceService = {
  getCountries: (search?: string) =>
    apiClient.get<RefCountry[]>(search ? `/reference/countries?search=${encodeURIComponent(search)}` : "/reference/countries"),
  getCities: (countryId?: string) =>
    apiClient.get<RefCity[]>(
      countryId
        ? `/reference/cities?countryId=${countryId}`
        : "/reference/cities"
    ),
  getMaritalStatuses: () =>
    apiClient.get<RefMaritalStatus[]>("/reference/marital-statuses"),
  getEducationLevels: () =>
    apiClient.get<RefEducationLevel[]>("/reference/education-levels"),
  getMajorCategories: () =>
    apiClient.get<RefMajorCategory[]>("/reference/major-categories"),
  getMajors: (search?: string) =>
    apiClient.get<RefMajor[]>(search ? `/reference/majors?search=${encodeURIComponent(search)}` : "/reference/majors"),
  getInstitutions: (search?: string) =>
    apiClient.get<RefInstitution[]>(search ? `/reference/institutions?search=${encodeURIComponent(search)}` : "/reference/institutions"),
  getLanguages: (search?: string) =>
    apiClient.get<RefLanguage[]>(search ? `/reference/languages?search=${encodeURIComponent(search)}` : "/reference/languages"),
  getProficiencyLevels: () =>
    apiClient.get<RefProficiencyLevel[]>("/reference/proficiency-levels"),
  getDocumentTypes: () =>
    apiClient.get<RefDocumentType[]>("/reference/document-types"),
  getStandardizedTests: () =>
    apiClient.get<RefStandardizedTest[]>("/reference/standardized-tests"),
  getSpecialStatuses: () =>
    apiClient.get<RefSpecialStatus[]>("/reference/special-statuses"),
};
