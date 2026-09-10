import { ApplicationSummary } from "../types/application";
import type { ApplicationDetail } from "../types/detail";
import {
  ApplicationStatus,
  DEADLINE_TONE_TEXT,
  DeadlineTone,
} from "../types/status";
import { ApplicationFilterState } from "../types/filters";
import { APPLICATION_DETAILS } from "../mocks/applicationDetails";

export function getDeadlineTone(daysLeft: number): DeadlineTone {
  if (daysLeft <= 7) return "danger";
  if (daysLeft <= 14) return "warning";
  return "info";
}

export function formatDeadline(daysLeft: number): string {
  if (daysLeft <= 0) return "Ends today";
  if (daysLeft === 1) return "Ends tomorrow";
  return `Ends in ${daysLeft} days`;
}

const RESOLVED_STATUSES: ApplicationStatus[] = ["accepted", "rejected"];

/** "Ends today" always reads as urgent, even for a resolved application —
 * everything else on a resolved row falls back to neutral since its
 * deadline no longer carries urgency. */
export function getDeadlineTextClass(application: ApplicationSummary): string {
  if (application.daysLeft <= 0) {
    return `${DEADLINE_TONE_TEXT.danger} underline`;
  }

  if (RESOLVED_STATUSES.includes(application.status)) {
    return "text-neutral-600";
  }

  return DEADLINE_TONE_TEXT[getDeadlineTone(application.daysLeft)];
}

export interface ApplicationAction {
  label: string;
}

export const APPLICATION_ACTIONS: Record<ApplicationStatus, ApplicationAction> =
  {
    not_started: { label: "Start now" },
    in_progress: { label: "Complete application" },
    submitted: { label: "Details" },
    rejected: { label: "Details" },
    accepted: { label: "See results" },
  };

export function getApplicationAction(
  status: ApplicationStatus,
): ApplicationAction {
  return APPLICATION_ACTIONS[status];
}

export interface ApplicationsSummary {
  total: number;
  submitted: number;
  upcomingDeadlines: number;
  accepted: number;
}

export function getApplicationsSummary(
  applications: ApplicationSummary[],
): ApplicationsSummary {
  return {
    total: applications.length,
    submitted: applications.filter((a) => a.status === "submitted").length,
    upcomingDeadlines: applications.filter(
      (a) => !RESOLVED_STATUSES.includes(a.status) && a.daysLeft <= 7,
    ).length,
    accepted: applications.filter((a) => a.status === "accepted").length,
  };
}

export function filterApplications(
  applications: ApplicationSummary[],
  filters: ApplicationFilterState,
): ApplicationSummary[] {
  const search = filters.search.trim().toLowerCase();

  return applications.filter((application) => {
    const matchesSearch =
      search.length === 0 ||
      application.title.toLowerCase().includes(search) ||
      application.provider.toLowerCase().includes(search);

    const matchesStatus =
      filters.status === "all" || application.status === filters.status;

    const matchesType =
      filters.type === "all" || application.type === filters.type;

    return matchesSearch && matchesStatus && matchesType;
  });
}

export function getApplicationDetail(id: string): ApplicationDetail | undefined {
  return APPLICATION_DETAILS.find((application) => application.id === id);
}
