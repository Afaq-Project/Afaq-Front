import { Check } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import type { MatchFactorKey, MatchFit } from "../types/opportunity";

/** The match score's five factors and weights (SRS matching spec), with where each is filled in. */
export const MATCH_FACTORS: { key: MatchFactorKey; label: string; weight: number; profileHref: string }[] = [
  { key: "fieldOfStudy", label: "Field of study", weight: 30, profileHref: "/profile#background" },
  { key: "skills", label: "Skills & interests", weight: 25, profileHref: "/profile#skills" },
  { key: "gpa", label: "GPA", weight: 20, profileHref: "/profile#education" },
  { key: "language", label: "Language", weight: 15, profileHref: "/profile#skills" },
  // TODO: point at a work-experience section once the profile has one.
  { key: "experience", label: "Work experience", weight: 10, profileHref: "/profile" },
];

export const FIT_LABEL: Record<MatchFit, string> = {
  strong: "Strong fit",
  partial: "Partial fit",
  missing: "Missing",
};

export const FIT_TEXT: Record<MatchFit, string> = {
  strong: "text-primary-800",
  partial: "text-warning-800",
  missing: "text-neutral-600",
};

/**
 * Fit marker, always paired with FIT_LABEL text: a green check (strong), a half-filled circle
 * (partial) or a hollow circle (missing).
 */
export function FitIcon({ fit, className }: { fit: MatchFit; className?: string }) {
  if (fit === "strong") {
    return (
      <span aria-hidden="true" className={cn("flex justify-center items-center bg-primary-600 rounded-full size-4 text-white shrink-0", className)}>
        <Check size={10} strokeWidth={3} />
      </span>
    );
  }
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={cn("size-4 shrink-0", className)}>
      <circle cx="8" cy="8" r="6.75" fill="none" strokeWidth="1.5" className={fit === "partial" ? "stroke-warning-600" : "stroke-neutral-400"} />
      {fit === "partial" && <path d="M8 1.25 A6.75 6.75 0 0 1 8 14.75 Z" className="fill-warning-600" />}
    </svg>
  );
}
