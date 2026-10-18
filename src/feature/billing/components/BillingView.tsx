import { ExternalLink } from "lucide-react";
import Button, { buttonClasses } from "@/src/shared/ui/Button";
import InlineAlert from "@/src/shared/ui/InlineAlert";
import { formatDeadlineDay } from "@/src/shared/lib/deadline";
import { BILLING_LINKS } from "../config/plans";
import { IS_PREMIUM, PERIOD_END, SUBSCRIPTION } from "../mocks/subscription";
import { PaymentCard } from "./PaymentCard";
import { PlansCard } from "./PlansCard";
import { YourPlanCard } from "./YourPlanCard";

/** Plan & billing: the current plan beside the plan picker (1/3 + 2/3 from 1024px), then payment for Premium. */
export function BillingView() {
  const portal = BILLING_LINKS.portal;

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-h1 text-neutral-900">Plan &amp; billing</h1>
        <p className="mt-1 text-body text-neutral-600">Your plan, AI usage, and payments.</p>
      </header>

      {IS_PREMIUM && SUBSCRIPTION.paymentFailed && (
        <InlineAlert
          variant="warning"
          action={
            portal ? (
              <a href={portal} className={buttonClasses("secondary", "bg-white")}>
                Update payment method
                <ExternalLink size={16} strokeWidth={1.75} aria-hidden="true" />
              </a>
            ) : (
              <Button variant="secondary" className="bg-white" disabled>
                Update payment method
              </Button>
            )
          }
        >
          Your last payment didn&apos;t go through. You&apos;ll keep Premium until {formatDeadlineDay(PERIOD_END)}, then
          move to Free.
        </InlineAlert>
      )}

      <div className="gap-6 grid grid-cols-1 lg:grid-cols-3">
        <YourPlanCard />
        <div className="lg:col-span-2 min-w-0">
          <PlansCard />
        </div>
      </div>

      {IS_PREMIUM && <PaymentCard />}
    </div>
  );
}
