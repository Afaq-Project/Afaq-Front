import { Check, type LucideIcon } from "lucide-react";

/** Every application status the UI can show (the API's statuses plus "in review"). */
export type ApplicationStatusKey =
  | "not_started"
  | "in_progress"
  | "submitted"
  | "in_review"
  | "accepted"
  | "rejected";

interface StatusColor {
  /** Solid fill for dots and bar segments. */
  dot: string;
  /** Tinted pill: background + text. */
  chip: string;
  /** Text color when the status is written inline, e.g. "1 accepted". */
  text: string;
  /** Raw value for chart libraries that can't take classes (Recharts). Mirrors the `dot` token. */
  chart: string;
  /** Shown before the label in the chip. */
  icon?: LucideIcon;
  /** Solid fill for large stat tiles, where a status has one. */
  tile?: string;
}

/**
 * The single source for application status colors. Components read from here and never
 * hardcode a status color. Red stays muted for "rejected" (solid red is for deadlines ≤2 days
 * and destructive actions), and "accepted" is never a solid green fill, so it can't be
 * mistaken for a button.
 */
export const STATUS_COLORS: Record<ApplicationStatusKey, StatusColor> = {
  not_started: { dot: "bg-neutral-400", chip: "bg-neutral-50 text-neutral-800", text: "text-neutral-800", chart: "#888780" },
  in_progress: { dot: "bg-warning-400", chip: "bg-warning-50 text-warning-800", text: "text-warning-800", chart: "#a2773f" },
  submitted: {
    dot: "bg-info-600",
    chip: "bg-info-50 text-info-800",
    text: "text-info-800",
    chart: "#185fa5",
    tile: "bg-info-600",
  },
  in_review: { dot: "bg-purple-600", chip: "bg-purple-50 text-purple-800", text: "text-purple-800", chart: "#534ab7" },
  accepted: {
    dot: "bg-primary-600",
    chip: "bg-primary-50 text-primary-800",
    text: "text-primary-800",
    chart: "#3b6d11",
    icon: Check,
    // Stat tiles are solid fills, and solid green would read as a button, so this one stays teal.
    tile: "bg-success-600",
  },
  rejected: { dot: "bg-danger-200", chip: "bg-danger-50 text-danger-800", text: "text-danger-800", chart: "#f09595" },
};
