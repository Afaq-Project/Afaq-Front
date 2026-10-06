"use client";

import { useState } from "react";
import { useDebounce } from "@/src/shared/lib/hooks/useDebounce";
import { useCountriesSearch, useInstitutionsSearch, useMajorsSearch } from "./useReferenceData";

/** A reference item (country, major, institution…) as pickers display it. */
export interface ReferenceOption {
  id: string;
  name: string;
}

// Search-as-you-type reference lists for pickers: each hook owns its query, debounces
// it, and returns the results as Options. `isFetching` also covers the debounce delay, so the
// spinner shows as soon as the user types.

function useSearchQuery() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  return { query, setQuery, debouncedQuery, isDebouncing: query !== debouncedQuery };
}

/** Countries by name, or by nationality name ("Jordanian") when `asNationality` is set. */
export function useCountryOptions({ asNationality = false } = {}) {
  const search = useSearchQuery();
  const { data = [], isFetching } = useCountriesSearch(search.debouncedQuery);
  const options: ReferenceOption[] = data.map((c) => ({
    id: c.id,
    name: asNationality ? c.nationalityNameEn ?? c.nameEn : c.nameEn,
  }));
  return { ...search, options, isFetching: isFetching || search.isDebouncing };
}

export function useInstitutionOptions() {
  const search = useSearchQuery();
  const { data = [], isFetching } = useInstitutionsSearch(search.debouncedQuery);
  const options: ReferenceOption[] = data.map((i) => ({ id: i.id, name: i.nameEn }));
  return { ...search, options, isFetching: isFetching || search.isDebouncing };
}

export function useMajorOptions() {
  const search = useSearchQuery();
  const { data = [], isFetching } = useMajorsSearch(search.debouncedQuery);
  const options: ReferenceOption[] = data.map((m) => ({ id: m.id, name: m.nameEn }));
  return { ...search, options, isFetching };
}
