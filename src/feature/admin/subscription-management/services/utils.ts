import { SubscriptionEvent } from "../types/event";
import { SubscriptionFilterState } from "../types/filters";

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function filterSubscriptionEvents(
  events: SubscriptionEvent[],
  filters: SubscriptionFilterState,
): SubscriptionEvent[] {
  return events.filter((event) => {
    const matchesEventType =
      filters.eventType === "all" || event.eventType === filters.eventType;

    const matchesFrom = !filters.dateFrom || event.date >= filters.dateFrom;
    const matchesTo = !filters.dateTo || event.date <= filters.dateTo;

    return matchesEventType && matchesFrom && matchesTo;
  });
}
