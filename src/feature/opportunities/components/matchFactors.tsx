import { Check, Minus } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import type { MatchBreakdown, MatchFit } from "../types/opportunity";

/** The matching API's factors (SRS matching spec), with where each is filled in. */
const KNOWN_FACTORS: Record<string, { label: string; profileHref: string }> = {
  field_of_study: { label: "Field of study", profileHref: "/profile#background" },
  opportunity_requirements: { label: "Skills & requirements", profileHref: "/profile#skills" },
  gpa: { label: "GPA", profileHref: "/profile#education" },
  language: { label: "Language", profileHref: "/profile#skills" },
  // TODO: point at a work-experience section once the profile has one.
  experience: { label: "Work experience", profileHref: "/profile" },
};

export interface MatchFactorRow {
  key: string;
  label: string;
  weight: number;
  fit: MatchFit;
  profileHref?: string;
}

// A factor's own score (0–100) at or above this reads as a strong fit.
const STRONG_FIT_MIN = 70;

function fitFor(score: number | null): MatchFit {
  if (score === null) return "notRequired";
  if (score >= STRONG_FIT_MIN) return "strong";
  return score > 0 ? "partial" : "missing";
}

/** "field_of_study" → "Field of study", for factors the API adds before the UI knows them. */
const humanize = (key: string) => key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");

/** The breakdown as rows, heaviest factor first. */
export function matchFactorRows(breakdown: MatchBreakdown): MatchFactorRow[] {
  return breakdown
    .map((factor) => ({
      key: factor.key,
      weight: factor.weight,
      fit: fitFor(factor.score),
      label: KNOWN_FACTORS[factor.key]?.label ?? humanize(factor.key),
      profileHref: KNOWN_FACTORS[factor.key]?.profileHref,
    }))
    .sort((a, b) => b.weight - a.weight);
}

export const FIT_LABEL: Record<MatchFit, string> = {
  strong: "Strong fit",
  partial: "Partial fit",
  missing: "Missing",
  notRequired: "Not required",
};

export const FIT_TEXT: Record<MatchFit, string> = {
  strong: "text-primary-800",
  partial: "text-warning-800",
  missing: "text-neutral-600",
  notRequired: "text-neutral-600",
};

/**
 * Fit marker, always paired with FIT_LABEL text: a green check (strong), a half-filled circle
 * (partial), a hollow circle (missing) or a dash (not required).
 */
export function FitIcon({ fit, className }: { fit: MatchFit; className?: string }) {
  if (fit === "strong") {
    return (
      <span aria-hidden="true" className={cn("flex justify-center items-center bg-primary-600 rounded-full size-4 text-white shrink-0", className)}>
        <Check size={10} strokeWidth={3} />
      </span>
    );
  }
  if (fit === "notRequired") {
    return (
      <span aria-hidden="true" className={cn("flex justify-center items-center size-4 text-neutral-400 shrink-0", className)}>
        <Minus size={14} strokeWidth={2} />
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
