import { CreditCard, ExternalLink } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import Button, { buttonClasses } from "@/src/shared/ui/Button";
import { BILLING_LINKS } from "../config/plans";
import { SUBSCRIPTION } from "../mocks/subscription";
import type { PaymentMethod } from "../types/billing";
import { DevTodo } from "./DevTodo";

/** Display names for Stripe's card brands; anything else falls back to "Card". */
const BRAND_NAMES: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  discover: "Discover",
  diners: "Diners Club",
  jcb: "JCB",
  unionpay: "UnionPay",
};

/** Whole days from today until the card stops working: the end of its expiry month. Negative once expired. */
function daysUntilExpiry({ expMonth, expYear }: PaymentMethod, now = new Date()) {
  const lastDay = new Date(expYear, expMonth, 0);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((lastDay.getTime() - today.getTime()) / 86_400_000);
}

function CardOnFile({ card }: { card: PaymentMethod }) {
  const expiry = `${String(card.expMonth).padStart(2, "0")}/${card.expYear}`;
  const days = daysUntilExpiry(card);
  const expired = days < 0;
  const soon = !expired && days <= 30;

  return (
    <div className="flex items-center gap-3 mt-3">
      <span className="flex justify-center items-center bg-neutral-50 border border-neutral-100 rounded-sm w-10 h-7 shrink-0">
        <CreditCard size={16} strokeWidth={1.75} aria-hidden="true" className="text-neutral-600" />
      </span>
      <div className="flex flex-col min-w-0">
        <p className="text-body text-neutral-900">
          {BRAND_NAMES[card.brand] ?? "Card"} ending in {card.last4}
        </p>
        <p className={cn("text-caption", expired || soon ? "text-warning-800" : "text-neutral-600")}>
          {expired ? `Expired ${expiry}` : `Expires ${expiry}`}
          {soon && " · Expires soon"}
        </p>
      </div>
    </div>
  );
}

/** Premium only: cards, invoices and cancellation all live in the Stripe customer portal. */
export function PaymentCard() {
  const portal = BILLING_LINKS.portal;
  const card = SUBSCRIPTION.paymentMethod;

  return (
    <section
      aria-labelledby="payment-heading"
      className="flex md:flex-row flex-col md:justify-between md:items-center gap-3 md:gap-8 bg-white p-5 border border-neutral-100 rounded-lg"
    >
      <div className="flex flex-col flex-1 gap-1 min-w-0">
        <h2 id="payment-heading" className="text-h2 text-neutral-900">
          Payment
        </h2>
        <p className="text-neutral-600 text-small">Payments and invoices are handled securely by Stripe.</p>
        {card && <CardOnFile card={card} />}
      </div>
      <div className="flex flex-col md:items-end gap-2 w-full md:w-auto shrink-0">
        {portal ? (
          <a href={portal} className={buttonClasses("secondary", "w-full md:w-auto")}>
            Manage payment and invoices
            <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" />
          </a>
        ) : (
          <>
            <Button variant="secondary" className="w-full md:w-auto" disabled>
              Manage payment and invoices
              <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" />
            </Button>
            <DevTodo>add the Stripe customer portal link to BILLING_LINKS</DevTodo>
          </>
        )}
      </div>
    </section>
  );
}
