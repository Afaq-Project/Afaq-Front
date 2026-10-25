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
