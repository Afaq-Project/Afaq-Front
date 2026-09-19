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

/**
 * The design system's fixed status mapping (gray / blue / green-600 / amber-600 / teal-600),
 * given as this app's actual theme hex values (globals.css) rather than Tailwind
 * class names, since Recharts fills take raw color values.
 */
export const STAGE_COLOR: Record<ApplicationStage, string> = {
  "Not Started": "#888780", // neutral-400
  "In Progress": "#185fa5", // info-600
  Submitted: "#3b6d11", // primary-600 ("green-600")
  "In Review": "#854f0b", // warning-600 ("amber-600")
  Result: "#0f6e56", // success-600 ("teal-600")
};
