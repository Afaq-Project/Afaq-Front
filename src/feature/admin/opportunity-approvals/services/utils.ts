import { OpportunitySubmission } from "../types/opportunity";
import { ApprovalFilterState } from "../types/filters";

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getUniqueSources(opportunities: OpportunitySubmission[]): string[] {
  return Array.from(new Set(opportunities.map((o) => o.source))).sort();
}

export function filterOpportunities(
  opportunities: OpportunitySubmission[],
  filters: ApprovalFilterState,
): OpportunitySubmission[] {
  return opportunities.filter((opportunity) => {
    const matchesSource =
      filters.source === "all" || opportunity.source === filters.source;

    const matchesType = filters.type === "all" || opportunity.type === filters.type;

    const matchesFrom =
      !filters.dateScrapedFrom || opportunity.dateScraped >= filters.dateScrapedFrom;

    const matchesTo =
      !filters.dateScrapedTo || opportunity.dateScraped <= filters.dateScrapedTo;

    return matchesSource && matchesType && matchesFrom && matchesTo;
  });
}
