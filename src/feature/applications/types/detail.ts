import type { DocumentTypeKey } from "@/src/shared/lib/document-types";
import type { ApplicationSummary } from "./application";
import type { ApplicationStatus } from "./status";

export interface ApplicationDocument {
  id: string;
  name: string;
  /** e.g. "PDF", "DOCX". */
  fileType: string;
  size: string;
  /** Its document type; a required document only counts as linked when this matches. */
  type?: DocumentTypeKey;
}

/** "tracked" is the first entry; its text and the others' are applications.activity.*. */
export type ActivityKind = "tracked" | "status" | "document" | "reminder";

export interface ApplicationActivityItem {
  id: string;
  kind: ActivityKind;
  /** For linked documents: the file name. */
  documentName?: string;
  /** ISO date (YYYY-MM-DD). */
  at: string;
  /** For tracking and status changes: the status it moved to (colors the dot). */
  status?: ApplicationStatus;
}

export interface ApplicationDetail extends ApplicationSummary {
  /** ISO date (YYYY-MM-DD); the countdown is computed from it. */
  deadlineDate: string;
  documents: ApplicationDocument[];
  /** Newest first. */
  activity: ApplicationActivityItem[];
  notes?: string;
  /** Days before the deadline when reminders go out; the header hides the note without it. */
  reminderDays?: number[];
}
