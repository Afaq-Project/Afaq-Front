import { STATUS_COLORS, type ApplicationStatusKey } from "@/src/shared/lib/status-colors";

/** The same statuses as the shared color config, so every status has colors. */
export type ApplicationStatus = ApplicationStatusKey;

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "not_started",
  "in_progress",
  "submitted",
  "in_review",
  "accepted",
  "rejected",
];

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  submitted: "Submitted",
  in_review: "In review",
  accepted: "Accepted",
  rejected: "Rejected",
};

export const STATUS_PROGRESS: Record<ApplicationStatus, number> = {
  not_started: 0,
  in_progress: 40,
  submitted: 75,
  in_review: 90,
  accepted: 100,
  rejected: 100,
};

// Action-button colors per status: the status's own chip colors, except "not started", whose
// "Start now" reads as a green call to action rather than the neutral badge gray.
export const STATUS_ACTION_CLASSES: Record<ApplicationStatus, string> = {
  not_started: "bg-primary-50 hover:opacity-80 text-primary-800",
  in_progress: `${STATUS_COLORS.in_progress.chip} hover:opacity-80`,
  submitted: `${STATUS_COLORS.submitted.chip} hover:opacity-80`,
  in_review: `${STATUS_COLORS.in_review.chip} hover:opacity-80`,
  accepted: `${STATUS_COLORS.accepted.chip} hover:opacity-80`,
  rejected: `${STATUS_COLORS.rejected.chip} hover:opacity-80`,
};

// Index into the detail page's 5-step stage tracker (Not Started, In
// Progress, Submitted, Under Review, Result) that a status has reached.
// accepted/rejected both resolve to the final "Result" step.
export const STATUS_STAGE_INDEX: Record<ApplicationStatus, number> = {
  not_started: 0,
  in_progress: 1,
  submitted: 2,
  in_review: 3,
  accepted: 4,
  rejected: 4,
};

// Longer-form status message for the detail page header pill — more
// specific than the list's STATUS_LABEL badge text.
export const STATUS_DETAIL_MESSAGE: Record<ApplicationStatus, string> = {
  not_started: "Not started yet",
  in_progress: "In progress",
  submitted: "Applied successfully",
  in_review: "Under review",
  accepted: "Offer received",
  rejected: "Not selected",
};
