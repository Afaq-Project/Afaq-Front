/** Country names by ISO 3166-1 alpha-2 code (lowercase), where the short form reads better. */
const COUNTRY_NAMES: Record<string, string> = {
  ae: "United Arab Emirates",
  bh: "Bahrain",
  eg: "Egypt",
  jo: "Jordan",
  lb: "Lebanon",
  qa: "Qatar",
  sa: "Saudi Arabia",
};

const displayNames = new Intl.DisplayNames(["en"], { type: "region" });

/** The country's name, or the uppercase code when the code isn't a known region. */
export function countryName(code: string) {
  const known = COUNTRY_NAMES[code.toLowerCase()];
  if (known) return known;
  try {
    return displayNames.of(code.toUpperCase()) ?? code.toUpperCase();
  } catch {
    // Not a well-formed region code.
    return code.toUpperCase();
  }
}
