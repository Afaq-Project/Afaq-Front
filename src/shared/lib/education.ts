// Education rules shared by onboarding and the profile: the API's GPA scales and the checks
// on GPA values and study periods.

/** Values accepted by the API's `gpaScale`. */
export type GpaScale = "OUT_OF_4" | "OUT_OF_5" | "OUT_OF_100";

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

export function getGpaScale(value?: string | null) {
  return GPA_SCALES.find((s) => s.value === (value ?? DEFAULT_GPA_SCALE)) ?? GPA_SCALES[0];
}

/** Older drafts used "4.0" / "percent" / "letter"; map them to the API's scale values. */
export function normalizeGpaScale(value?: string): GpaScale {
  if (value === "percent") return "OUT_OF_100";
  if (GPA_SCALES.some((s) => s.value === value)) return value as GpaScale;
  return DEFAULT_GPA_SCALE;
}

/** True when a GPA was entered but isn't a number between 0 and the scale's maximum. */
export function isGpaOutOfRange(raw: string | undefined, scale?: string | null): boolean {
  if (!raw) return false;
  const value = Number(raw);
  return Number.isNaN(value) || value < 0 || value > getGpaScale(scale).max;
}

/** True when both dates are set (YYYY-MM-DD) and the end comes before the start. */
export function isEndBeforeStart(start?: string, end?: string): boolean {
  return Boolean(start && end && end < start);
}
