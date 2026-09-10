import { OpportunitySummary } from "@/src/feature/opportunities/types/opportunity";
import { ALL_OPTION, DiscoverFilterState } from "../types/filters";

const DEADLINE_MAX_DAYS: Record<Exclude<DiscoverFilterState["deadline"], "any">, number> = {
  "7": 7,
  "30": 30,
  "90": 90,
};

export function filterOpportunities(
  opportunities: OpportunitySummary[],
  filters: DiscoverFilterState,
): OpportunitySummary[] {
  const search = filters.search.trim().toLowerCase();

  return opportunities.filter((opportunity) => {
    if (
      search &&
      !opportunity.title.toLowerCase().includes(search) &&
      !opportunity.description.toLowerCase().includes(search)
    ) {
      return false;
    }

    if (filters.type !== ALL_OPTION && opportunity.type !== filters.type) {
      return false;
    }

    if (
      filters.location !== ALL_OPTION &&
      opportunity.location !== filters.location
    ) {
      return false;
    }

    if (
      filters.fieldOfStudy !== ALL_OPTION &&
      opportunity.fieldOfStudy !== filters.fieldOfStudy
    ) {
      return false;
    }

    if (
      filters.deadline !== "any" &&
      opportunity.daysLeft > DEADLINE_MAX_DAYS[filters.deadline]
    ) {
      return false;
    }

    return true;
  });
}
