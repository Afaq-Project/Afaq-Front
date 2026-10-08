import { STATUS_COLORS } from "@/src/shared/lib/status-colors";

export type ApplicationStage =
  | "Not Started"
  | "In Progress"
  | "Submitted"
  | "In Review"
  | "Result";

export const APPLICATION_STAGES: ApplicationStage[] = [
  "Not Started",
  "In Progress",
  "Submitted",
  "In Review",
  "Result",
];

/** Bar colors from STATUS_COLORS (raw values, since Recharts fills can't take classes). "Result" uses accepted's teal. */
export const STAGE_COLOR: Record<ApplicationStage, string> = {
  "Not Started": STATUS_COLORS.not_started.chart,
  "In Progress": STATUS_COLORS.in_progress.chart,
  Submitted: STATUS_COLORS.submitted.chart,
  "In Review": STATUS_COLORS.in_review.chart,
  Result: STATUS_COLORS.accepted.chart,
};
