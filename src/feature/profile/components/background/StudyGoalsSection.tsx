import type { ReferenceNames } from "../../hooks/useReferenceNames";
import type { ApiPreferences } from "../../types/api";
import { ProfileSection } from "../common/ProfileSection";
import { SubHeading, TagList } from "../common/TagList";

interface StudyGoalsSectionProps {
  preferences?: ApiPreferences;
  names: ReferenceNames;
}

/** Target degrees, majors and institutions (read-only here). */
export function StudyGoalsSection({ preferences, names }: StudyGoalsSectionProps) {
  const degrees = (preferences?.targetDegrees ?? []).map((d) => names.educationLevel(d.educationLevelId) ?? "");
  const majors = (preferences?.targetMajors ?? []).map((m) => names.major(m.majorId) ?? "");
  // Institution names can't be looked up by ID yet (see useReferenceNames).
  const institutions = (preferences?.targetInstitutions ?? []).map(
    (i) => names.institution.exact(i.institutionId) ?? "Name not available yet",
  );

  return (
    <ProfileSection icon="flag" title="Study Goals">
      <div className="flex flex-col gap-5">
        <div>
          <SubHeading>Target Degrees</SubHeading>
          <TagList items={degrees} emptyText="No target degrees yet." />
        </div>
        <div>
          <SubHeading>Target Fields of Study</SubHeading>
          <TagList items={majors} emptyText="No target fields yet." />
        </div>
        <div>
          <SubHeading>Target Institutions</SubHeading>
          <TagList items={institutions} emptyText="No target institutions yet." />
        </div>
      </div>
    </ProfileSection>
  );
}
