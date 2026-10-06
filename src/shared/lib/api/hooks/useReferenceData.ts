"use client";

import { useQuery } from "@tanstack/react-query";
import { referenceService } from "../referenceService";

// Reference data almost never changes — cache indefinitely in the session.
const STALE_FOREVER = Infinity;

export function useEducationLevels() {
  return useQuery({
    queryKey: ["reference", "education-levels"],
    queryFn: referenceService.getEducationLevels,
    staleTime: STALE_FOREVER,
  });
}

export function useMajorCategories() {
  return useQuery({
    queryKey: ["reference", "major-categories"],
    queryFn: referenceService.getMajorCategories,
    staleTime: STALE_FOREVER,
  });
}

export function useProficiencyLevels() {
  return useQuery({
    queryKey: ["reference", "proficiency-levels"],
    queryFn: referenceService.getProficiencyLevels,
    staleTime: STALE_FOREVER,
  });
}

export function useDocumentTypes() {
  return useQuery({
    queryKey: ["reference", "document-types"],
    queryFn: referenceService.getDocumentTypes,
    staleTime: STALE_FOREVER,
  });
}

export function useMaritalStatuses() {
  return useQuery({
    queryKey: ["reference", "marital-statuses"],
    queryFn: referenceService.getMaritalStatuses,
    staleTime: STALE_FOREVER,
  });
}

// Complete lists for ID → name lookups. They take several requests, so they are opt-in
// (`enabled`) and kept for the whole session.
const KEEP_FOR_SESSION = { staleTime: STALE_FOREVER, gcTime: STALE_FOREVER };

export function useAllCountries(enabled = true) {
  return useQuery({
    queryKey: ["reference", "countries", "all"],
    queryFn: referenceService.getAllCountries,
    enabled,
    ...KEEP_FOR_SESSION,
  });
}

export function useAllCitiesForCountry(countryId: string) {
  return useQuery({
    queryKey: ["reference", "cities", "all", countryId],
    queryFn: () => referenceService.getAllCitiesForCountry(countryId),
    enabled: Boolean(countryId),
    ...KEEP_FOR_SESSION,
  });
}

export function useAllMajors(enabled = true) {
  return useQuery({
    queryKey: ["reference", "majors", "all"],
    queryFn: referenceService.getAllMajors,
    enabled,
    ...KEEP_FOR_SESSION,
  });
}

// Search-enabled hooks — query key includes the search term so each query is cached separately.
const STALE_SEARCH = 5 * 60 * 1000; // 5 min

export function useCountriesSearch(search: string) {
  return useQuery({
    queryKey: ["reference", "countries", "search", search],
    queryFn: () => referenceService.getCountries(search || undefined),
    staleTime: STALE_SEARCH,
  });
}

export function useMajorsByCategory(categoryId: string, enabled = true) {
  return useQuery({
    queryKey: ["reference", "majors", "category", categoryId],
    queryFn: () => referenceService.getMajorsByCategory(categoryId),
    staleTime: STALE_FOREVER,
    enabled: enabled && Boolean(categoryId),
  });
}

export function useMajorsSearch(search: string) {
  return useQuery({
    queryKey: ["reference", "majors", "search", search],
    queryFn: () => referenceService.getMajors(search),
    staleTime: STALE_SEARCH,
    enabled: search.trim().length >= 2,
  });
}

export function useLanguagesSearch(search: string) {
  return useQuery({
    queryKey: ["reference", "languages", "search", search],
    queryFn: () => referenceService.getLanguages(search || undefined),
    staleTime: STALE_SEARCH,
  });
}

export function useInstitutionsSearch(search: string) {
  return useQuery({
    queryKey: ["reference", "institutions", "search", search],
    queryFn: () => referenceService.getInstitutions(search),
    staleTime: STALE_SEARCH,
    enabled: search.trim().length >= 2,
  });
}
