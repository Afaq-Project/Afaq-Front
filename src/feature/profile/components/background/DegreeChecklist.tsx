"use client";

import { Check } from "lucide-react";
import { useEducationLevels } from "@/src/shared/lib/api/hooks/useReferenceData";

interface DegreeChecklistProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

/** Toggleable chips for the short list of education levels. Selection shows a check, not just color. */
export function DegreeChecklist({ selectedIds, onChange }: DegreeChecklistProps) {
  const { data: levels = [], isLoading } = useEducationLevels();

  const toggle = (id: string) =>
    onChange(selectedIds.includes(id) ? selectedIds.filter((s) => s !== id) : [...selectedIds, id]);

  return (
    <fieldset>
      <legend className="mb-2 text-caption text-neutral-800">Target degrees</legend>
      {isLoading ? (
        <p className="text-small text-neutral-600" role="status">
          Loading degrees…
        </p>
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
                className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3.5 text-caption transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 md:min-h-9 ${
                  selected
                    ? "border-primary-100 bg-primary-50 text-primary-800"
                    : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"
                }`}
              >
                {selected && <Check size={16} strokeWidth={1.75} aria-hidden="true" />}
                {level.nameEn}
              </button>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
