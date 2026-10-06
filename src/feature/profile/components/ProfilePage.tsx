"use client";

import { useState } from "react";
import { GraduationCap, Languages, Target, UserRound } from "lucide-react";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { AnchorNav, type AnchorNavItem } from "@/src/shared/ui/AnchorNav";
import { usePreferencesQuery, useProfileQuery } from "../hooks/useProfileQuery";
import { useReferenceNames } from "../hooks/useReferenceNames";
import { fullName } from "../services/format";
import { AccountSection } from "./account/AccountSection";
import { BackgroundGoalsSection } from "./background/BackgroundGoalsSection";
import type { EditingState } from "./common/editing";
import { EducationSection } from "./education/EducationSection";
import type { MatchFactor, NextStep } from "./header/completion";
import { ProfileHeader } from "./header/ProfileHeader";
import { SkillsLanguagesSection } from "./skills/SkillsLanguagesSection";

// Same order as the onboarding wizard.
const SECTIONS: AnchorNavItem[] = [
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "background", label: "Background and goals", icon: Target },
  { id: "skills", label: "Skills and languages", icon: Languages },
  { id: "account", label: "Account", icon: UserRound },
];

// TODO: provide the next step (e.g. { label: "Add your GPA", impact: "Counts for 20% of your
// match score", href: "#education" }) and the five match factors with their filled / missing
// state once the API reports what's missing and how each factor is weighted. Until then the
// header shows the percentage only, without a breakdown.
const NEXT_STEP: NextStep | undefined = undefined;
const MATCH_FACTORS: MatchFactor[] = [];

export function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfileQuery();
  const { data: preferences } = usePreferencesQuery();
  const names = useReferenceNames(profile, preferences);

  // One card edits at a time, so there's never more than one primary button on screen.
  const [editing, setEditing] = useState<string | null>(null);
  const edit: EditingState = { editing, start: setEditing, stop: () => setEditing(null) };

  const name = fullName(profile?.firstName, profile?.lastName) || fullName(user?.firstName, user?.lastName) || "Your profile";

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader
        name={name}
        email={profile?.email ?? user?.email ?? ""}
        photoUrl={profile?.profilePhotoUrl}
        completionPct={profile?.completionPct ?? user?.userProfile?.completionPct ?? 0}
        isMatchable={profile?.isMatchable}
        nextStep={NEXT_STEP}
        matchFactors={MATCH_FACTORS}
      />

      <div className="flex flex-col gap-4 md:flex-row md:gap-8">
        <AnchorNav items={SECTIONS} label="Profile sections" />

        <div className="flex min-w-0 flex-1 flex-col gap-8">
          {isLoading ? (
            <p role="status" className="rounded-lg border border-neutral-100 bg-white p-5 text-body text-neutral-600">
              Loading your profile…
            </p>
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
