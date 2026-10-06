import type { GpaScale } from "../types";

export const DEFAULT_GPA_SCALE: GpaScale = "OUT_OF_100";

export const GPA_SCALES: {
  value: GpaScale;
  label: string;
  max: number;
  step: string;
  placeholder: string;
}[] = [
  { value: "OUT_OF_4", label: "4.0 Scale", max: 4, step: "0.01", placeholder: "e.g. 3.8" },
  { value: "OUT_OF_5", label: "5.0 Scale", max: 5, step: "0.01", placeholder: "e.g. 4.5" },
  { value: "OUT_OF_100", label: "Percentage", max: 100, step: "0.1", placeholder: "e.g. 88.5" },
];

export function getGpaScale(value?: GpaScale) {
  return GPA_SCALES.find((s) => s.value === (value ?? DEFAULT_GPA_SCALE)) ?? GPA_SCALES[0];
}

/** Older drafts used "4.0" / "percent" / "letter"; map them to the API's scale values. */
export function normalizeGpaScale(value?: string): GpaScale {
  if (value === "percent") return "OUT_OF_100";
  if (GPA_SCALES.some((s) => s.value === value)) return value as GpaScale;
  return DEFAULT_GPA_SCALE;
}
