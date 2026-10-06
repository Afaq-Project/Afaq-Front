"use client";

import { useMemo } from "react";
import {
  useAllCitiesForCountry,
  useAllCountries,
  useAllMajors,
  useEducationLevels,
  useLanguagesSearch,
  useMaritalStatuses,
  useProficiencyLevels,
} from "@/src/shared/lib/api/hooks/useReferenceData";
import type { ApiPreferences, ApiProfile } from "../types/api";

/**
 * Resolves an ID to its name for display: undefined when there's no ID, "Loading…" or
 * "Unknown" when the name isn't available. `exact` returns only real names, for prefilling forms.
 */
export interface NameResolver {
  (id?: string | null): string | undefined;
  exact: (id?: string | null) => string | undefined;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toMap<T extends { id: string }>(items: T[], name: (item: T) => string) {
  return new Map(items.map((item) => [item.id, name(item)]));
}

function resolverFor(map: Map<string, string>, isLoading: boolean): NameResolver {
  const exact = (id?: string | null) => (id ? map.get(id) : undefined);
  const display = (id?: string | null) => {
    if (!id) return undefined;
    return exact(id) ?? (isLoading ? "Loading…" : "Unknown");
  };
  return Object.assign(display, { exact });
}

/**
 * `/profile/me` and `/profile/preferences` return IDs for reference data. This loads the
 * lists needed to show their names — only those the profile actually uses, since the
 * country, city and major lists take several requests each.
 */
export function useReferenceNames(profile?: ApiProfile, preferences?: ApiPreferences) {
  const educations = profile?.educations ?? [];
  const experiences = profile?.experiences ?? [];

  const needsCountries = Boolean(profile?.nationalityId || profile?.countryOfResidenceId);
  const needsMajors =
    experiences.some((value) => UUID_RE.test(value)) ||
    educations.some((e) => e.majorId || e.minorMajorId) ||
    (preferences?.targetMajors?.length ?? 0) > 0;

  const countries = useAllCountries(needsCountries);
  const cities = useAllCitiesForCountry(profile?.currentCityId ? profile.countryOfResidenceId ?? "" : "");
  const majors = useAllMajors(needsMajors);
  const languages = useLanguagesSearch("");
  const proficiencyLevels = useProficiencyLevels();
  const maritalStatuses = useMaritalStatuses();
  const educationLevels = useEducationLevels();

  return useMemo(() => {
    const majorName = resolverFor(toMap(majors.data ?? [], (m) => m.nameEn), majors.isLoading);

    return {
      country: resolverFor(toMap(countries.data ?? [], (c) => c.nameEn), countries.isLoading),
      nationality: resolverFor(
        toMap(countries.data ?? [], (c) => c.nationalityNameEn ?? c.nameEn),
        countries.isLoading,
      ),
      city: resolverFor(toMap(cities.data ?? [], (c) => c.nameEn), cities.isLoading),
      major: majorName,
      // There is no way to look institutions up by ID yet (10k+ entries, no by-ID endpoint).
      // TODO: use the backend's lookup once it exists.
      institution: resolverFor(new Map(), false),
      language: resolverFor(toMap(languages.data ?? [], (l) => l.nameEn), languages.isLoading),
      proficiencyLevel: resolverFor(toMap(proficiencyLevels.data ?? [], (p) => p.nameEn), proficiencyLevels.isLoading),
      maritalStatus: resolverFor(toMap(maritalStatuses.data ?? [], (s) => s.nameEn), maritalStatuses.isLoading),
      educationLevel: resolverFor(toMap(educationLevels.data ?? [], (l) => l.nameEn), educationLevels.isLoading),
      /** Onboarding stores major IDs in `experiences`, but the API also accepts free text. */
      skill: (value?: string | null): string | undefined =>
        value && !UUID_RE.test(value) ? value : majorName(value),
    };
  }, [countries.data, countries.isLoading, cities.data, cities.isLoading, majors.data, majors.isLoading,
    languages.data, languages.isLoading, proficiencyLevels.data, proficiencyLevels.isLoading,
    maritalStatuses.data, maritalStatuses.isLoading, educationLevels.data, educationLevels.isLoading]);
}

export type ReferenceNames = ReturnType<typeof useReferenceNames>;
