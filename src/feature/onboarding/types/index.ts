export type EducationLevel =
  | "High School"
  | "Undergraduate"
  | "Graduate"
  | "PhD"
  | "";

export interface EducationData {
  educationLevel: string;
  fieldsOfStudy: string[];
  nationality: string;
}

export type GpaScale = "4.0" | "percent" | "letter";
export type ExperienceLevel = "none" | "entry" | "mid" | "senior";
export type FinancialNeed = "yes" | "no" | "prefer_not";

export interface BackgroundData {
  gpa: string;
  gpaScale: GpaScale;
  experienceLevel: ExperienceLevel;
  financialNeed: FinancialNeed;
  goals: string;
}

export type CefrLevel =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2"
  | "Native";

export interface LanguageItem {
  id: string;
  language: string;
  level: CefrLevel | string;
}

export interface SkillsData {
  skills: string[];
  languages: LanguageItem[];
}

export type DocumentSlotId =
  | "resume"
  | "essay"
  | "transcript"
  | "recommendation"
  | "other";

export interface DocumentItem {
  id: string;
  slotId: DocumentSlotId;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  status: "idle" | "uploading" | "uploaded" | "error";
  progress: number;
  errorMessage?: string;
}

export type DocumentsData = Record<DocumentSlotId, DocumentItem | null>;

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  education: EducationData;
  background: BackgroundData;
  skills: SkillsData;
  documents: DocumentsData;
}
