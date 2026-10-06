"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useMajorCategories } from "@/src/shared/lib/api/hooks/useReferenceData";
import { referenceService } from "@/src/shared/lib/api/referenceService";

/**
 * Major categories that actually contain majors. Every category's majors are fetched up front
 * (~20 categories, cached forever) so empty ones can be hidden, and expanding is instant.
 */
export function useSkillCategories() {
  const { data: categories = [], isLoading } = useMajorCategories();

  const majorsByCategory = useQueries({
    queries: categories.map((cat) => ({
      queryKey: ["reference", "majors", "category", cat.id],
      queryFn: () => referenceService.getMajorsByCategory(cat.id),
      staleTime: Infinity,
    })),
  });

  const nonEmpty = useMemo(
    () =>
      categories.filter((_, i) => {
        const query = majorsByCategory[i];
        // Hide only when the fetch is done and confirmed empty; show while loading.
        return !query?.data || query.data.length > 0;
      }),
    [categories, majorsByCategory],
  );

  return { categories: nonEmpty, isLoading };
}
