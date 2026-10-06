"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import Button from "@/src/shared/ui/Button";
import { SectionCard } from "@/src/shared/ui/SectionCard";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { useSaveLanguages, type LanguageDraft } from "../../hooks/useSaveLanguages";
import { AddLanguageForm } from "./AddLanguageForm";
import { LanguageRow } from "./LanguageRow";

interface LanguagesEditorProps {
  languages: LanguageDraft[];
  names: ReferenceNames;
  onDone: () => void;
}

/** Collects additions and removals; "Save changes" applies them, "Cancel" discards them. */
export function LanguagesEditor({ languages, names, onDone }: LanguagesEditorProps) {
  const { save, hasChanges, isSaving, error } = useSaveLanguages();
  const [pending, setPending] = useState<LanguageDraft[]>(languages);
  const [adding, setAdding] = useState(languages.length === 0);

  const handleSave = async () => {
    if (await save(languages, pending)) onDone();
  };

  return (
    <SectionCard
      title="Languages"
      isEditing
      onCancel={onDone}
      onSave={handleSave}
      isSaving={isSaving}
      saveDisabled={!hasChanges(languages, pending)}
      error={error}
    >
      {pending.length > 0 && (
        <ul className="mb-4 flex flex-col divide-y divide-neutral-100">
          {pending.map((language) => (
            <LanguageRow
              key={language.languageId}
              language={language}
              names={names}
              onRemove={() => setPending((prev) => prev.filter((l) => l.languageId !== language.languageId))}
            />
          ))}
        </ul>
      )}

      {adding ? (
        <AddLanguageForm
          excludeIds={pending.map((l) => l.languageId)}
          onAdd={(language) => {
            setPending((prev) => [...prev, language]);
            setAdding(false);
          }}
          onCancel={() => setAdding(false)}
        />
      ) : (
        <Button type="button" variant="secondary" onClick={() => setAdding(true)}>
          <Plus size={16} strokeWidth={1.75} aria-hidden="true" />
          Add language
        </Button>
      )}
    </SectionCard>
  );
}
