"use client";

import { useState } from "react";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { usePreferencesQuery, useProfileQuery } from "../hooks/useProfileQuery";
import { useReferenceNames } from "../hooks/useReferenceNames";
import { fullName } from "../services/format";
import type { ApiEducation } from "../types/api";
import { AddLanguageModal } from "./background/AddLanguageModal";
import { LanguagesSection } from "./background/LanguagesSection";
import { SkillsSection } from "./background/SkillsSection";
import { StudyGoalsSection } from "./background/StudyGoalsSection";
import { EditEducationModal } from "./education/EditEducationModal";
import { EducationSection } from "./education/EducationSection";
import { ProfileHeader } from "./layout/ProfileHeader";
import { ProfileTabNav, type ProfileTabId } from "./layout/ProfileTabNav";
import { EditPersonalModal } from "./personal/EditPersonalModal";
import { PersonalDetailsSection } from "./personal/PersonalDetailsSection";

/** Which edit modal is open. Modals mount only while open, so each form starts from current data. */
type OpenModal =
  | { type: "personal" }
  | { type: "education"; education: ApiEducation | null }
  | { type: "language" }
  | null;

export function ProfilePage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfileQuery();
  const { data: preferences } = usePreferencesQuery();
  const names = useReferenceNames(profile, preferences);

  const [activeTab, setActiveTab] = useState<ProfileTabId>("personal");
  const [modal, setModal] = useState<OpenModal>(null);
  const closeModal = () => setModal(null);

  const languages = profile?.languages ?? [];
  const name = fullName(profile?.firstName, profile?.lastName) || fullName(user?.firstName, user?.lastName) || "—";

  return (
    <div className="flex flex-col gap-5 w-full max-w-5xl mx-auto">
      {modal?.type === "personal" && <EditPersonalModal profile={profile} names={names} onClose={closeModal} />}
      {modal?.type === "education" && (
        <EditEducationModal
          key={modal.education?.id ?? "new"}
          education={modal.education}
          names={names}
          onClose={closeModal}
        />
      )}
      {modal?.type === "language" && (
        <AddLanguageModal existingLanguageIds={languages.map((l) => l.languageId)} onClose={closeModal} />
      )}

      <ProfileHeader
        name={name}
        email={profile?.email ?? user?.email ?? "—"}
        photoUrl={profile?.profilePhotoUrl}
        completionPct={profile?.completionPct ?? user?.userProfile?.completionPct ?? 0}
        isMatchable={profile?.isMatchable}
      />

      <div className="flex flex-col md:flex-row gap-5">
        <ProfileTabNav active={activeTab} onChange={setActiveTab} />

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="bg-neutral-50 rounded-xl border border-neutral-100 p-8 flex items-center justify-center">
              <div className="flex items-center gap-3 text-neutral-400" role="status">
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="text-sm">Loading profile…</span>
              </div>
            </div>
          ) : (
            <>
              {activeTab === "personal" && (
                <PersonalDetailsSection
                  profile={profile}
                  names={names}
                  onEdit={() => setModal({ type: "personal" })}
                />
              )}

              {activeTab === "background" && (
                <div className="flex flex-col gap-5">
                  <SkillsSection experiences={profile?.experiences ?? []} names={names} />
                  <LanguagesSection
                    languages={languages}
                    names={names}
                    onAdd={() => setModal({ type: "language" })}
                  />
                  <StudyGoalsSection preferences={preferences} names={names} />
                </div>
              )}

              {activeTab === "education" && (
                <EducationSection
                  currentLevelId={profile?.educationLevelId}
                  educations={profile?.educations ?? []}
                  names={names}
                  onAdd={() => setModal({ type: "education", education: null })}
                  onEdit={(education) => setModal({ type: "education", education })}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
