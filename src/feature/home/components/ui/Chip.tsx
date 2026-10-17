import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";

export type ChipTone = "neutral" | "green" | "teal" | "amber" | "blue" | "purple" | "red";

/** Tinted tones pair the 50 background with the 800 text of the same color. */
export const CHIP_TONES: Record<ChipTone, string> = {
  neutral: "bg-white border border-neutral-100 text-neutral-800",
  green: "bg-primary-50 text-primary-800",
  teal: "bg-success-50 text-success-800",
  amber: "bg-warning-50 text-warning-800",
  blue: "bg-info-50 text-info-800",
  purple: "bg-purple-50 text-purple-800",
  red: "bg-danger-50 text-danger-800",
};

/** Small pill label. Neutral is an outline; every other tone is tinted. */
export function Chip({ tone = "neutral", className, ...props }: ComponentPropsWithoutRef<"span"> & { tone?: ChipTone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-medium text-landing-caption whitespace-nowrap",
        CHIP_TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
