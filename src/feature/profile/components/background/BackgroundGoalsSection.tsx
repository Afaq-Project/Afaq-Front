import type { ReferenceNames } from "../../hooks/useReferenceNames";
import type { ApiPreferences, ApiProfile } from "../../types/api";
import { editHandler, type EditingState } from "../common/editing";
import { ProfilePageSection } from "../common/ProfilePageSection";
import { BackgroundCard } from "./BackgroundCard";
import { StudyGoalsCard } from "./StudyGoalsCard";

interface BackgroundGoalsSectionProps {
  profile?: ApiProfile;
  preferences?: ApiPreferences;
  names: ReferenceNames;
  edit: EditingState;
}

export function BackgroundGoalsSection({ profile, preferences, names, edit }: BackgroundGoalsSectionProps) {
  return (
    <ProfilePageSection id="background" title="Background and goals">
      <BackgroundCard
        profile={profile}
        names={names}
        isEditing={edit.editing === "background"}
        onEdit={editHandler(edit, "background")}
        onDone={edit.stop}
      />
      <StudyGoalsCard
        preferences={preferences}
        names={names}
        isEditing={edit.editing === "goals"}
        onEdit={editHandler(edit, "goals")}
        onDone={edit.stop}
      />
    </ProfilePageSection>
  );
}
