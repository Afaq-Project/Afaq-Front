// Display-only formatting for the profile cards; stored values are never changed.

const MONTH_YEAR = new Intl.DateTimeFormat("en", { month: "short", year: "numeric" });

function monthYear(value?: string | null) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : MONTH_YEAR.format(date);
}

const DAY_MONTH_YEAR = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

/** "12 Dec 2002 · 23 years old" — age is computed at render time. */
export function formatBirthDate(value?: string | null, today = new Date()) {
  if (!value) return undefined;
  const birth = new Date(value);
  if (Number.isNaN(birth.getTime())) return undefined;
  let age = today.getFullYear() - birth.getFullYear();
  const birthdayPassed =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
  if (!birthdayPassed) age -= 1;
  return `${DAY_MONTH_YEAR.format(birth)} · ${age} years old`;
}

/**
 * Chip label: no trailing period, sentence case. All-caps names are lowercased after the first
 * letter; otherwise only plain Capitalized words are lowercased, so acronyms ("IT") and
 * mixed-case words keep their casing.
 */
export function toChipLabel(text: string) {
  const trimmed = text.trim().replace(/\.+$/, "");
  if (trimmed === trimmed.toUpperCase()) return trimmed.charAt(0) + trimmed.slice(1).toLowerCase();
  return trimmed
    .split(" ")
    .map((word, i) => (i > 0 && /^[A-Z][a-z'’]+$/.test(word) ? word.toLowerCase() : word))
    .join(" ");
}

/** "Aug 2020 – Aug 2025", "Aug 2020 – Present", or undefined when there's no start date. */
export function formatDateRange(start?: string | null, end?: string | null, ongoing = false) {
  const from = monthYear(start);
  if (!from) return undefined;
  const to = ongoing ? "Present" : monthYear(end);
  return to ? `${from} – ${to}` : from;
}
