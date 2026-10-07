"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import type { EducationData, OnboardingDraft, PersonalInfoData, PreferencesData, SkillsData } from "../types";

export const EMPTY_DRAFT: OnboardingDraft = {
  personal: {},
  education: { educationLevel: "", fieldsOfStudy: [] },
  preferences: {
    targetFields: [],
    targetFieldIds: [],
    targetCountries: [],
    targetCountryIds: [],
    targetInstitutions: [],
    targetInstitutionIds: [],
  },
  skills: { skills: [], languages: [] },
};

// Kept per user so a second account on the same browser never sees someone else's answers.
// The key predates this context; it is kept so drafts in progress survive.
const LEGACY_STORAGE_KEY = "levora_user_profile";
const storageKey = (userId: string) => `${LEGACY_STORAGE_KEY}:${userId}`;

function loadDraft(userId?: string): OnboardingDraft {
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
    const stored = userId ? localStorage.getItem(storageKey(userId)) : null;
    if (stored) {
      const parsed = JSON.parse(stored) as Partial<OnboardingDraft>;
      return {
        personal: parsed.personal ?? EMPTY_DRAFT.personal,
        education: parsed.education ?? EMPTY_DRAFT.education,
        preferences: parsed.preferences ?? EMPTY_DRAFT.preferences,
        skills: parsed.skills ?? EMPTY_DRAFT.skills,
      };
    }
  } catch {
    // Unreadable or unavailable storage — start fresh.
  }
  return EMPTY_DRAFT;
}

interface OnboardingDraftContextValue {
  draft: OnboardingDraft;
  updatePersonal: (data: PersonalInfoData) => void;
  updateEducation: (data: EducationData) => void;
  updatePreferences: (data: PreferencesData) => void;
  updateSkills: (data: SkillsData) => void;
  clearDraft: () => void;
}

const OnboardingDraftContext = createContext<OnboardingDraftContextValue | null>(null);

/** What onboarding last saved, kept locally between steps (and page reloads). */
export function OnboardingDraftProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [draft, setDraft] = useState<OnboardingDraft>(() => loadDraft(userId));

  useEffect(() => {
    if (!userId) return;
    try {
      localStorage.setItem(storageKey(userId), JSON.stringify(draft));
    } catch {
      // Storage unavailable — the draft just won't survive a reload.
    }
  }, [draft, userId]);

  const updatePersonal = useCallback((personal: PersonalInfoData) => setDraft((d) => ({ ...d, personal })), []);
  const updateEducation = useCallback((education: EducationData) => setDraft((d) => ({ ...d, education })), []);
  const updatePreferences = useCallback((preferences: PreferencesData) => setDraft((d) => ({ ...d, preferences })), []);
  const updateSkills = useCallback((skills: SkillsData) => setDraft((d) => ({ ...d, skills })), []);
  const clearDraft = useCallback(() => setDraft(EMPTY_DRAFT), []);

  const value = useMemo(
    () => ({ draft, updatePersonal, updateEducation, updatePreferences, updateSkills, clearDraft }),
    [draft, updatePersonal, updateEducation, updatePreferences, updateSkills, clearDraft],
  );

  return <OnboardingDraftContext.Provider value={value}>{children}</OnboardingDraftContext.Provider>;
}

export function useOnboardingDraft(): OnboardingDraftContextValue {
  const context = useContext(OnboardingDraftContext);
  if (!context) {
    throw new Error("useOnboardingDraft must be used within an OnboardingDraftProvider");
  }
  return context;
}
