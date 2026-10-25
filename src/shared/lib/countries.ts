/** English country names by ISO 3166-1 alpha-2 code (lowercase), where the short form reads better. */
const COUNTRY_NAMES: Record<string, string> = {
  ae: "United Arab Emirates",
  bh: "Bahrain",
  eg: "Egypt",
  jo: "Jordan",
  lb: "Lebanon",
  qa: "Qatar",
  sa: "Saudi Arabia",
};

const displayNames = new Map<string, Intl.DisplayNames>();
const namesIn = (locale: string) => {
  if (!displayNames.has(locale)) displayNames.set(locale, new Intl.DisplayNames([locale], { type: "region" }));
  return displayNames.get(locale)!;
};

/** The country's name in `locale`, or the uppercase code when the code isn't a known region. */
export function countryName(code: string, locale = "en") {
  const known = locale === "en" ? COUNTRY_NAMES[code.toLowerCase()] : undefined;
  if (known) return known;
  try {
    return namesIn(locale).of(code.toUpperCase()) ?? code.toUpperCase();
  } catch {
    // Not a well-formed region code.
    return code.toUpperCase();
  }
}
