import { EmptyState } from "@/src/shared/ui/EmptyState";
import { SectionCard } from "@/src/shared/ui/SectionCard";
import type { ReferenceNames } from "../../hooks/useReferenceNames";
import type { ApiLanguageEntry } from "../../types/api";
import { LanguageRow } from "./LanguageRow";
import { LanguagesEditor } from "./LanguagesEditor";

interface LanguagesCardProps {
  languages: ApiLanguageEntry[];
  names: ReferenceNames;
  isEditing: boolean;
  onEdit?: () => void;
  onDone: () => void;
}

export function LanguagesCard({ languages, names, isEditing, onEdit, onDone }: LanguagesCardProps) {
  if (isEditing) return <LanguagesEditor languages={languages} names={names} onDone={onDone} />;

  return (
    <SectionCard title="Languages" onEdit={onEdit}>
      {languages.length === 0 ? (
        <EmptyState
          message="Many programs ask for language skills. Add the languages you speak."
        />
      ) : (
        <ul className="flex flex-col divide-y divide-neutral-100">
          {languages.map((language) => (
            <LanguageRow key={language.languageId} language={language} names={names} />
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
