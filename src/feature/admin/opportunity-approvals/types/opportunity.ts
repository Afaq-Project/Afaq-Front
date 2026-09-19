export type OpportunityType = "Scholarship" | "Internship";

export interface DuplicateMatch {
  title: string;
  provider: string;
  matchedOn: Array<"title" | "provider" | "deadline">;
}

export interface OpportunitySubmission {
  id: string;
  title: string;
  provider: string;
  type: OpportunityType;
  source: string;
  sourceUrl: string;
  deadline: string;
  dateScraped: string;
  description: string;
  eligibility: string;
  duplicateOf?: DuplicateMatch;
}
