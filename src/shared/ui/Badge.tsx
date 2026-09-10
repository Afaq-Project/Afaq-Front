import type { ReactNode } from "react";

export type Tone = "gray" | "blue" | "green" | "amber" | "teal" | "red";
type Status =
  | "not-started"
  | "in-progress"
  | "submitted"
  | "in-review"
  | "accepted"
  | "rejected";

interface BadgeProps {
  tone?: Tone;
  status?: Status;
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

const statusTone: Record<Status, Tone> = {
  "not-started": "gray",
  "in-progress": "blue",
  submitted: "green",
  "in-review": "amber",
  accepted: "teal",
  rejected: "red",
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
  const resolved: Tone =
    tone ??
    (status ? statusTone[status] : undefined) ??
    (matchScore !== undefined ? matchTierTone(matchScore) : "gray");

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1.25 text-xs font-medium leading-none
        ${toneStyles[resolved]} ${className}`}
    >
      {children}
    </span>
  );
}
