export type OpportunityType = "Scholarship" | "Internship" | "Fellowship";

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
}

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
