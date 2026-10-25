import { OPPORTUNITY_DETAILS, type MockOpportunityDetail } from "../mocks/opportunities";

/** Lookup for the features still on mock data; the details page loads from the API. */
export function getMockOpportunityById(id: string): MockOpportunityDetail | undefined {
  return OPPORTUNITY_DETAILS.find((opportunity) => opportunity.id === id);
}

export type MatchTier = "strong" | "possible" | "low";

export function getMatchTier(percent: number): MatchTier {
  if (percent >= 70) return "strong";
  if (percent >= 40) return "possible";
  return "low";
}

