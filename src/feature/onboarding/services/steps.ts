export const ONBOARDING_STEPS = [
  // labelKey: under onboarding.steps.
  { number: 1, labelKey: "personal", path: "/onboarding/step-1" },
  { number: 2, labelKey: "education", path: "/onboarding/step-2" },
  { number: 3, labelKey: "skills", path: "/onboarding/step-3" },
  { number: 4, labelKey: "documents", path: "/onboarding/step-4" },
] as const;

export const COMPLETE_PATH = "/onboarding/complete";

/** 1–4 for the steps, 5 for the complete page, 0 for anything else (e.g. /onboarding). */
export function getStepFromPath(pathname: string): number {
  if (pathname.includes("/complete")) return 5;
  const step = ONBOARDING_STEPS.find((s) => pathname.includes(s.path));
  return step?.number ?? 0;
}

export function stepPath(step: number): string {
  return `/onboarding/step-${step}`;
}
