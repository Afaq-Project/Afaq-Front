import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { ProfileSection } from "../common/ProfileSection";
import { TagList } from "../common/TagList";

interface SkillsSectionProps {
  experiences: string[];
  names: ReferenceNames;
  onEdit: () => void;
}

export function SkillsSection({ experiences, names, onEdit }: SkillsSectionProps) {
  const skills = experiences.map((value) => names.skill(value) ?? value);
  return (
    <ProfileSection icon="psychology" title="Skills & Experience" onEdit={onEdit}>
      <TagList items={skills} emptyText="No skills added yet." />
    </ProfileSection>
  );
}
