import { isoDateFromToday } from "@/src/shared/lib/deadline";
import { APPLICATIONS } from "./applications";
import type { ApplicationSummary } from "../types/application";
import type { ApplicationActivityItem, ApplicationDetail, ApplicationDocument } from "../types/detail";

const TRANSCRIPT: ApplicationDocument = {
  id: "transcript",
  name: "Academic_Transcript.pdf",
  fileType: "PDF",
  size: "2.4 MB",
  type: "transcript",
};
const STATEMENT: ApplicationDocument = {
  id: "sop",
  name: "Statement_of_Purpose.docx",
  fileType: "DOCX",
  size: "1.1 MB",
  type: "essay",
};
const ENGLISH: ApplicationDocument = {
  id: "english",
  name: "IELTS_Certificate.pdf",
  fileType: "PDF",
  size: "850 KB",
  type: "language",
};

/** Linked documents grow as an application moves along. */
function documentsFor(application: ApplicationSummary): ApplicationDocument[] {
  switch (application.status) {
    case "not_started":
      return [];
    case "in_progress":
      return [TRANSCRIPT, ENGLISH];
    default:
      return [TRANSCRIPT, STATEMENT, ENGLISH];
  }
}

/** A plausible history for the application's status, newest first, dated relative to today. */
function activityFor(application: ApplicationSummary): ApplicationActivityItem[] {
  const items: ApplicationActivityItem[] = [
    { id: "tracked", kind: "status", status: "not_started", label: "Started tracking", at: isoDateFromToday(-21) },
  ];
  const { status } = application;
  if (status !== "not_started") {
    items.unshift(
      { id: "progress", kind: "status", status: "in_progress", label: "Moved to In progress", at: isoDateFromToday(-14) },
      { id: "doc-transcript", kind: "document", label: "Linked Academic_Transcript.pdf", at: isoDateFromToday(-12) },
      { id: "reminder-14", kind: "reminder", label: "Deadline reminder sent", at: isoDateFromToday(-9) },
    );
    items.sort((a, b) => b.at.localeCompare(a.at));
  }
  if (status === "submitted" || status === "in_review" || status === "accepted" || status === "rejected") {
    items.unshift({
      id: "submitted",
      kind: "status",
      status: "submitted",
      label: "Moved to Submitted",
      at: application.submittedAt ?? isoDateFromToday(-6),
    });
  }
  if (status === "in_review" || status === "accepted" || status === "rejected") {
    items.unshift({ id: "review", kind: "status", status: "in_review", label: "Moved to In review", at: isoDateFromToday(-3) });
  }
  if (status === "accepted" || status === "rejected") {
    items.unshift({
      id: "decision",
      kind: "status",
      status,
      label: status === "accepted" ? "Decision: accepted" : "Decision: not selected",
      at: application.decidedAt ?? isoDateFromToday(-1),
    });
  }
  return items;
}

export const APPLICATION_DETAILS: ApplicationDetail[] = APPLICATIONS.map((application) => ({
  ...application,
  // TODO: the API should send the deadline date; here it follows the (opportunity-synced) daysLeft.
  deadlineDate: isoDateFromToday(application.daysLeft),
  documents: documentsFor(application),
  activity: activityFor(application),
  reminderDays: [14, 7, 3, 1],
  notes: application.id === "3" ? "Asked Dr. Haddad for a recommendation on Monday." : undefined,
}));
