import type { ApplicationStatus } from "./status";

export interface ApplicationSummary {
  id: string;
  title: string;
  provider: string;
  type: "Scholarship" | "Internship";
  status: ApplicationStatus;
  daysLeft: number;
  /** The Afaq opportunity it tracks; the row links to its details page and takes its flag. */
  opportunityId?: string;
  /** ISO dates (YYYY-MM-DD). */
  submittedAt?: string;
  decidedAt?: string;
  /** Last change of any kind; orders submitted and decided applications. */
  updatedAt?: string;
}
