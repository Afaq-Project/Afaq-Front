import type { ReactNode } from "react";
import { STATUS_COLORS, type ApplicationStatusKey } from "../lib/status-colors";

export type Tone = "gray" | "blue" | "green" | "amber" | "teal" | "red";
interface BadgeProps {
  tone?: Tone;
  /** Application status; its colors come from STATUS_COLORS. */
  status?: ApplicationStatusKey;
  matchScore?: number;
  children: ReactNode;
  className?: string;
}

const toneStyles: Record<Tone, string> = {
  gray: "bg-neutral-100 text-neutral-800",
  blue: "bg-info-50 text-info-800",
  green: "bg-primary-50 text-primary-800",
  amber: "bg-warning-50 text-warning-800",
  teal: "bg-success-50 text-success-800",
  red: "bg-danger-50 text-danger-800",
};

function matchTierTone(score: number): Tone {
  if (score >= 70) return "teal";
  if (score >= 40) return "amber";
  return "gray";
}

export default function Badge({
  tone,
  status,
  matchScore,
  children,
  className = "",
}: BadgeProps) {
  const StatusIcon = status !== undefined && tone === undefined ? STATUS_COLORS[status].icon : undefined;
  const colors =
    tone !== undefined
      ? toneStyles[tone]
      : status !== undefined
        ? STATUS_COLORS[status].chip
        : toneStyles[matchScore !== undefined ? matchTierTone(matchScore) : "gray"];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1.25 text-xs font-medium leading-none
        ${colors} ${className}`}
    >
      {StatusIcon && <StatusIcon size={12} strokeWidth={2.25} aria-hidden="true" />}
      {children}
    </span>
  );
}
