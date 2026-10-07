"use client";

import { useAllMajors, useMajorCategories } from "@/src/shared/lib/api/hooks/useReferenceData";
import { formatReferenceName } from "../services/format";
import type { ReferenceNames } from "./useReferenceNames";

export interface SkillGroup {
  category: string;
  skills: { key: string; label: string }[];
}

const OTHER = "Other";

/**
 * Groups the profile's skills (major IDs) by major category, alphabetically with "Other"
 * last. Free-text or unknown skills go under "Other". Uses the same cached major list as
 * the name lookups, so it adds no requests.
 */
export function useSkillGroups(experiences: string[], names: ReferenceNames): SkillGroup[] {
  const { data: majors = [] } = useAllMajors(experiences.length > 0);
  const { data: categories = [] } = useMajorCategories();

  const categoryOf = new Map(majors.map((m) => [m.id, m.categoryId]));
  const categoryName = new Map(categories.map((c) => [c.id, formatReferenceName(c.nameEn)]));

  const groups = new Map<string, SkillGroup["skills"]>();
  experiences.forEach((value) => {
    const category = categoryName.get(categoryOf.get(value) ?? "") ?? OTHER;
    const skills = groups.get(category) ?? [];
    skills.push({ key: value, label: formatReferenceName(names.skill(value) ?? value) });
    groups.set(category, skills);
  });

  return [...groups.entries()]
    .sort(([a], [b]) => (a === OTHER ? 1 : b === OTHER ? -1 : a.localeCompare(b)))
    .map(([category, skills]) => ({ category, skills }));
}
