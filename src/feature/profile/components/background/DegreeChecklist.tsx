"use client";

import { useEducationLevels } from "@/src/shared/lib/api/hooks/useReferenceData";

interface DegreeChecklistProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

/** Toggleable chips for the (short) list of education levels. */
export function DegreeChecklist({ selectedIds, onChange }: DegreeChecklistProps) {
  const { data: levels = [], isLoading } = useEducationLevels();

  const toggle = (id: string) =>
    onChange(selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id]);

  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="font-medium text-neutral-800 text-xs mb-2">
        Target Degrees <span className="text-red-500">*</span>
      </legend>
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" role="status" />
      ) : (
        <div className="flex flex-wrap gap-2">
          {levels.map((level) => {
            const selected = selectedIds.includes(level.id);
            return (
              <button
                key={level.id}
                type="button"
                onClick={() => toggle(level.id)}
                aria-pressed={selected}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                  selected
                    ? "bg-primary text-white"
                    : "border border-neutral-200 text-neutral-700 hover:border-primary"
                }`}
              >
                {selected && <span className="material-symbols-outlined text-[16px]">check</span>}
                {level.nameEn}
              </button>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
