import type { SubscriptionEventType } from "./event";

export const FILTERABLE_EVENT_TYPES: SubscriptionEventType[] = [
  "Upgraded",
  "Renewed",
  "Failed payment",
  "Downgraded to Free",
];

export interface SubscriptionFilterState {
  eventType: SubscriptionEventType | "all";
  dateFrom: string;
  dateTo: string;
}

export const DEFAULT_SUBSCRIPTION_FILTERS: SubscriptionFilterState = {
  eventType: "all",
  dateFrom: "",
  dateTo: "",
};
