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
  imageUrl: string;
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

export interface MatchBreakdownItem {
  label: string;
  score: number;
}

export interface OpportunityDetail extends OpportunitySummary {
  provider: string;
  keywords: string[];
  /** Absolute deadline, ISO date string (e.g. "2026-09-17"). */
  deadlineDate: string;
  fundingStatus: FundingStatus;
  officialLink: string;
  eligibility: string[];
  requiredDocuments: string[];
  /** Additional photos shown on the details page, if any. */
  gallery: string[];
  /** Sub-scores that average to matchScore. */
  matchBreakdown: MatchBreakdownItem[];
}
