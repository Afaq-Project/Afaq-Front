export type OpportunityType = "Scholarship" | "Internship";
export type OpportunityStatus = "Live" | "Closed";

export interface ManagedOpportunity {
  id: string;
  title: string;
  type: OpportunityType;
  provider: string;
  fieldsOfStudy: string[];
  description: string;
  eligibility: string;
  officialLink: string;
  deadline: string;
  /** True once an admin has explicitly unpublished it, independent of the deadline. */
  unpublished: boolean;
}

export type ManagedOpportunityDraft = Pick<
  ManagedOpportunity,
  "title" | "description" | "eligibility" | "deadline" | "provider" | "officialLink"
>;
