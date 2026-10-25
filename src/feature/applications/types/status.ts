import type { ApplicationStatusKey } from "@/src/shared/lib/status-colors";

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

export const STATUS_PROGRESS: Record<ApplicationStatus, number> = {
  not_started: 0,
  in_progress: 40,
  submitted: 75,
  in_review: 90,
  accepted: 100,
  rejected: 100,
};

// Step reached on the 5-step status timeline (Not started, In progress, Submitted, In review,
// Decision); accepted and rejected both land on the final "Decision" step.
export const STATUS_STAGE_INDEX: Record<ApplicationStatus, number> = {
  not_started: 0,
  in_progress: 1,
  submitted: 2,
  in_review: 3,
  accepted: 4,
  rejected: 4,
};
