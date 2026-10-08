/** Country names by ISO 3166-1 alpha-2 code (lowercase). Add entries as new countries appear. */
const COUNTRY_NAMES: Record<string, string> = {
  ae: "United Arab Emirates",
  bh: "Bahrain",
  eg: "Egypt",
  jo: "Jordan",
  lb: "Lebanon",
  qa: "Qatar",
  sa: "Saudi Arabia",
};

/** The country's name, or the uppercase code when it isn't in the list yet. */
export function countryName(code: string) {
  return COUNTRY_NAMES[code.toLowerCase()] ?? code.toUpperCase();
}
