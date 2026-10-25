import { fromOpportunity, type CountryCodes } from "@/src/feature/opportunities/services/mappers";
import type { ApiOpportunitySummary } from "@/src/feature/opportunities/types/api";
import type { PublicScholarship } from "../data/scholarships";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
/** Cached between visits so the landing page doesn't wait on the API every time. */
const REVALIDATE_SECONDS = 60 * 60;
/** The API can take a while to wake up; the page renders without it rather than waiting. */
const TIMEOUT_MS = 5000;

interface Country {
  nameEn: string;
  nameAr: string | null;
  isoCode2: string;
}

/** A public GET's `data`, or null on any failure (network, timeout, non-2xx). */
async function getPublic<T>(path: string): Promise<T | null> {
  if (!API_URL) return null;
  try {
    const response = await fetch(`${API_URL}${path}`, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) return null;
    return ((await response.json()) as { data: T }).data;
  } catch {
    return null;
  }
}

/**
 * Open scholarships for the public landing page, soonest deadline first. Logged-out visitors can
 * only use GET /opportunities/recent: the 10 newest listings of every type, summary fields only
 * (no funding, study level, description or official link), so most cards are slimmer than the
 * examples. In English, listings with Arabic titles are left out (as in the app); country names
 * follow `locale`. Empty when none of them is an open scholarship or the API can't be reached.
 * TODO: switch to a public endpoint with type, open-deadline and funding filters and the card
 * fields once the backend adds one.
 */
export async function getOpenScholarships(now: Date, locale: string): Promise<(PublicScholarship & { daysLeft: number })[]> {
  const [recent, countries] = await Promise.all([
    getPublic<ApiOpportunitySummary[]>("/opportunities/recent"),
    getPublic<Country[]>("/reference/countries"),
  ]);
  if (!recent?.length) return [];

  const countryCodes: CountryCodes = new Map(
    (countries ?? []).map((country) => [country.nameEn.toLowerCase(), country.isoCode2.toLowerCase()]),
  );
  const arabicNames = new Map((countries ?? []).map((country) => [country.nameEn.toLowerCase(), country.nameAr]));
  const placeName = (english?: string) =>
    english && locale === "ar" ? (arabicNames.get(english.toLowerCase()) ?? english) : english;

  return recent
    .map((listing) => fromOpportunity(listing, { countryCodes, now, hideArabic: locale !== "ar", levelLabel: (level) => level }))
    .filter((item) => item !== null)
    .filter((item) => item.type === "Scholarship" && item.daysLeft !== undefined && item.daysLeft >= 0)
    .map((item) => ({
      id: item.id,
      title: item.title,
      provider: item.provider,
      countryCode: item.countryCode ?? "",
      isRemote: Boolean(item.isRemote) || !item.countryCode,
      location: placeName(item.location),
      deadline: item.deadlineDate!,
      daysLeft: item.daysLeft!,
    }))
    .sort((a, b) => a.daysLeft - b.daysLeft);
}
