"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type {
  UserProfile,
  PersonalInfoData,
  EducationData,
  PreferencesData,
  BackgroundData,
  SkillsData,
  DocumentsData,
  DocumentItem,
  DocumentSlotId,
} from "../types";

export const INITIAL_PROFILE: UserProfile = {
  name: "",
  email: "",
  avatarUrl: "",
  personal: {},
  education: {
    educationLevel: "",
    fieldsOfStudy: [],
    nationality: "",
  },
  preferences: {
    targetFields: [],
    targetFieldIds: [],
    targetCountries: [],
    targetCountryIds: [],
    targetInstitutions: [],
    targetInstitutionIds: [],
  },
  background: {
    experienceLevel: "none",
    financialNeed: "prefer_not",
  },
  skills: {
    skills: [],
    languages: [],
  },
  documents: {
    resume: null,
    essay: null,
    transcript: null,
    recommendation: null,
    other: null,
  },
};

export function calculateProfileCompletion(profile: UserProfile): number {
  let score = 0;
  // Personal — 20%
  if (profile.personal.firstName && profile.personal.lastName) score += 5;
  if (profile.personal.dateOfBirth) score += 5;
  if (profile.personal.countryOfResidenceId) score += 5;
  if (profile.personal.gender) score += 5;

  // Education — 30%
  if (profile.education.educationLevel) score += 10;
  if (profile.education.fieldsOfStudy.length > 0) score += 10;
  if (profile.education.nationality) score += 10;

  // Skills — 25%
  if (profile.skills.skills.length > 0) score += 15;
  if (profile.skills.languages.length > 0) score += 10;

  // Documents — 25%
  const uploadedDocs = Object.values(profile.documents).filter(
    (doc): doc is DocumentItem => doc !== null && doc.status === "uploaded"
  );
  if (uploadedDocs.length > 0) score += 15;
  if (uploadedDocs.length > 1) score += 10;

  return Math.min(100, score);
}

interface ProfileContextType {
  profile: UserProfile;
  completionPercentage: number;
  updatePersonal: (data: PersonalInfoData) => void;
  updateEducation: (data: EducationData) => void;
  updatePreferences: (data: PreferencesData) => void;
  updateBackground: (data: BackgroundData) => void;
  updateSkills: (data: SkillsData) => void;
  updateDocuments: (data: DocumentsData) => void;
  addDocument: (doc: DocumentItem) => void;
  removeDocument: (slotId: DocumentSlotId) => void;
  resetToDefault: () => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

const STORAGE_KEY = "levora_user_profile";

function loadStoredProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return INITIAL_PROFILE;
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(loadStoredProfile);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  const updatePersonal = (data: PersonalInfoData) => {
    setProfile(prev => ({ ...prev, personal: data }));
  };

  const updateEducation = (data: EducationData) => {
    setProfile(prev => ({ ...prev, education: data }));
  };

  const updatePreferences = (data: PreferencesData) => {
    setProfile(prev => ({ ...prev, preferences: data }));
  };

  const updateBackground = (data: BackgroundData) => {
    setProfile(prev => ({ ...prev, background: data }));
  };

  const updateSkills = (data: SkillsData) => {
    setProfile(prev => ({ ...prev, skills: data }));
  };

  const updateDocuments = (data: DocumentsData) => {
    setProfile(prev => ({ ...prev, documents: data }));
  };

  const addDocument = (doc: DocumentItem) => {
    setProfile(prev => ({ ...prev, documents: { ...prev.documents, [doc.slotId]: doc } }));
  };

  const removeDocument = (slotId: DocumentSlotId) => {
    setProfile(prev => ({ ...prev, documents: { ...prev.documents, [slotId]: null } }));
  };

  const resetToDefault = () => {
    setProfile(INITIAL_PROFILE);
  };

  const completionPercentage = calculateProfileCompletion(profile);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        completionPercentage,
        updatePersonal,
        updateEducation,
        updatePreferences,
        updateBackground,
        updateSkills,
        updateDocuments,
        addDocument,
        removeDocument,
        resetToDefault,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile(): ProfileContextType {
  const context = useContext(ProfileContext);
  if (!context) {
    // Fallback for isolated SSR or tests
    return {
      profile: INITIAL_PROFILE,
      completionPercentage: calculateProfileCompletion(INITIAL_PROFILE),
      updatePersonal: () => {},
      updateEducation: () => {},
      updatePreferences: () => {},
      updateBackground: () => {},
      updateSkills: () => {},
      updateDocuments: () => {},
      addDocument: () => {},
      removeDocument: () => {},
      resetToDefault: () => {},
    };
  }
  return context;
}
