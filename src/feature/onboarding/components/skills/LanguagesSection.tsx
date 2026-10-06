import type { LanguageItem, Option } from "../../types";
import { StepSectionHeading } from "../common/StepSectionHeading";
import { LanguageRow } from "./LanguageRow";

const MAX_LANGUAGES = 5;

interface LanguagesSectionProps {
  languages: LanguageItem[];
  proficiencyLevels: Option[];
  onChange: (languages: LanguageItem[]) => void;
}

export function LanguagesSection({ languages, proficiencyLevels, onChange }: LanguagesSectionProps) {
  const atMax = languages.length >= MAX_LANGUAGES;

  const addLanguage = () => {
    if (atMax) return;
    const defaultLevel = proficiencyLevels[0];
    onChange([
      ...languages,
      {
        id: `lang-${Date.now()}`,
        language: "",
        level: defaultLevel?.name ?? "",
        proficiencyLevelId: defaultLevel?.id,
        isNative: false,
      },
    ]);
  };

  const updateLanguage = (updated: LanguageItem) =>
    onChange(languages.map((l) => (l.id === updated.id ? updated : l)));

  const removeLanguage = (id: string) => onChange(languages.filter((l) => l.id !== id));

  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <StepSectionHeading>Language Proficiency</StepSectionHeading>
        <span className={`text-sm font-medium ${atMax ? "text-warning font-bold" : "text-on-surface-variant"}`}>
          {languages.length} of {MAX_LANGUAGES} languages
        </span>
      </div>

      <div className="bg-surface-container-low rounded-xl p-4 flex flex-col gap-3 border border-outline-variant shadow-xs">
        {languages.length === 0 ? (
          <p className="text-sm text-on-surface-variant italic p-2">
            No languages added yet. Click &quot;Add language&quot; below.
          </p>
        ) : (
          languages.map((item) => (
            <LanguageRow
              key={item.id}
              item={item}
              proficiencyLevels={proficiencyLevels}
              onChange={updateLanguage}
              onRemove={() => removeLanguage(item.id)}
            />
          ))
        )}

        {!atMax && (
          <button
            type="button"
            onClick={addLanguage}
            className="flex items-center justify-center gap-2 py-2.5 px-4 w-full sm:w-max rounded-lg border border-dashed border-outline text-primary text-sm font-semibold hover:bg-primary-container/20 hover:border-primary transition-all mt-2 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add another language
          </button>
        )}
      </div>
    </section>
  );
}
