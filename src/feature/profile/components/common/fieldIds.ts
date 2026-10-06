/**
 * Input IDs shared by the profile's view cards (whose "Add …" actions focus them) and the
 * editors (which render them).
 */
export const FIELD_IDS = {
  educationLevel: "profile-education-level",
  institution: "profile-edu-institution",
  major: "profile-edu-major",
  minor: "profile-edu-minor",
  gpa: "profile-edu-gpa",
  startDate: "profile-edu-start",
  nationality: "profile-nationality",
  country: "profile-country",
  city: "profile-city",
  dateOfBirth: "profile-dob",
  gender: "profile-gender",
  maritalStatus: "profile-marital",
  bio: "profile-bio",
  firstName: "profile-first-name",
  lastName: "profile-last-name",
  phone: "profile-phone",
  targetDegrees: "profile-target-degrees",
  targetMajors: "profile-target-majors",
  targetInstitutions: "profile-target-institutions",
} as const;

export const REQUIRED_FOR_MATCHING = "Required for matching";
