import { OPPORTUNITY_DETAILS } from "../mocks/opportunities";
import { FundingStatus, OpportunityDetail } from "../types/opportunity";

export const FUNDING_TONE: Record<
  FundingStatus,
  "green" | "amber" | "blue" | "gray"
> = {
  "Fully Funded": "green",
  "Partially Funded": "amber",
  Paid: "blue",
  Unpaid: "gray",
};

export function getOpportunityById(id: string): OpportunityDetail | undefined {
  return OPPORTUNITY_DETAILS.find((opportunity) => opportunity.id === id);
}

export function formatDeadlineDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDaysLeft(daysLeft: number): string {
  if (daysLeft === 1) return "1 day left";
  if (daysLeft < 30) return `${daysLeft} days left`;
  const months = Math.round(daysLeft / 30);
  return months === 1 ? "1 month left" : `${months} months left`;
}

export type MatchTier = "strong" | "possible" | "low";

export function getMatchTier(percent: number): MatchTier {
  if (percent >= 70) return "strong";
  if (percent >= 40) return "possible";
  return "low";
}

export const MATCH_BADGE_CLASSES: Record<MatchTier, string> = {
  strong: "bg-success-600",
  possible: "bg-warning-600",
  low: "bg-neutral-600",
};

export const MATCH_TIER_LABEL: Record<MatchTier, string> = {
  strong: "Strong match with your profile",
  possible: "Possible match — review the eligibility criteria",
  low: "Limited match with your profile",
};
