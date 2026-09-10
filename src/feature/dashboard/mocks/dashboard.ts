// Mirrors the 4-step onboarding wizard (FR-2.1): Education, Background &
// Goals, Skills & Language, Documents.
export const PROFILE_COMPLETION = 70;

export const PROFILE_SECTIONS: { label: string; complete: boolean }[] = [
  { label: "Education", complete: true },
  { label: "Background & goals", complete: true },
  { label: "Skills & language", complete: false },
  { label: "Documents", complete: false },
];

