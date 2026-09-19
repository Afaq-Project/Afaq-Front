export type SubscriptionEventType =
  | "Upgraded"
  | "Renewed"
  | "Failed payment"
  | "Downgraded to Free";

export type BillingCycle = "Monthly" | "Annual";

export interface SubscriptionEvent {
  id: string;
  userName: string;
  userEmail: string;
  eventType: SubscriptionEventType;
  date: string;
  billingCycle: BillingCycle;
}
