"use client";

import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type {
  UserProfile,
  EducationData,
  BackgroundData,
  SkillsData,
  DocumentsData,
  DocumentItem,
  DocumentSlotId,
} from "../types";

export const INITIAL_PROFILE: UserProfile = {
  name: "Alex Johnson",
  email: "alex.johnson@example.com",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80&auto=format&fit=crop",
  education: {
    educationLevel: "Graduate",
    fieldsOfStudy: ["Computer Science", "Data Analytics"],
    nationality: "United States",
  },
  background: {
    gpa: "3.8",
    gpaScale: "4.0",
    experienceLevel: "mid",
    financialNeed: "no",
    goals:
      "Seeking opportunities to lead impactful machine learning projects and expand international academic collaboration.",
  },
  skills: {
    skills: ["Python", "Data Analysis", "UI Design", "Machine Learning"],
    languages: [
      { id: "lang-1", language: "English", level: "C2" },
      { id: "lang-2", language: "Spanish", level: "B1" },
    ],
  },
  documents: {
    resume: {
      id: "doc-1",
      slotId: "resume",
      name: "Resume_Alex_J.pdf",
      size: "2.4 MB",
      type: "application/pdf",
      uploadedAt: "Uploaded Jan 12",
      status: "uploaded",
      progress: 100,
    },
    essay: null,
    transcript: {
      id: "doc-2",
      slotId: "transcript",
      name: "Transcript_Official.png",
      size: "1.1 MB",
      type: "image/png",
      uploadedAt: "Uploaded Dec 05",
      status: "uploaded",
      progress: 100,
    },
    recommendation: null,
    other: null,
  },
};

export function calculateProfileCompletion(profile: UserProfile): number {
  let score = 0;
  // Education contributes up to 30%
  if (profile.education.educationLevel) score += 10;
  if (profile.education.fieldsOfStudy.length > 0) score += 10;
  if (profile.education.nationality) score += 10;

  // Background contributes up to 25%
  if (profile.background.gpa) score += 10;
  if (profile.background.experienceLevel) score += 10;
  if (profile.background.goals) score += 5;

  // Skills contribute up to 25%
  if (profile.skills.skills.length > 0) score += 15;
  if (profile.skills.languages.length > 0) score += 10;

  // Documents contribute up to 20%
  const uploadedDocs = Object.values(profile.documents).filter(
    (doc): doc is DocumentItem => doc !== null && doc.status === "uploaded"
  );
  if (uploadedDocs.length > 0) score += 10;
  if (uploadedDocs.length > 1) score += 10;

  return Math.min(100, score);
}

interface ProfileContextType {
  profile: UserProfile;
  completionPercentage: number;
  updateEducation: (data: EducationData) => void;
  updateBackground: (data: BackgroundData) => void;
  updateSkills: (data: SkillsData) => void;
  updateDocuments: (data: DocumentsData) => void;
  addDocument: (doc: DocumentItem) => void;
  removeDocument: (slotId: DocumentSlotId) => void;
  resetToDefault: () => void;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

const STORAGE_KEY = "levora_user_profile";

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
    setIsHydrated(true);
  }, []);

  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch {
      // ignore
    }
  };

  const updateEducation = (data: EducationData) => {
    saveProfile({ ...profile, education: data });
  };

  const updateBackground = (data: BackgroundData) => {
    saveProfile({ ...profile, background: data });
  };

  const updateSkills = (data: SkillsData) => {
    saveProfile({ ...profile, skills: data });
  };

  const updateDocuments = (data: DocumentsData) => {
    saveProfile({ ...profile, documents: data });
  };

  const addDocument = (doc: DocumentItem) => {
    const updatedDocs: DocumentsData = {
      ...profile.documents,
      [doc.slotId]: doc,
    };
    saveProfile({ ...profile, documents: updatedDocs });
  };

  const removeDocument = (slotId: DocumentSlotId) => {
    const updatedDocs: DocumentsData = {
      ...profile.documents,
      [slotId]: null,
    };
    saveProfile({ ...profile, documents: updatedDocs });
  };

  const resetToDefault = () => {
    saveProfile(INITIAL_PROFILE);
  };

  const completionPercentage = calculateProfileCompletion(profile);

  return (
    <ProfileContext.Provider
      value={{
        profile,
        completionPercentage,
        updateEducation,
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
      updateEducation: () => {},
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
