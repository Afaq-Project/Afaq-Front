import type { DocumentTypeKey } from "@/src/shared/lib/document-types";

// v1 covers scholarships and internships only.
export type OpportunityType = "Scholarship" | "Internship";

export type FundingStatus =
  | "Fully Funded"
  | "Partially Funded"
  | "Paid"
  | "Unpaid";

export interface OpportunitySummary {
  id: string;
  title: string;
  /** The matches feed only sends a short summary, so cards can come without one. */
  description?: string;
  type: OpportunityType;
  /** Absent when the profile isn't matchable yet, or no match was calculated for it. */
  matchScore?: number;
  /** Days until the deadline, negative once closed. Absent for rolling deadlines. */
  daysLeft?: number;
  /** Absolute deadline, ISO date (e.g. "2026-10-20"). */
  deadlineDate?: string;
  /** City and/or country as shown on the card; absent when the listing has neither. */
  location?: string;
  fieldOfStudy?: string;
  /** Organization offering it. Optional: the UI omits it when absent. */
  provider?: string;
  /** Provider logo; the card falls back to the provider's initial. */
  logoUrl?: string;
  fundingStatus?: FundingStatus;
  /** Study level it's open to, e.g. "Bachelor's", "Master's", "PhD". */
  level?: string;
  /** Host country, ISO 3166-1 alpha-2 in lowercase (e.g. "qa"); drives the card's flag. */
  countryCode?: string;
  /** Remote / global: the card shows a globe instead of a flag. */
  isRemote?: boolean;
  /** How the profile scored on each weighted factor; the "Why this match" popover needs it. */
  matchBreakdown?: MatchBreakdown;
  /**
   * False when it fails a hard eligibility filter and is only shown as a relaxed result.
   * Undefined means it passes.
   */
  meetsRequirements?: boolean;
}

/** One weighted factor of the match score, keyed as the API sends it (e.g. "field_of_study"). */
export interface MatchFactorScore {
  key: string;
  /** Share of the total score, in %. */
  weight: number;
  /** 0–100; null when the opportunity sets no requirement for it. */
  score: number | null;
}
export type MatchBreakdown = MatchFactorScore[];

/** "notRequired": the opportunity sets no requirement for that factor. */
export type MatchFit = "strong" | "partial" | "missing" | "notRequired";

/** How the user's profile fits one eligibility criterion. */
export type EligibilityFit = "met" | "not_met" | "unknown";

export interface EligibilityCriterion {
  text: string;
  /** Absent when we have no read on it: the UI then makes no claim either way. */
  userFit?: EligibilityFit;
}

export interface RequiredDocument {
  name: string;
  /** Its document type (DOCUMENT_TYPES); absent when none fits, and then it can't be matched. */
  type?: DocumentTypeKey;
}

export interface OpportunityDetail extends OpportunitySummary {
  /** Where to apply; the apply button is disabled without it. */
  officialLink?: string;
  eligibility: EligibilityCriterion[];
  requiredDocuments: RequiredDocument[];
  /** Provider's own website; the header links to it when present. */
  providerUrl?: string;
  /** Real header image from the official source; the header shows a pattern without it. */
  headerImageUrl?: string;
  /** Where the listing was scraped from, and when it was last checked (ISO date). */
  sourceUrl?: string;
  lastCheckedAt?: string;
}
