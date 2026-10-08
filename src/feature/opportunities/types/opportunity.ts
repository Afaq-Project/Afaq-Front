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
  description: string;
  type: OpportunityType;
  matchScore: number;
  daysLeft: number;
  location: string;
  fieldOfStudy: string;
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
  /** How the profile fits each weighted match factor; the "Why this match" popover needs it. */
  matchFactors?: Record<MatchFactorKey, MatchFit>;
  /**
   * False when it fails a hard eligibility filter and is only shown as a relaxed result.
   * Undefined means it passes.
   */
  meetsRequirements?: boolean;
}

/** The five factors of the match score (weights live with the UI that explains them). */
export type MatchFactorKey = "fieldOfStudy" | "skills" | "gpa" | "language" | "experience";
export type MatchFit = "strong" | "partial" | "missing";

/** How the user's profile fits one eligibility criterion. */
export type EligibilityFit = "met" | "not_met" | "unknown";

export interface EligibilityCriterion {
  text: string;
  /** Absent when we have no read on it: the UI then makes no claim either way. */
  userFit?: EligibilityFit;
}

/** Profile document categories (the onboarding upload slots). */
export type DocumentCategory = "resume" | "essay" | "transcript" | "recommendation" | "other";

export interface RequiredDocument {
  name: string;
  /** The profile category it corresponds to; absent when no category fits (e.g. passport). */
  category?: DocumentCategory;
}

export interface OpportunityDetail extends OpportunitySummary {
  provider: string;
  keywords: string[];
  /** Absolute deadline, ISO date (e.g. "2026-10-20"). The countdown is computed from this. */
  deadlineDate: string;
  fundingStatus: FundingStatus;
  officialLink: string;
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
