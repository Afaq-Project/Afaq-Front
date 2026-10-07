import type { ReferenceNames } from "../../hooks/useReferenceNames";
import type { ApiLanguageEntry } from "../../types/api";
import { editHandler, type EditingState } from "../common/editing";
import { ProfilePageSection } from "../common/ProfilePageSection";
import { LanguagesCard } from "./LanguagesCard";
import { SkillsCard } from "./SkillsCard";

interface SkillsLanguagesSectionProps {
  experiences: string[];
  languages: ApiLanguageEntry[];
  names: ReferenceNames;
  edit: EditingState;
}

export function SkillsLanguagesSection({ experiences, languages, names, edit }: SkillsLanguagesSectionProps) {
  return (
    <ProfilePageSection id="skills" title="Skills and languages">
      <SkillsCard
        experiences={experiences}
        names={names}
        isEditing={edit.editing === "skills"}
        onEdit={editHandler(edit, "skills")}
        onDone={edit.stop}
      />
      <LanguagesCard
        languages={languages}
        names={names}
        isEditing={edit.editing === "languages"}
        onEdit={editHandler(edit, "languages")}
        onDone={edit.stop}
      />
    </ProfilePageSection>
  );
}
