import { ArrowRight, Check, X, Zap } from "lucide-react";

import { cn } from "@/src/feature/dashboard/services/utils";
import type { BillingCycle, Plan } from "../types/billing";

function getDisplayPrice(plan: Plan, cycle: BillingCycle): number {
  if (plan.price === 0) return 0;
  return cycle === "annual" ? Math.round(plan.price * 0.8) : plan.price;
}

export function PlanCard({
  plan,
  cycle,
}: {
  plan: Plan;
  cycle: BillingCycle;
}) {
  const price = getDisplayPrice(plan, cycle);

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 p-5 rounded-lg border",
        plan.isPopular
          ? "border-primary-600 bg-primary-50/40 shadow-sm"
          : "border-neutral-100 bg-white",
      )}
    >
      {plan.isPopular && (
        <span className="top-0 right-5 absolute flex items-center gap-1 bg-primary-900 shadow-sm px-2.5 py-1 rounded-full font-semibold text-[10px] text-white -translate-y-1/2">
          Most Popular
        </span>
      )}

      <div>
        <p className="font-medium text-neutral-500 text-caption">
          {plan.name}
        </p>
        <p className="flex items-baseline gap-1 mt-1">
          <span className="font-bold text-neutral-900 text-3xl">
            ${price}
          </span>
          <span className="text-neutral-400 text-caption">/mo</span>
        </p>
      </div>

      <ul className="flex flex-col gap-2">
        {plan.features.map((feature) => (
          <li
            key={feature.label}
            className="flex items-center gap-2 text-small"
          >
            {feature.highlight ? (
              <Zap size={15} strokeWidth={2} className="text-primary-600 shrink-0" />
            ) : feature.included ? (
              <Check size={15} strokeWidth={2} className="text-primary-600 shrink-0" />
            ) : (
              <X size={15} strokeWidth={2} className="text-neutral-300 shrink-0" />
            )}
            <span
              className={
                feature.included ? "text-neutral-700" : "text-neutral-400"
              }
            >
              {feature.label}
            </span>
          </li>
        ))}
      </ul>

      {plan.isCurrent ? (
        <button
          type="button"
          disabled
          className="inline-flex justify-center items-center bg-neutral-100 mt-auto px-4 rounded-sm w-full h-10 font-medium text-neutral-500 text-sm cursor-not-allowed"
        >
          Current Plan
        </button>
      ) : (
        <button
          type="button"
          className="inline-flex justify-center items-center gap-1.5 bg-linear-to-br from-primary-600 to-primary-800 shadow-sm hover:shadow-card mt-auto px-4 rounded-sm w-full h-10 font-medium text-white text-sm transition-all"
        >
          Upgrade to {plan.name}
          <ArrowRight size={15} strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
