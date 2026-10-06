"use client";

import { useDeleteLanguage } from "../../hooks/useProfileQuery";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import type { ApiLanguageEntry } from "../../types/api";
import { EmptyState } from "../common/EmptyState";
import { ProfileSection } from "../common/ProfileSection";

interface LanguagesSectionProps {
  languages: ApiLanguageEntry[];
  names: ReferenceNames;
  onAdd: () => void;
}

export function LanguagesSection({ languages, names, onAdd }: LanguagesSectionProps) {
  // Language entries have no ID of their own; the API deletes them by language ID.
  const deleteLanguage = useDeleteLanguage();

  return (
    <ProfileSection icon="translate" title="Languages" onAdd={onAdd}>
      {languages.length === 0 ? (
        <EmptyState message="No languages added yet." actionLabel="Add a language" onAction={onAdd} />
      ) : (
        <div className="flex flex-wrap gap-3">
          {languages.map((lang) => {
            const name = names.language(lang.languageId) ?? "Language";
            return (
              <div
                key={lang.languageId}
                className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg pl-3 pr-2 py-2"
              >
                <span className="text-sm font-medium text-neutral-900">{name}</span>
                {lang.isNative && <span className="text-xs text-neutral-400">(native)</span>}
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-primary text-white">
                  {names.proficiencyLevel(lang.proficiencyLevelId) ?? "—"}
                </span>
                <button
                  type="button"
                  onClick={() => deleteLanguage.mutate(lang.languageId)}
                  disabled={deleteLanguage.isPending}
                  aria-label={`Remove ${name}`}
                  className="ml-0.5 w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50 text-neutral-300 hover:text-red-400 transition-colors cursor-pointer disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ProfileSection>
  );
}
