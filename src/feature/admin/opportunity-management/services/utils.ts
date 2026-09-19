import { ManagedOpportunity, OpportunityStatus } from "../types/opportunity";
import { RETENTION_DAYS } from "../types/status";
import { ManageFilterState } from "../types/filters";

const DAY_MS = 24 * 60 * 60 * 1000;

export function daysUntil(deadline: string, today: Date = new Date()): number {
  return Math.ceil((new Date(deadline).getTime() - today.getTime()) / DAY_MS);
}

export function getOpportunityStatus(
  opportunity: ManagedOpportunity,
  today: Date = new Date(),
): OpportunityStatus {
  if (opportunity.unpublished) return "Closed";
  return daysUntil(opportunity.deadline, today) >= 0 ? "Live" : "Closed";
}

/**
 * BR-3: a closed opportunity stays listed for RETENTION_DAYS past its
 * deadline, then drops off entirely. A manual unpublish is a deliberate
 * admin action, not a deadline lapse, so it's exempt from that countdown.
 */
export function isVisible(opportunity: ManagedOpportunity, today: Date = new Date()): boolean {
  if (opportunity.unpublished) return true;
  return -daysUntil(opportunity.deadline, today) <= RETENTION_DAYS;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function filterOpportunities(
  opportunities: ManagedOpportunity[],
  filters: ManageFilterState,
  today: Date = new Date(),
): ManagedOpportunity[] {
  return opportunities.filter((opportunity) => isVisible(opportunity, today)).filter((opportunity) => {
    const status = getOpportunityStatus(opportunity, today);
    const matchesType = filters.type === "all" || opportunity.type === filters.type;
    const matchesStatus = filters.status === "all" || status === filters.status;

    const days = daysUntil(opportunity.deadline, today);
    const matchesDeadline =
      filters.deadlineRange === "all" ||
      (filters.deadlineRange === "past" && days < 0) ||
      (filters.deadlineRange === "7" && days >= 0 && days <= 7) ||
      (filters.deadlineRange === "30" && days >= 0 && days <= 30) ||
      (filters.deadlineRange === "90" && days >= 0 && days <= 90);

    return matchesType && matchesStatus && matchesDeadline;
  });
}

export function getOpportunityById(
  opportunities: ManagedOpportunity[],
  id: string,
): ManagedOpportunity | undefined {
  return opportunities.find((opportunity) => opportunity.id === id);
}
