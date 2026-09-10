import type { ApplicationStatus } from "./status";

export interface ApplicationSummary {
  id: string;
  title: string;
  provider: string;
  type: "Scholarship" | "Internship";
  status: ApplicationStatus;
  daysLeft: number;
}
