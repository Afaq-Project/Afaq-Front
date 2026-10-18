export type PlanId = "free" | "premium";

export type BillingCycle = "monthly" | "annual";

export interface Plan {
  id: PlanId;
  name: string;
  features: string[];
}

/** Premium prices, in whole currency units. `null` until the real prices are decided. */
export interface Pricing {
  currency: string;
  monthly: number | null;
  /** The full yearly charge, not the per-month equivalent. */
  annual: number | null;
  /** Shown on the Annual segment, e.g. 20 for "Save 20%". */
  annualDiscountPercent: number | null;
}

/** The customer's default card, as Stripe reports it. */
export interface PaymentMethod {
  /** Stripe's card brand, e.g. "visa", "mastercard", "amex". */
  brand: string;
  last4: string;
  /** 1–12. */
  expMonth: number;
  expYear: number;
}

export interface Subscription {
  plan: PlanId;
  /** Premium only. */
  cycle: BillingCycle | null;
  /** ISO date (YYYY-MM-DD) the current Premium period ends: the renewal date, or the end date if cancelled. */
  currentPeriodEnd: string | null;
  /** Switched to Free: Premium stays until `currentPeriodEnd`, then the account moves to Free. */
  cancelAtPeriodEnd: boolean;
  /** The last renewal payment failed (SRS BR-9): Premium stays until `currentPeriodEnd`. */
  paymentFailed: boolean;
  /** Premium only; null when there's no card on file or it hasn't been loaded. */
  paymentMethod: PaymentMethod | null;
}
