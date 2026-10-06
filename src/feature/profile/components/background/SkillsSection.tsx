import type { ReferenceNames } from "../../hooks/useReferenceNames";
import { ProfileSection } from "../common/ProfileSection";
import { TagList } from "../common/TagList";

interface SkillsSectionProps {
  experiences: string[];
  names: ReferenceNames;
}

export function SkillsSection({ experiences, names }: SkillsSectionProps) {
  const skills = experiences.map((value) => names.skill(value) ?? value);
  return (
    <ProfileSection icon="psychology" title="Skills & Experience">
      <TagList items={skills} emptyText="No skills added yet." />
    </ProfileSection>
  );
}
