import { OPPORTUNITY_DETAILS } from "../mocks/opportunities";
import { OpportunityDetail } from "../types/opportunity";

export function getOpportunityById(id: string): OpportunityDetail | undefined {
  return OPPORTUNITY_DETAILS.find((opportunity) => opportunity.id === id);
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

export const MATCH_TIER_LABEL: Record<MatchTier, string> = {
  strong: "Strong match with your profile",
  possible: "Possible match — review the eligibility criteria",
  low: "Limited match with your profile",
};
