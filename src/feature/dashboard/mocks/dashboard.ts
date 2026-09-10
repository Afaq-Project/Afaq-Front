import type { ApplicationStatus } from "../types/status";

export interface ApplicationSummary {
  id: string;
  title: string;
  provider: string;
  type: "Scholarship" | "Internship";
  status: ApplicationStatus;
  daysLeft: number;
}

export const APPLICATIONS: ApplicationSummary[] = [
  {
    id: "1",
    title: "Global Excellence Scholarship",
    provider: "Open Horizons Foundation",
    type: "Scholarship",
    status: "not_started",
    daysLeft: 15,
  },
  {
    id: "2",
    title: "Frontier Research Fellowship",
    provider: "Meridian Institute",
    type: "Scholarship",
    status: "not_started",
    daysLeft: 23,
  },
  {
    id: "3",
    title: "Product Design Internship",
    provider: "Northwind Labs",
    type: "Internship",
    status: "in_progress",
    daysLeft: 7,
  },
  {
    id: "4",
    title: "Data Science Summer Internship",
    provider: "Arcline Analytics",
    type: "Internship",
    status: "in_progress",
    daysLeft: 10,
  },
  {
    id: "5",
    title: "Women in STEM Grant",
    provider: "Beacon Trust",
    type: "Scholarship",
    status: "submitted",
    daysLeft: 1,
  },
];

// Mirrors the 4-step onboarding wizard (FR-2.1): Education, Background &
// Goals, Skills & Language, Documents.
export const PROFILE_COMPLETION = 70;

export const PROFILE_SECTIONS: { label: string; complete: boolean }[] = [
  { label: "Education", complete: true },
  { label: "Background & goals", complete: true },
  { label: "Skills & language", complete: false },
  { label: "Documents", complete: false },
];

