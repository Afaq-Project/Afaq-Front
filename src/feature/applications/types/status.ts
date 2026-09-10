import type { Tone } from "@/src/shared/ui/Badge";

export type ApplicationStatus =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "accepted"
  | "rejected";

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "not_started",
  "in_progress",
  "submitted",
  "accepted",
  "rejected",
];

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  submitted: "Submitted",
  accepted: "Accepted",
  rejected: "Rejected",
};

export const STATUS_PROGRESS: Record<ApplicationStatus, number> = {
  not_started: 0,
  in_progress: 40,
  submitted: 75,
  accepted: 100,
  rejected: 100,
};

export const STATUS_TONE: Record<ApplicationStatus, Tone> = {
  not_started: "gray",
  in_progress: "blue",
  submitted: "green",
  accepted: "teal",
  rejected: "red",
};

// Action-button tone per status — distinct from STATUS_TONE (the badge
// color) so "Start now" can read as a primary call-to-action rather than
// the badge's neutral "not started" gray.
export const ACTION_TONE: Record<ApplicationStatus, Tone> = {
  not_started: "green",
  in_progress: "blue",
  submitted: "green",
  accepted: "teal",
  rejected: "red",
};

// A touch bolder than Badge's default pale tone, for the status column
// specifically — the semantic colors have no stop between 50 and 400, so
// blue/amber/teal/red borrow 400 at reduced opacity; green has a real 100
// stop to reach for instead.
export const STATUS_BADGE_TINT: Partial<Record<Tone, string>> = {
  blue: "bg-info-400/25",
  green: "bg-primary-100",
  amber: "bg-warning-400/25",
  teal: "bg-success-400/25",
  red: "bg-danger-400/25",
};

export const TONE_BUTTON_CLASSES: Record<Tone, string> = {
  gray: "bg-neutral-100 hover:opacity-80 text-neutral-800",
  blue: "bg-info-50 hover:opacity-80 text-info-800",
  green: "bg-primary-50 hover:opacity-80 text-primary-800",
  amber: "bg-warning-50 hover:opacity-80 text-warning-800",
  teal: "bg-success-50 hover:opacity-80 text-success-800",
  red: "bg-danger-50 hover:opacity-80 text-danger-800",
};

export type DeadlineTone = "danger" | "warning" | "info";

export const DEADLINE_TONE_TEXT: Record<DeadlineTone, string> = {
  danger: "text-danger-600",
  warning: "text-warning-600",
  info: "text-info-600",
};

// Index into the detail page's 5-step stage tracker (Not Started, In
// Progress, Submitted, Under Review, Result) that a status has reached.
// accepted/rejected both resolve to the final "Result" step.
export const STATUS_STAGE_INDEX: Record<ApplicationStatus, number> = {
  not_started: 0,
  in_progress: 1,
  submitted: 2,
  accepted: 4,
  rejected: 4,
};

// Longer-form status message for the detail page header pill — more
// specific than the list's STATUS_LABEL badge text.
export const STATUS_DETAIL_MESSAGE: Record<ApplicationStatus, string> = {
  not_started: "Not started yet",
  in_progress: "In progress",
  submitted: "Applied successfully",
  accepted: "Offer received",
  rejected: "Not selected",
};
