// Shapes checked against live responses (2026-10-25). They differ from AfaqAPI.json in places:
// matches are nested in `data.data`, and score_breakdown is a per-category report.

/** Everything the backend sends; v1 only shows scholarships and internships. */
export type ApiOpportunityType =
  | "scholarship"
  | "internship"
  | "fellowship"
  | "grant"
  | "training"
  | "volunteering"
  | "exchange_program";

/** Opportunities endpoints use camelCase. The list sends only these summary fields. */
export interface ApiOpportunitySummary {
  id: string;
  title: string;
  organization: string | null;
  /** Country name in English, e.g. "Belgium". */
  country: string | null;
  /** ISO timestamp; null for rolling deadlines. */
  deadline: string | null;
  opportunityType: ApiOpportunityType | string;
  isRemote: boolean;
}

/** GET /opportunities/:id. */
export interface ApiOpportunity extends ApiOpportunitySummary {
  description: string | null;
  // TODO: always {} so far; its shape is unknown until the backend fills it.
  eligibility: Record<string, unknown>;
  location: string | null;
  fundingType: "fully_funded" | "partially_funded" | null;
  /** Where to apply. */
  applicationUrl: string | null;
  /** The listing it was scraped from. */
  sourceUrl: string | null;
  /** e.g. "High School", "Bachelor", "Master", "PhD". */
  studyLevels: string[];
  fieldsOfStudy: string[];
  sourceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListOpportunitiesParams {
  page: number;
  limit: number;
  is_remote?: boolean;
  /** ISO dates (YYYY-MM-DD). */
  deadline_from?: string;
  deadline_to?: string;
  /** "<field>:<asc|desc>", e.g. "created_at:desc". */
  sort?: string;
}

/** Recommendations endpoints use snake_case. */
export interface ApiCategoryScore {
  /** field_of_study, opportunity_requirements, gpa, language, experience. */
  category: string;
  /** Share of the total, in %; the five add up to 100. */
  weight: number;
  /** 0–100; null when the category doesn't apply. */
  score: number | null;
  /** False when the opportunity sets no requirement in this category. */
  is_applicable: boolean;
  reason: string;
}

export interface ApiMatch {
  opportunity_id: string;
  score_pct: number;
  score_breakdown: {
    total_score: number;
    /** Calculated before the profile had everything matching uses. */
    is_preliminary: boolean;
    requirements_coverage_pct: number;
    category_scores: ApiCategoryScore[];
    calculated_at: string;
  };
  calculation_version: number;
  calculated_at: string;
}

export interface ApiMatchWithOpportunity extends ApiMatch {
  opportunity: {
    id: string;
    title: string;
    organization: string | null;
    deadline: string | null;
    country: string | null;
    opportunity_type: ApiOpportunityType | string;
    is_remote: boolean;
  };
}

export interface ApiMatchesMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
  synced_at: string;
}

export interface MatchesParams {
  page?: number;
  limit?: number;
  min_score?: number;
  sort?: "score_desc";
}
