/** Which greeting fits a local hour (0–23); its text is dashboard.greeting.<key>. */
export function greetingFor(hour: number): "morning" | "afternoon" | "evening" {
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}

/**
 * What's due: how many deadlines are today and how many later this week, for a line like
 * "1 deadline today · 2 more this week". Null when nothing is due within 7 days.
 */
export function summarizeDeadlines(daysLeft: number[]): { today: number; thisWeek: number } | null {
  const today = daysLeft.filter((days) => days <= 0).length;
  const thisWeek = daysLeft.filter((days) => days > 0 && days <= 7).length;
  return today > 0 || thisWeek > 0 ? { today, thisWeek } : null;
}

/**
 * The application to focus on: the nearest deadline among not started / in progress ones that
 * haven't closed. Ties go to in progress before not started, then the most recently updated.
 * Submitted, in review and decided ones are out of the student's hands, so they never qualify.
 */
export function pickFocusApplication<T extends { status: string; daysLeft: number; updatedAt?: string }>(
  applications: T[],
): T | undefined {
  const rank = (status: string) => (status === "in_progress" ? 0 : status === "not_started" ? 1 : -1);
  return applications
    .filter((a) => rank(a.status) >= 0 && a.daysLeft >= 0)
    .sort(
      (a, b) =>
        a.daysLeft - b.daysLeft ||
        rank(a.status) - rank(b.status) ||
        (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""),
    )[0];
}
