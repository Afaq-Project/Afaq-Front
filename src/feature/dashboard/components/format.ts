/** "Good morning/afternoon/evening" for a local hour (0–23). */
export function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/**
 * One line about what's due, e.g. "1 deadline today · 2 more this week".
 * Returns null when nothing is due within 7 days.
 */
export function summarizeDeadlines(daysLeft: number[]): string | null {
  const today = daysLeft.filter((days) => days <= 0).length;
  const thisWeek = daysLeft.filter((days) => days > 0 && days <= 7).length;
  const plural = (count: number) => (count === 1 ? "deadline" : "deadlines");

  if (today > 0 && thisWeek > 0) return `${today} ${plural(today)} today · ${thisWeek} more this week`;
  if (today > 0) return `${today} ${plural(today)} today`;
  if (thisWeek > 0) return `${thisWeek} ${plural(thisWeek)} this week`;
  return null;
}
