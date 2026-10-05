export type EducationLevel = "High School" | "Undergraduate" | "Graduate" | "PhD" | "";

export type GpaScale = "4.0" | "percent" | "letter";

export interface PersonalInfoData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  maritalStatusId?: string;
  countryOfResidence?: string;
  countryOfResidenceId?: string;
  currentCity?: string;
  currentCityId?: string;
}

export interface EducationData {
  educationLevel: string;
  educationLevelId?: string;
  nationality: string;
  nationalityId?: string;
  fieldsOfStudy: string[];
  fieldIds?: string[];
  institutionName?: string;
  institutionId?: string;
  gpa?: string;
  gpaScale?: GpaScale;
  startDate?: string;
  endDate?: string;
  expectedGraduationDate?: string;
  isCurrent?: boolean;
}

export type ExperienceLevel = "none" | "entry" | "mid" | "senior";
export type FinancialNeed = "yes" | "no" | "prefer_not";

export interface BackgroundData {
  phone?: string;
  bio?: string;
  experienceLevel: ExperienceLevel;
  financialNeed: FinancialNeed;
}

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

export interface LanguageItem {
  id: string;
  language: string;
  level: CefrLevel | string;
  languageId?: string;
  proficiencyLevelId?: string;
  isNative?: boolean;
}

export interface SkillsData {
  skills: string[];
  skillIds?: string[];
  languages: LanguageItem[];
}

export type DocumentSlotId = "resume" | "essay" | "transcript" | "recommendation" | "other";

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

export interface PreferencesData {
  targetDegreeLevel?: string;
  targetDegreeLevelId?: string;
  targetFields?: string[];
  targetFieldIds?: string[];
  targetCountries?: string[];
  targetCountryIds?: string[];
  targetInstitutions?: string[];
  targetInstitutionIds?: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  personal: PersonalInfoData;
  education: EducationData;
  preferences: PreferencesData;
  background: BackgroundData;
  skills: SkillsData;
  documents: DocumentsData;
}
