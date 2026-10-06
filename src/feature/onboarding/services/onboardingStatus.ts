// The API has no "onboarding finished" flag yet, so it is remembered per user in this browser.
// TODO: replace with a server-side flag so it holds across devices and cleared storage.
const finishedKey = (userId: string) => `levora_onboarding_finished:${userId}`;

export function isOnboardingFinished(userId?: string): boolean {
  if (!userId) return false;
  try {
    return localStorage.getItem(finishedKey(userId)) === "true";
  } catch {
    return false;
  }
}

export function markOnboardingFinished(userId?: string): void {
  if (!userId) return;
  try {
    localStorage.setItem(finishedKey(userId), "true");
  } catch {
    // Storage unavailable — the user just won't be redirected away from the steps.
  }
}
