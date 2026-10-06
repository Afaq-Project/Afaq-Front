export * from "./documents";

/** A selectable reference item (country, major, institution…) as the step forms use it. */
export interface Option {
  id: string;
  name: string;
}

/** Values accepted by the API's `gpaScale`. The legacy values are still used by the current step pages. */
export type GpaScale = "OUT_OF_4" | "OUT_OF_5" | "OUT_OF_100" | LegacyGpaScale;

export interface PersonalInfoData {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: string;
  nationality?: string;
  nationalityId?: string;
  maritalStatus?: string;
  maritalStatusId?: string;
  countryOfResidence?: string;
  countryOfResidenceId?: string;
  currentCity?: string;
  currentCityId?: string;
}

export interface EducationData {
  /** ID of the education record onboarding created, so re-saving updates it instead of duplicating. */
  serverId?: string;
  educationLevel: string;
  educationLevelId?: string;
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

export interface LanguageItem {
  /** Local row ID — not the API language ID. */
  id: string;
  language: string;
  level: string;
  languageId?: string;
  proficiencyLevelId?: string;
  isNative?: boolean;
}

export interface SkillsData {
  skills: string[];
  skillIds?: string[];
  languages: LanguageItem[];
}

/** Everything onboarding last saved, kept locally between steps. */
export interface OnboardingDraft {
  personal: PersonalInfoData;
  education: EducationData;
  preferences: PreferencesData;
  skills: SkillsData;
}

// ─── Legacy types still used by the current step pages; removed once they are replaced ───
export type LegacyGpaScale = "4.0" | "percent" | "letter";

export type EducationLevel = "High School" | "Undergraduate" | "Graduate" | "PhD" | "";

export interface BackgroundData {
  phone?: string;
  bio?: string;
}

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2" | "Native";

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
