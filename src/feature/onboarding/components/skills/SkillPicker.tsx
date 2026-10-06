"use client";

import { useMajorOptions } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import { CollapsibleTagList } from "@/src/shared/ui/CollapsibleTagList";
import { useSkillCategories } from "../../hooks/useSkillCategories";
import type { Option } from "../../types";
import { SkillCategoryPanel } from "./SkillCategoryPanel";
import { SkillChip } from "./SkillChip";

interface SkillPickerProps {
  selected: Option[];
  onChange: (selected: Option[]) => void;
  max: number;
}

/** Pick skills (majors) by searching or browsing categories; picks show as removable tags. */
export function SkillPicker({ selected, onChange, max }: SkillPickerProps) {
  const search = useMajorOptions();
  const { categories, isLoading: categoriesLoading } = useSkillCategories();

  const selectedIds = selected.map((s) => s.id);
  const maxReached = selected.length >= max;
  const isSearching = search.debouncedQuery.trim().length >= 2;

  const toggle = (skill: Option) => {
    if (selectedIds.includes(skill.id)) {
      onChange(selected.filter((s) => s.id !== skill.id));
    } else if (!maxReached) {
      onChange([...selected, skill]);
    }
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-5 flex flex-col gap-5 border border-outline-variant shadow-xs">
      <div className="min-h-11 p-2.5 bg-surface-container/60 rounded-lg border border-outline-variant/60">
        <CollapsibleTagList
          items={selected.map((skill) => ({ key: skill.id, label: skill.name, onRemove: () => toggle(skill) }))}
          defaultVisible={3}
          emptyMessage="No skills selected yet. Choose from the categories below."
        />
      </div>

      <div className="h-px w-full bg-outline-variant/50" />

      <div className="relative">
        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none text-[18px]">
          search
        </span>
        <input
          type="text"
          value={search.query}
          onChange={(e) => search.setQuery(e.target.value)}
          placeholder="Search skills…"
          className="w-full pl-11 pr-10 py-2.5 bg-surface-container-low rounded-md text-sm border border-outline-variant focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/30 placeholder:text-on-surface-variant transition-colors"
        />
        {search.isFetching && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        )}
        {search.query && !search.isFetching && (
          <button
            type="button"
            onClick={() => search.setQuery("")}
            aria-label="Clear search"
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        )}
      </div>

      {isSearching ? (
        <div className="flex flex-wrap gap-2.5">
          {search.isFetching ? (
            <div className="w-full flex justify-center py-4">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : search.options.length === 0 ? (
            <p className="text-sm text-on-surface-variant text-center w-full py-4">
              No skills found for &ldquo;{search.debouncedQuery}&rdquo;
            </p>
          ) : (
            search.options.map((skill) => {
              const isSelected = selectedIds.includes(skill.id);
              return (
                <SkillChip
                  key={skill.id}
                  name={skill.name}
                  selected={isSelected}
                  disabled={!isSelected && maxReached}
                  onToggle={() => toggle(skill)}
                />
              );
            })
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {categoriesLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            categories.map((cat) => (
              <SkillCategoryPanel
                key={cat.id}
                category={cat}
                selectedIds={selectedIds}
                maxReached={maxReached}
                onToggle={toggle}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
