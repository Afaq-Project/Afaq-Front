import { PRICING } from "../config/plans";
import type { BillingCycle, PlanId } from "../types/billing";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: PRICING.currency,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

export interface DisplayPrice {
  /** Per month, e.g. "$8". */
  perMonth: string;
  /** Annual cycle only: the yearly charge, e.g. "$96". */
  billedYearly?: string;
}

/** The price to show for a plan, or null when Premium's price for that cycle isn't set. */
export function displayPrice(plan: PlanId, cycle: BillingCycle): DisplayPrice | null {
  if (plan === "free") return { perMonth: formatMoney(0) };
  if (cycle === "monthly") return PRICING.monthly === null ? null : { perMonth: formatMoney(PRICING.monthly) };
  if (PRICING.annual === null) return null;
  return { perMonth: formatMoney(Math.round((PRICING.annual / 12) * 100) / 100), billedYearly: formatMoney(PRICING.annual) };
}

/** The annual discount, from config or, failing that, from the two prices. Null when neither is set. */
export function annualDiscountPercent(): number | null {
  if (PRICING.annualDiscountPercent !== null) return PRICING.annualDiscountPercent;
  if (PRICING.monthly === null || PRICING.annual === null || PRICING.monthly === 0) return null;
  return Math.round((1 - PRICING.annual / (PRICING.monthly * 12)) * 100);
}
