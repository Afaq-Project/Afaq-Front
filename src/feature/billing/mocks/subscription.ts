import { firstOfNextMonth } from "@/src/shared/lib/deadline";
import type { Subscription } from "../types/billing";

// TODO: there's no subscription endpoint yet. Read this from the API once it exists. To preview
// Premium, set plan to "premium" and cycle to "monthly" or "annual"; cancelAtPeriodEnd and
// paymentFailed preview the other Premium states.
export const SUBSCRIPTION: Subscription = {
  plan: "free",
  cycle: null,
  currentPeriodEnd: null,
  cancelAtPeriodEnd: false,
  paymentFailed: false,
  // TODO: the backend needs to return the default payment method from Stripe (the customer's
  // invoice_settings.default_payment_method: card brand, last4, exp_month, exp_year). Until it
  // does, the Payment card shows only its description and the portal button.
  paymentMethod: null,
};

/** Premium has no monthly AI limits. */
export const IS_PREMIUM = SUBSCRIPTION.plan === "premium";

/** When the current Premium period ends; falls back to the next cycle so a date is never in the past. */
export const PERIOD_END = SUBSCRIPTION.currentPeriodEnd ?? firstOfNextMonth();
