"use client";

import { useState } from "react";

import { cn } from "@/src/feature/dashboard/services/utils";
import { PLANS } from "../mocks/plans";
import type { BillingCycle } from "../types/billing";
import { PlanCard } from "./PlanCard";

export function ChoosePlanCard() {
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

  return (
    <div className="bg-white shadow-sm p-5 border border-neutral-100 rounded-lg">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-3 mb-5">
        <div>
          <h2 className="font-semibold text-neutral-900 text-body">
            Choose Your Plan
          </h2>
          <p className="mt-0.5 text-neutral-500 text-caption">
            Select the plan that fits your growth.
          </p>
        </div>

        <div className="inline-flex items-center bg-neutral-100 p-1 rounded-full shrink-0">
          <button
            type="button"
            onClick={() => setCycle("monthly")}
            className={cn(
              "px-3.5 py-1.5 rounded-full font-medium text-caption transition-colors",
              cycle === "monthly"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900",
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setCycle("annual")}
            className={cn(
              "flex items-center gap-1 px-3.5 py-1.5 rounded-full font-medium text-caption transition-colors",
              cycle === "annual"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900",
            )}
          >
            Annual
            <span className="font-semibold text-primary-600">-20%</span>
          </button>
        </div>
      </div>

      <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <PlanCard key={plan.id} plan={plan} cycle={cycle} />
        ))}
      </div>
    </div>
  );
}
