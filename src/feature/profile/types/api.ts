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
export interface ApiNamedRef {
  id: string;
  name: string;
}

export interface ApiPersonalInfo {
  firstName?: string;
  lastName?: string;
  email?: string;
  dateOfBirth?: string;
  gender?: string;
  phone?: string;
  bio?: string;
  profilePhotoUrl?: string;
  nationality?: ApiNamedRef;
  countryOfResidence?: ApiNamedRef;
  currentCity?: ApiNamedRef;
  educationLevel?: ApiNamedRef;
  maritalStatus?: ApiNamedRef;
  experiences?: string[];
}

export interface ApiEducation {
  id: string;
  institution?: ApiNamedRef;
  major?: ApiNamedRef;
  minorMajor?: ApiNamedRef;
  educationLevel?: ApiNamedRef;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  gpaRaw?: number;
  gpaScale?: string;
  expectedGraduationDate?: string;
}

export interface ApiLanguageEntry {
  id: string;
  language: ApiNamedRef;
  proficiencyLevel: ApiNamedRef;
  isNative: boolean;
}

export interface ApiDocument {
  id: string;
  documentType?: ApiNamedRef;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt?: string;
  fileUrl?: string;
}

export interface ApiPreferences {
  targetDegrees?: ApiNamedRef[];
  targetMajors?: ApiNamedRef[];
  targetInstitutions?: ApiNamedRef[];
}

export interface ApiProfile {
  id?: string;
  personal?: ApiPersonalInfo;
  educations?: ApiEducation[];
  languages?: ApiLanguageEntry[];
  documents?: ApiDocument[];
  preferences?: ApiPreferences;
  completionPct?: number;
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
