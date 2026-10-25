import type { BillingCycle, Plan, PlanId, Pricing } from "../types/billing";

/** Free-plan monthly AI limits (SRS FR-4.6, BR-7). */
export const FREE_LIMITS = { chatMessages: 20, essayReviews: 3 } as const;

/** The two tiers and what each includes (SRS FR-6.1, FR-6.2). */
export const PLANS: Record<PlanId, Plan> = {
  free: { id: "free", features: ["freeChats", "freeReviews", "matches", "reminders"] },
  premium: { id: "premium", features: ["unlimitedChat", "unlimitedReviews", "priorityAlerts", "everythingFree"] },
};

// TODO: the SRS says Premium is billed monthly or at a discounted annual rate (FR-6.3) but sets no
// prices. Fill these in (or load them from the billing API) once they're decided. While they're
// null, development builds show a TODO in their place and production hides them.
export const PRICING: Pricing = {
  currency: "USD",
  monthly: null,
  annual: null,
  annualDiscountPercent: null,
};

// TODO: no Stripe integration exists yet. Add the Checkout links (one per cycle) and the customer
// portal link here, or swap them for URLs from the backend. While they're null, the buttons that
// need them are disabled.
export const BILLING_LINKS: { checkout: Record<BillingCycle, string | null>; portal: string | null } = {
  checkout: { monthly: null, annual: null },
  portal: null,
};
