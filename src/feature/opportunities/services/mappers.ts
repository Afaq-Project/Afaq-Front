import { daysUntil } from "@/src/shared/lib/deadline";
import type { ApiMatch, ApiMatchWithOpportunity, ApiOpportunity, ApiOpportunitySummary } from "../types/api";
import type {
  FundingStatus,
  MatchBreakdown,
  OpportunityDetail,
  OpportunitySummary,
  OpportunityType,
} from "../types/opportunity";

/** Country name (lowercase) → ISO alpha-2 code (lowercase), from the countries reference list. */
export type CountryCodes = Map<string, string>;

// v1 shows these two; anything else the backend sends is left out.
const SHOWN_TYPES: Record<string, OpportunityType> = {
  scholarship: "Scholarship",
  internship: "Internship",
};

// The app is English-only for now, so listings scraped from Arabic sources are left out.
// TODO: filter on a language field once the API has one, and show them with the Arabic UI.
const ARABIC_SCRIPT = /[؀-ۿ]/;

const FUNDING: Record<string, FundingStatus> = {
  fully_funded: "Fully Funded",
  partially_funded: "Partially Funded",
};

// The API's study levels, in the wording the UI uses elsewhere.
const LEVEL_LABEL: Record<string, string> = {
  Bachelor: "Bachelor's",
  Master: "Master's",
};

// Some sources only give an RSS excerpt ending in "[…]"; it reads as a plain ellipsis instead.
const cleanDescription = (text: string | null) => text?.replace(/\s*\[(…|\.\.\.)\]\s*$/, "…") || undefined;

/** A factor the opportunity sets no requirement for gets a null score. */
const toBreakdown = (match: ApiMatch): MatchBreakdown =>
  match.score_breakdown.category_scores.map((c) => ({
    key: c.category,
    weight: c.weight,
    score: c.is_applicable ? c.score : null,
  }));

/** The API's common fields, whichever casing the endpoint uses. */
interface Basics {
  id: string;
  title: string;
  organization: string | null;
  country: string | null;
  deadline: string | null;
  type: string;
  isRemote: boolean;
}

interface MapContext {
  countryCodes: CountryCodes;
  now: Date;
}

function toSummary(basics: Basics, match: ApiMatch | undefined, { countryCodes, now }: MapContext): OpportunitySummary | null {
  const type = SHOWN_TYPES[basics.type?.toLowerCase() ?? ""];
  if (!type || ARABIC_SCRIPT.test(basics.title)) return null;
  // Deadlines come as UTC midnight timestamps; the date part is the calendar day.
  const deadlineDate = basics.deadline?.slice(0, 10);

  return {
    id: basics.id,
    title: basics.title,
    type,
    provider: basics.organization ?? undefined,
    location: basics.country ?? undefined,
    countryCode: basics.country ? countryCodes.get(basics.country.toLowerCase()) : undefined,
    isRemote: basics.isRemote,
    deadlineDate,
    daysLeft: deadlineDate ? daysUntil(deadlineDate, now) : undefined,
    matchScore: match?.score_pct,
    matchBreakdown: match && toBreakdown(match),
  };
}

const opportunityBasics = (o: ApiOpportunitySummary): Basics => ({
  id: o.id,
  title: o.title,
  organization: o.organization,
  country: o.country,
  deadline: o.deadline,
  type: o.opportunityType,
  isRemote: o.isRemote,
});

/** A card from the opportunities list (summary fields only). Null for listings v1 doesn't show. */
export function fromOpportunity(o: ApiOpportunitySummary, ctx: MapContext): OpportunitySummary | null {
  return toSummary(opportunityBasics(o), undefined, ctx);
}

/** A card from the matches feed, carrying its score. Null for listings v1 doesn't show. */
export function fromMatch(m: ApiMatchWithOpportunity, ctx: MapContext): OpportunitySummary | null {
  const o = m.opportunity;
  return toSummary(
    {
      id: o.id,
      title: o.title,
      organization: o.organization,
      country: o.country,
      deadline: o.deadline,
      type: o.opportunity_type,
      isRemote: o.is_remote,
    },
    m,
    ctx,
  );
}

/** The details page. Null for listings v1 doesn't show, so they read as not found. */
export function toDetail(o: ApiOpportunity, match: ApiMatch | undefined, ctx: MapContext): OpportunityDetail | null {
  const summary = toSummary(opportunityBasics(o), match, ctx);
  if (!summary) return null;
  const levels = o.studyLevels.map((level) => LEVEL_LABEL[level] ?? level);
  return {
    ...summary,
    description: cleanDescription(o.description),
    location: o.location ?? summary.location,
    fundingStatus: o.fundingType ? FUNDING[o.fundingType] : undefined,
    level: levels.length > 0 ? levels.join(", ") : undefined,
    fieldOfStudy: o.fieldsOfStudy[0],
    officialLink: o.applicationUrl ?? o.sourceUrl ?? undefined,
    sourceUrl: o.sourceUrl ?? undefined,
    lastCheckedAt: o.updatedAt.slice(0, 10),
    // TODO: the API sends `eligibility` as {} and has no required-documents field yet; map
    // them once it does. Until then both sections say they aren't listed.
    eligibility: [],
    requiredDocuments: [],
  };
}
