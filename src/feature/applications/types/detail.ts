import type { Tone } from "@/src/shared/ui/Badge";
import type { ApplicationSummary } from "./application";

export interface ApplicationDocument {
  id: string;
  name: string;
  fileType: "PDF" | "DOCX";
  size: string;
  tone: Tone;
}

export interface ApplicationActivityItem {
  id: string;
  label: string;
  timestamp: string;
}

export const DETAIL_STAGES = [
  "Not Started",
  "In Progress",
  "Submitted",
  "Under Review",
  "Result",
] as const;

export interface ApplicationDetail extends ApplicationSummary {
  program: string;
  term: string;
  progress: number;
  updatedAgo: string;
  officialSiteUrl: string;
  supportEmail: string;
  documents: ApplicationDocument[];
  /** Newest first. */
  activity: ApplicationActivityItem[];
}
