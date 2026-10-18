"use client";

import { useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { ConfirmDialog } from "@/src/feature/settings/components/ConfirmDialog";
import Badge from "@/src/shared/ui/Badge";
import Button, { buttonClasses } from "@/src/shared/ui/Button";
import { SegmentedControl } from "@/src/shared/ui/SegmentedControl";
import { formatDeadlineDay } from "@/src/shared/lib/deadline";
import { BILLING_LINKS, FREE_LIMITS, PLANS } from "../config/plans";
import { IS_PREMIUM, PERIOD_END, SUBSCRIPTION } from "../mocks/subscription";
import { annualDiscountPercent, displayPrice } from "../services/pricing";
import type { BillingCycle, Plan } from "../types/billing";
import { DevTodo, SHOW_TODOS } from "./DevTodo";

/** Why a button is disabled: a TODO in development, a plain note in production. */
function MissingLink({ todo, note }: { todo: string; note: string }) {
  return SHOW_TODOS ? <DevTodo>{todo}</DevTodo> : <p className="text-caption text-neutral-600">{note}</p>;
}

function PlanPrice({ plan, cycle }: { plan: Plan; cycle: BillingCycle }) {
  const price = displayPrice(plan.id, cycle);
  return (
    <div aria-live="polite" className="flex flex-col gap-1 min-h-9">
      {price ? (
        <>
          <p className="flex items-baseline gap-1">
            <span className="font-semibold text-3xl text-neutral-900">{price.perMonth}</span>
            <span className="text-neutral-600 text-small">/month</span>
          </p>
          {price.billedYearly && <p className="text-caption text-neutral-600">billed {price.billedYearly} yearly</p>}
        </>
      ) : (
        <DevTodo>set the Premium {cycle} price in PRICING</DevTodo>
      )}
    </div>
  );
}

function PlanOption({
  plan,
  cycle,
  current,
  highlighted,
  action,
}: {
  plan: Plan;
  cycle: BillingCycle;
  current: boolean;
  /** The plan a Free user can upgrade to. */
  highlighted: boolean;
  action?: ReactNode;
}) {
  return (
    <article
      aria-labelledby={`plan-${plan.id}-name`}
      className={cn(
        "flex flex-col gap-4 bg-white p-5 border rounded-lg h-full",
        highlighted ? "border-primary-600" : "border-neutral-200",
      )}
    >
      <div className="flex justify-between items-center gap-3">
        <h3 id={`plan-${plan.id}-name`} className="text-h3 text-neutral-900">
          {plan.name}
        </h3>
        {current && <Badge tone="gray">Current plan</Badge>}
      </div>

      <PlanPrice plan={plan} cycle={cycle} />

      <ul className="flex flex-col gap-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-neutral-800 text-small">
            <Check size={16} strokeWidth={2} aria-hidden="true" className="mt-px text-primary-600 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      {action && <div className="flex flex-col gap-2 mt-auto pt-2">{action}</div>}
    </article>
  );
}

/** The right column: Monthly / Annual and the two plans, with the one action that applies. */
export function PlansCard() {
  const [cycle, setCycle] = useState<BillingCycle>(SUBSCRIPTION.cycle ?? "monthly");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const discount = annualDiscountPercent();
  const checkout = BILLING_LINKS.checkout[cycle];
  const portal = BILLING_LINKS.portal;
  const periodEnd = formatDeadlineDay(PERIOD_END);

  const upgrade = checkout ? (
    <a href={checkout} className={buttonClasses("primary", "w-full")}>
      Upgrade to Premium
    </a>
  ) : (
    <>
      <Button className="w-full" disabled>
        Upgrade to Premium
      </Button>
      <MissingLink todo={`add the ${cycle} Stripe Checkout link to BILLING_LINKS`} note="Online checkout isn't available yet." />
    </>
  );

  const switchToFree = SUBSCRIPTION.cancelAtPeriodEnd ? (
    <p className="text-caption text-neutral-600">You&apos;ll move to Free on {periodEnd}</p>
  ) : (
    <Button variant="ghost" className="w-full" onClick={() => setConfirmOpen(true)}>
      Switch to Free
    </Button>
  );

  return (
    <section aria-labelledby="plans-heading" className="flex flex-col gap-5 bg-white p-5 h-full border border-neutral-100 rounded-lg">
      <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-3">
        <h2 id="plans-heading" className="text-h2 text-neutral-900">
          Plans
        </h2>
        <SegmentedControl
          label="Billing cycle"
          value={cycle}
          onChange={setCycle}
          className="w-full md:w-auto"
          options={[
            { value: "monthly", label: "Monthly" },
            {
              value: "annual",
              label: (
                <>
                  Annual
                  {discount !== null ? (
                    <span className="bg-primary-50 px-2 py-0.5 rounded-full font-medium text-caption text-primary-800">
                      Save {discount}%
                    </span>
                  ) : (
                    <DevTodo>discount</DevTodo>
                  )}
                </>
              ),
            },
          ]}
        />
      </div>

      <div className="gap-3 grid grid-cols-1 md:grid-cols-2">
        <PlanOption plan={PLANS.free} cycle={cycle} current={!IS_PREMIUM} highlighted={false} action={IS_PREMIUM ? switchToFree : undefined} />
        <PlanOption plan={PLANS.premium} cycle={cycle} current={IS_PREMIUM} highlighted={!IS_PREMIUM} action={IS_PREMIUM ? undefined : upgrade} />
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Switch to Free?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={async () => {
          if (portal) window.location.assign(portal);
        }}
        confirmLabel="Continue to Stripe"
        busyLabel="Opening Stripe…"
        confirmDisabled={!portal}
      >
        <p>
          Your AI limits go back to {FREE_LIMITS.chatMessages} chat messages and {FREE_LIMITS.essayReviews} essay reviews
          per month, and priority deadline alerts stop.
        </p>
        <p>You&apos;ll keep Premium until {periodEnd}.</p>
        {!portal && <MissingLink todo="add the Stripe customer portal link to BILLING_LINKS" note="Plan changes aren't available online yet." />}
      </ConfirmDialog>
    </section>
  );
}
