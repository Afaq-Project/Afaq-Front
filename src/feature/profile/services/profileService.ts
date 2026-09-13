import apiClient from "@/src/shared/lib/api/axios-client";
import type {
  UserProfile,
  EducationData,
  BackgroundData,
  SkillsData,
  DocumentsData,
} from "../types";

export const EMPTY_PROFILE: UserProfile = {
  name: "",
  email: "",
  avatarUrl: "",
  education: {
    educationLevel: "",
    fieldsOfStudy: [],
    nationality: "",
  },
  background: {
    gpa: "",
    gpaScale: "4.0",
    experienceLevel: "entry",
    financialNeed: "prefer_not",
    goals: "",
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapApiDataToProfile(data: any, fallback: UserProfile): UserProfile {
  if (!data || typeof data !== "object") return fallback;

  // Response can be { profile: ... } or { userProfile: ... } or flat
  const p = data.profile || data.userProfile || data;
  const u = data.user || data;

  const firstName = u.firstName || data.firstName || "";
  const lastName = u.lastName || data.lastName || "";
  const fullName =
    firstName && lastName
      ? `${firstName} ${lastName}`
      : firstName || p.fullName || p.name || fallback.name;

  const email = u.email || data.email || p.email || fallback.email;
  const avatarUrl =
    p.avatarUrl ||
    p.avatar ||
    p.profilePictureUrl ||
    u.avatarUrl ||
    fallback.avatarUrl;

  const education: EducationData = {
    educationLevel:
      p.education?.educationLevel ??
      p.educationLevel ??
      fallback.education?.educationLevel ??
      "",
    fieldsOfStudy:
      p.education?.fieldsOfStudy ??
      (Array.isArray(p.fieldsOfStudy)
        ? p.fieldsOfStudy
        : fallback.education?.fieldsOfStudy ?? []),
    nationality:
      p.education?.nationality ??
      p.nationality ??
      fallback.education?.nationality ??
      "",
  };

  const background: BackgroundData = {
    gpa:
      p.background?.gpa ??
      p.gpa ??
      fallback.background?.gpa ??
      "",
    gpaScale:
      p.background?.gpaScale ??
      p.gpaScale ??
      fallback.background?.gpaScale ??
      "4.0",
    experienceLevel:
      p.background?.experienceLevel ??
      p.experienceLevel ??
      fallback.background?.experienceLevel ??
      "entry",
    financialNeed:
      p.background?.financialNeed ??
      p.financialNeed ??
      fallback.background?.financialNeed ??
      "prefer_not",
    goals:
      p.background?.goals ??
      p.goals ??
      fallback.background?.goals ??
      "",
  };

  const skills: SkillsData = {
    skills:
      p.skills?.skills ??
      (Array.isArray(p.skills)
        ? p.skills
        : fallback.skills?.skills ?? []),
    languages:
      p.skills?.languages ??
      (Array.isArray(p.languages)
        ? p.languages
        : fallback.skills?.languages ?? []),
  };

  const documents: DocumentsData = {
    resume: p.documents?.resume ?? p.resume ?? fallback.documents?.resume ?? null,
    essay: p.documents?.essay ?? p.essay ?? fallback.documents?.essay ?? null,
    transcript:
      p.documents?.transcript ??
      p.transcript ??
      fallback.documents?.transcript ??
      null,
    recommendation:
      p.documents?.recommendation ??
      p.recommendation ??
      fallback.documents?.recommendation ??
      null,
    other: p.documents?.other ?? p.other ?? fallback.documents?.other ?? null,
  };

  return {
    name: fullName,
    email,
    avatarUrl,
    education,
    background,
    skills,
    documents,
  };
}

export function mapProfileToApiPayload(profile: UserProfile): Record<string, unknown> {
  return {
    fullName: profile.name,
    name: profile.name,
    email: profile.email,
    avatarUrl: profile.avatarUrl,
    education: profile.education,
    educationLevel: profile.education.educationLevel,
    fieldsOfStudy: profile.education.fieldsOfStudy,
    nationality: profile.education.nationality,
    background: profile.background,
    gpa: profile.background.gpa,
    gpaScale: profile.background.gpaScale,
    experienceLevel: profile.background.experienceLevel,
    financialNeed: profile.background.financialNeed,
    goals: profile.background.goals,
    skills: profile.skills,
    documents: profile.documents,
  };
}

export const profileService = {
  /**
   * Fetches user profile from GET /profile.
   * Directly queries GET /profile and propagates any server/network errors.
   */
  async getProfile(): Promise<UserProfile> {
    const data = await apiClient.get<unknown>("/profile");
    return mapApiDataToProfile(data, EMPTY_PROFILE);
  },

  /**
   * Updates user profile via PATCH /profile.
   */
  async updateProfile(profile: UserProfile): Promise<unknown> {
    const payload = mapProfileToApiPayload(profile);
    return apiClient.patch("/profile", payload);
  },
};
