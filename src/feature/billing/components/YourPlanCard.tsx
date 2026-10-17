"use client";

import { useState } from "react";
import { CREDIT_USAGE } from "@/src/feature/ai/mocks/conversations";
import { useReviews } from "@/src/feature/documents/services/reviewStore";
import { AiUsageCard } from "@/src/shared/ui/AiUsageCard";
import Badge from "@/src/shared/ui/Badge";
import { firstOfNextMonth, formatDeadlineDay } from "@/src/shared/lib/deadline";
import { FREE_LIMITS } from "../config/plans";
import { IS_PREMIUM, PERIOD_END, SUBSCRIPTION } from "../mocks/subscription";

/** The left column: the current plan, with AI usage on Free or renewal details on Premium. */
export function YourPlanCard() {
  const reviews = useReviews();
  // Quotas reset on the 1st of the month (SRS BR-7): always a future date.
  const [resetsOn] = useState(() => firstOfNextMonth());

  return (
    <section aria-labelledby="your-plan-heading" className="flex flex-col gap-4 bg-white p-5 border border-neutral-100 rounded-lg">
      <div className="flex justify-between items-center gap-3">
        <h2 id="your-plan-heading" className="text-h2 text-neutral-900">
          Your plan
        </h2>
        <Badge tone={IS_PREMIUM ? "green" : "gray"}>{IS_PREMIUM ? "Premium" : "Free"}</Badge>
      </div>

      {IS_PREMIUM ? (
        <div className="flex flex-col gap-1 text-small">
          <p className="text-neutral-800">Unlimited AI guidance and priority deadline alerts</p>
          {SUBSCRIPTION.cycle && (
            <p className="text-neutral-600">{SUBSCRIPTION.cycle === "annual" ? "Billed annually" : "Billed monthly"}</p>
          )}
          {SUBSCRIPTION.cancelAtPeriodEnd ? (
            <>
              <p className="text-neutral-600">Ends on {formatDeadlineDay(PERIOD_END)}</p>
              <p className="text-caption text-neutral-600">You&apos;ll move to Free after this date</p>
            </>
          ) : (
            <p className="text-neutral-600">Renews on {formatDeadlineDay(PERIOD_END)}</p>
          )}
        </div>
      ) : (
        <AiUsageCard
          headingLevel="h3"
          showUpgrade={false}
          resetsOn={resetsOn}
          rows={[
            { label: "Chat messages", used: CREDIT_USAGE.used, limit: FREE_LIMITS.chatMessages },
            { label: "Essay reviews", used: reviews.used, limit: FREE_LIMITS.essayReviews },
          ]}
        />
      )}
    </section>
  );
}
