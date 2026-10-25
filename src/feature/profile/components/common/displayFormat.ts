import { useLocale, useTranslations } from "next-intl";
import { intlLocale } from "@/src/i18n/format";

// Display-only formatting for the profile cards; stored values are never changed.

/**
 * Dates for the profile cards in the app's language:
 * - birthDate: "12 Dec 2002 · 23 years old", age computed at render time.
 * - dateRange: "Aug 2020 – Aug 2025", "Aug 2020 – Present", or undefined without a start date.
 */
export function useProfileFormat() {
  const t = useTranslations("profile.format");
  const locale = intlLocale(useLocale());

  const monthYear = (value?: string | null) => {
    if (!value) return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date.toLocaleDateString(locale, { month: "short", year: "numeric" });
  };

  const birthDate = (value?: string | null, today = new Date()) => {
    if (!value) return undefined;
    const birth = new Date(value);
    if (Number.isNaN(birth.getTime())) return undefined;
    let age = today.getFullYear() - birth.getFullYear();
    const birthdayPassed =
      today.getMonth() > birth.getMonth() ||
      (today.getMonth() === birth.getMonth() && today.getDate() >= birth.getDate());
    if (!birthdayPassed) age -= 1;
    const date = birth.toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" });
    return t("birthDate", { date, age });
  };

  const dateRange = (start?: string | null, end?: string | null, ongoing = false) => {
    const from = monthYear(start);
    if (!from) return undefined;
    const to = ongoing ? t("present") : monthYear(end);
    return to ? `${from} – ${to}` : from;
  };

  return { birthDate, dateRange };
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

