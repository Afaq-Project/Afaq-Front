"use client";

import { useState } from "react";
import { useLanguagesSearch, useProficiencyLevels } from "@/src/shared/lib/api/hooks/useReferenceData";
import type { ReferenceOption } from "@/src/shared/lib/api/hooks/useReferenceOptions";
import { useDebounce } from "@/src/shared/lib/hooks/useDebounce";
import Button from "@/src/shared/ui/Button";
import { InlineSearch } from "@/src/shared/ui/InlineSearch";
import Select from "@/src/shared/ui/Select";
import type { LanguageDraft } from "../../hooks/useSaveLanguages";

interface AddLanguageFormProps {
  /** Languages already in the list — they can't be added twice. */
  excludeIds: string[];
  onAdd: (language: LanguageDraft) => void;
  onCancel: () => void;
}

/** Picks a language and level to add to the list being edited (saved with the card). */
export function AddLanguageForm({ excludeIds, onAdd, onCancel }: AddLanguageFormProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const { data: rawLanguages = [], isFetching } = useLanguagesSearch(debouncedQuery);
  const options: ReferenceOption[] = rawLanguages
    .filter((l) => !excludeIds.includes(l.id))
    .map((l) => ({ id: l.id, name: l.nameEn }));
  const { data: levels = [] } = useProficiencyLevels();

  const [language, setLanguage] = useState<ReferenceOption | null>(null);
  const [levelId, setLevelId] = useState("");
  const [isNative, setIsNative] = useState(false);

  return (
    <div className="flex flex-col gap-4 rounded-md border border-neutral-100 p-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InlineSearch<ReferenceOption>
          label="Language"
          selectedName={language?.name ?? ""}
          items={options}
          isFetching={isFetching}
          onSearch={setQuery}
          onSelect={setLanguage}
          onClear={() => setLanguage(null)}
          minSearchLength={0}
        />
        <Select
          id="profile-language-level"
          label="Proficiency"
          value={levelId}
          onChange={(e) => setLevelId(e.target.value)}
          options={[{ value: "", label: "Select a level" }, ...levels.map((l) => ({ value: l.id, label: l.nameEn }))]}
        />
      </div>
      <label className="flex min-h-11 cursor-pointer select-none items-center gap-2 md:min-h-0">
        <input
          type="checkbox"
          checked={isNative}
          onChange={(e) => setIsNative(e.target.checked)}
          className="size-4 accent-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
        />
        <span className="text-body text-neutral-800">This is my native language</span>
      </label>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={!language || !levelId}
          onClick={() => language && onAdd({ languageId: language.id, proficiencyLevelId: levelId, isNative })}
        >
          Add to list
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Don&apos;t add
        </Button>
      </div>
    </div>
  );
}
