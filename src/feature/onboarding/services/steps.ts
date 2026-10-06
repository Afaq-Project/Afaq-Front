export const ONBOARDING_STEPS = [
  { number: 1, label: "Personal Info", path: "/onboarding/step-1" },
  { number: 2, label: "Education & Goals", path: "/onboarding/step-2" },
  { number: 3, label: "Skills & Language", path: "/onboarding/step-3" },
  { number: 4, label: "Documents", path: "/onboarding/step-4" },
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
