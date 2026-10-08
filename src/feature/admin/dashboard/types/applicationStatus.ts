import { STATUS_COLORS } from "@/src/shared/lib/status-colors";

/** The app-wide status names, in sentence case. */
export type ApplicationStage = "Not started" | "In progress" | "Submitted" | "In review" | "Decision";

export const APPLICATION_STAGES: ApplicationStage[] = ["Not started", "In progress", "Submitted", "In review", "Decision"];

/** Bar colors from STATUS_COLORS (raw values, since Recharts fills can't take classes). "Decision" uses accepted's green. */
export const STAGE_COLOR: Record<ApplicationStage, string> = {
  "Not started": STATUS_COLORS.not_started.chart,
  "In progress": STATUS_COLORS.in_progress.chart,
  Submitted: STATUS_COLORS.submitted.chart,
  "In review": STATUS_COLORS.in_review.chart,
  Decision: STATUS_COLORS.accepted.chart,
};
