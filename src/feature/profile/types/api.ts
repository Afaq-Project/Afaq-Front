// Reference data shapes returned by /reference/* endpoints
export interface RefCountry {
  id: string;
  nameEn: string;
  nameAr?: string;
  nationalityNameEn?: string;
  nationalityNameAr?: string;
  isoCode?: string;
  isoCode2?: string;
  regionEn?: string;
}

export interface RefCity {
  id: string;
  nameEn: string;
  nameAr?: string;
  countryId?: string;
}

export interface RefEducationLevel {
  id: string;
  nameEn: string;
  nameAr?: string;
}

export interface RefMajorCategory {
  id: string;
  nameEn: string;
  nameAr?: string;
}

export interface RefMajor {
  id: string;
  nameEn: string;
  nameAr?: string;
  categoryId?: string;
}

export interface RefLanguage {
  id: string;
  nameEn: string;
  nameAr?: string;
}

export interface RefProficiencyLevel {
  id: string;
  nameEn: string;
  nameAr?: string;
  code?: string;
}

export interface RefDocumentType {
  id: string;
  nameEn: string;
  nameAr?: string;
}

export interface RefInstitution {
  id: string;
  nameEn: string;
  nameAr?: string;
  country?: { id: string; nameEn: string };
}

export interface RefStandardizedTest {
  id: string;
  name: string;
}

export interface RefSpecialStatus {
  id: string;
  name: string;
}

export interface RefMaritalStatus {
  id: string;
  nameEn: string;
  nameAr?: string;
}

// Profile API shapes returned by /profile/* endpoints
// All fields are flat — no nested name objects, only IDs for references.

export interface ApiProfile {
  userId: string;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  phone?: string | null;
  profilePhotoUrl?: string | null;
  completionPct: number;
  email?: string | null;
  gender?: string | null;
  bio?: string | null;
  maritalStatusId?: string | null;
  nationalityId?: string | null;
  countryOfResidenceId?: string | null;
  currentCityId?: string | null;
  educationLevelId?: string | null;
  isMatchable?: boolean;
  experiences?: string[];
  languages: ApiLanguageEntry[];
  educations: ApiEducation[];
  documents: ApiDocument[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiEducation {
  id: string;
  userId?: string;
  educationLevelId?: string | null;
  institutionId?: string | null;
  majorId?: string | null;
  minorMajorId?: string | null;
  gpaRaw?: number | null;
  gpaScale?: string | null;
  isCurrent?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  expectedGraduationDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiLanguageEntry {
  userId: string;
  languageId: string;
  proficiencyLevelId: string;
  isNative: boolean;
}

export interface ApiDocument {
  id: string;
  userId?: string;
  displayName?: string;
  storagePath?: string;
  mimeType?: string;
  sizeBytes?: number;
  documentTypeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiPreferences {
  targetDegrees?: { userId: string; educationLevelId: string }[];
  targetMajors?: { userId: string; majorId: string }[];
  targetInstitutions?: { userId: string; institutionId: string }[];
}

// Request shapes for mutations
export interface UpdatePersonalPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  maritalStatusId?: string;
  phone?: string;
  bio?: string;
  profilePhotoUrl?: string;
  countryOfResidenceId?: string;
  nationalityId?: string;
  currentCityId?: string;
  educationLevelId?: string;
  experiences?: string[];
}

export interface CreateEducationPayload {
  institutionId?: string;
  majorId?: string;
  minorMajorId?: string;
  educationLevelId?: string;
  startDate?: string;
  endDate?: string;
  expectedGraduationDate?: string;
  isCurrent?: boolean;
  gpaRaw?: number;
  gpaScale?: string;
}

export interface AddLanguagePayload {
  languageId: string;
  proficiencyLevelId: string;
  isNative?: boolean;
}

export interface UpdatePreferencesPayload {
  targetDegreeIds?: string[];
  targetMajorIds?: string[];
  targetInstitutionIds?: string[];
  targetCountryIds?: string[];
}
