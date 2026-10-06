import type { LanguageItem, Option } from "../../types";
import { LanguageCombobox } from "./LanguageCombobox";

interface LanguageRowProps {
  item: LanguageItem;
  proficiencyLevels: Option[];
  onChange: (item: LanguageItem) => void;
  onRemove: () => void;
}

/** One language with its proficiency level. */
export function LanguageRow({ item, proficiencyLevels, onChange, onRemove }: LanguageRowProps) {
  const selectLevel = (levelId: string) => {
    const level = proficiencyLevels.find((p) => p.id === levelId);
    if (!level) return;
    onChange({
      ...item,
      level: level.name,
      proficiencyLevelId: level.id,
      isNative: level.name.toLowerCase().includes("native"),
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center w-full bg-surface p-3 rounded-lg border border-outline-variant/60">
      <LanguageCombobox
        value={item.language}
        valueId={item.languageId}
        onChange={(name, id) => onChange({ ...item, language: name, languageId: id })}
      />

      <div className="relative w-full sm:w-[45%]">
        <select
          value={item.proficiencyLevelId ?? ""}
          onChange={(e) => selectLevel(e.target.value)}
          aria-label="Proficiency level"
          className="w-full appearance-none bg-surface-container text-on-surface border border-outline-variant rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer transition-colors"
        >
          {!item.proficiencyLevelId && (
            <option value="" disabled>
              Select level
            </option>
          )}
          {proficiencyLevels.map((level) => (
            <option key={level.id} value={level.id}>{level.name}</option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
          expand_more
        </span>
      </div>

      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove language"
        className="w-full sm:w-auto flex justify-center text-on-surface-variant hover:text-error hover:bg-error-container p-2.5 rounded-lg transition-colors shrink-0 cursor-pointer"
      >
        <span className="material-symbols-outlined text-[20px]">delete</span>
      </button>
    </div>
  );
}
