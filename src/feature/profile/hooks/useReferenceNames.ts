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
import { useReferenceName } from "@/src/shared/lib/api/hooks/useReferenceName";
import { useTranslations } from "next-intl";

/**
 * Resolves an ID to its name for display: undefined when there's no ID, "Loading…" or
 * "Unknown" when the name isn't available. `exact` returns only real names, for prefilling forms.
 */
export interface NameResolver {
  (id?: string | null): string | undefined;
  exact: (id?: string | null) => string | undefined;
}

/** Display placeholder while a name list is still loading; UI can swap it for a skeleton. */
export const LOADING_NAME = "Loading…";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function toMap<T extends { id: string }>(items: T[], name: (item: T) => string) {
  return new Map(items.map((item) => [item.id, name(item)]));
}

function resolverFor(map: Map<string, string>, isLoading: boolean, unknown: string): NameResolver {
  const exact = (id?: string | null) => (id ? map.get(id) : undefined);
  const display = (id?: string | null) => {
    if (!id) return undefined;
    return exact(id) ?? (isLoading ? LOADING_NAME : unknown);
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
  const refName = useReferenceName();
  const unknown = useTranslations("profile")("unknownName");

  return useMemo(() => {
    const majorName = resolverFor(toMap(majors.data ?? [], refName.name), majors.isLoading, unknown);

    return {
      country: resolverFor(toMap(countries.data ?? [], refName.name), countries.isLoading, unknown),
      nationality: resolverFor(
        toMap(countries.data ?? [], refName.nationality),
        countries.isLoading,
        unknown,
      ),
      city: resolverFor(toMap(cities.data ?? [], refName.name), cities.isLoading, unknown),
      major: majorName,
      // There is no way to look institutions up by ID yet (10k+ entries, no by-ID endpoint).
      // TODO: use the backend's lookup once it exists.
      institution: resolverFor(new Map(), false, unknown),
      language: resolverFor(toMap(languages.data ?? [], refName.name), languages.isLoading, unknown),
      proficiencyLevel: resolverFor(toMap(proficiencyLevels.data ?? [], refName.name), proficiencyLevels.isLoading, unknown),
      maritalStatus: resolverFor(toMap(maritalStatuses.data ?? [], refName.name), maritalStatuses.isLoading, unknown),
      educationLevel: resolverFor(toMap(educationLevels.data ?? [], refName.name), educationLevels.isLoading, unknown),
      /** Onboarding stores major IDs in `experiences`, but the API also accepts free text. */
      skill: (value?: string | null): string | undefined =>
        value && !UUID_RE.test(value) ? value : majorName(value),
    };
  }, [countries.data, countries.isLoading, cities.data, cities.isLoading, majors.data, majors.isLoading,
    languages.data, languages.isLoading, proficiencyLevels.data, proficiencyLevels.isLoading,
    maritalStatuses.data, maritalStatuses.isLoading, educationLevels.data, educationLevels.isLoading, refName, unknown]);
}

export type ReferenceNames = ReturnType<typeof useReferenceNames>;
