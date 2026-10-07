"use client";

import { useState } from "react";
import { useMajorsByCategory } from "@/src/shared/lib/api/hooks/useReferenceData";
import type { ReferenceOption as Option } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import { SkillChip } from "./SkillChip";

interface SkillCategoryPanelProps {
  category: { id: string; nameEn: string };
  selectedIds: string[];
  maxReached: boolean;
  onToggle: (skill: Option) => void;
}

/** A collapsible category of skills; its majors load when first expanded. */
export function SkillCategoryPanel({ category, selectedIds, maxReached, onToggle }: SkillCategoryPanelProps) {
  const [open, setOpen] = useState(false);
  const { data: rawMajors = [], isFetching } = useMajorsByCategory(category.id, open);
  const skills: Option[] = rawMajors.map((m) => ({ id: m.id, name: m.nameEn }));

  return (
    <div className="border border-outline-variant rounded-md bg-surface overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-container-low transition-colors text-left cursor-pointer"
      >
        <span className="text-sm font-semibold text-on-surface">{category.nameEn}</span>
        <div className="flex items-center gap-2">
          {isFetching && (
            <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          )}
          <span className={`material-symbols-outlined text-on-surface-variant transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            expand_more
          </span>
        </div>
      </button>

      {open && (
        <div className="p-4 pt-1 border-t border-outline-variant/30 flex flex-wrap gap-2.5 bg-surface-bright min-h-12">
          {isFetching ? (
            <div className="w-full flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            skills.map((skill) => {
              const selected = selectedIds.includes(skill.id);
              return (
                <SkillChip
                  key={skill.id}
                  name={skill.name}
                  selected={selected}
                  disabled={!selected && maxReached}
                  onToggle={() => onToggle(skill)}
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
