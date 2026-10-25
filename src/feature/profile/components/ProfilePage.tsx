"use client";

import { useState } from "react";
import { GraduationCap, Languages, Target, UserRound } from "lucide-react";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { AnchorNav, type AnchorNavItem } from "@/src/shared/ui/AnchorNav";
import { usePreferencesQuery, useProfileQuery } from "../hooks/useProfileQuery";
import { useCurrentUserName } from "../hooks/useCurrentUserName";
import { useProfileCompletion } from "../hooks/useProfileCompletion";
import { useReferenceNames } from "../hooks/useReferenceNames";
import { AccountSection } from "./account/AccountSection";
import { BackgroundGoalsSection } from "./background/BackgroundGoalsSection";
import type { EditingState } from "./common/editing";
import { EducationSection } from "./education/EducationSection";
import { PROFILE_NEXT_STEP, type MatchFactor } from "./header/completion";
import { ProfileHeader } from "./header/ProfileHeader";
import { ProfileSectionSkeleton } from "./skeletons/ProfileSectionSkeleton";
import { SkillsLanguagesSection } from "./skills/SkillsLanguagesSection";
import { useTranslations } from "next-intl";

// Same order as the onboarding wizard. `cards` is how many placeholder cards each shows while
// the profile loads, mirroring the real section.
// Labels are profile.sections.<id>.
const SECTIONS = [
  { id: "education", icon: GraduationCap, cards: 1 },
  { id: "background", icon: Target, cards: 2 },
  { id: "skills", icon: Languages, cards: 2 },
  { id: "account", icon: UserRound, cards: 2 },
] as const;

// TODO: provide the five match factors with their filled / missing state once the API reports
// how each factor is weighted. Until then the header shows the percentage only, without a
// breakdown. The next step lives in PROFILE_NEXT_STEP, shared with the dashboard.
const MATCH_FACTORS: MatchFactor[] = [];

export function ProfilePage() {
  const t = useTranslations("profile");
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfileQuery();
  const { name: currentName, email } = useCurrentUserName();
  const completionPct = useProfileCompletion();
  const { data: preferences } = usePreferencesQuery();
  const names = useReferenceNames(profile, preferences);

  // One card edits at a time, so there's never more than one primary button on screen.
  const [editing, setEditing] = useState<string | null>(null);
  const edit: EditingState = { editing, start: setEditing, stop: () => setEditing(null) };

  const name = currentName || t("yourProfile");
  const sections: (AnchorNavItem & { cards: number })[] = SECTIONS.map((section) => ({
    ...section,
    label: t(`sections.${section.id}`),
  }));

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        name={name}
        email={email}
        photoUrl={profile?.profilePhotoUrl}
        completionPct={completionPct}
        isMatchable={profile?.isMatchable}
        nextStep={PROFILE_NEXT_STEP}
        matchFactors={MATCH_FACTORS}
      />

      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <AnchorNav items={sections} label={t("sectionsNav")} />

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          {isLoading ? (
            // The header and nav already have what they need (name and email from the signed-in
            // user, completion from the last known value); only the sections wait. They keep
            // their ids, since the nav observes them when it mounts.
            sections.map((section) => (
              <ProfileSectionSkeleton key={section.id} id={section.id} title={section.label} cards={section.cards} />
            ))
          ) : (
            <>
              <EducationSection
                levelId={profile?.educationLevelId}
                educations={profile?.educations ?? []}
                names={names}
                edit={edit}
              />
              <BackgroundGoalsSection profile={profile} preferences={preferences} names={names} edit={edit} />
              <SkillsLanguagesSection
                experiences={profile?.experiences ?? []}
                languages={profile?.languages ?? []}
                names={names}
                edit={edit}
              />
              <AccountSection profile={profile} accountEmail={user?.email} edit={edit} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
