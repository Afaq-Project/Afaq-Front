"use client";

import { useState } from "react";
import Link from "next/link";
import { CREDIT_USAGE } from "@/src/feature/ai/mocks/conversations";
import { IS_PREMIUM, PERIOD_END } from "@/src/feature/billing/mocks/subscription";
import { REVIEW_QUOTA } from "@/src/feature/documents/mocks/reviews";
import { useReviews } from "@/src/feature/documents/services/reviewStore";
import { AiUsageCard } from "@/src/shared/ui/AiUsageCard";
import Badge from "@/src/shared/ui/Badge";
import { buttonClasses } from "@/src/shared/ui/Button";
import { firstOfNextMonth, formatDeadlineDay } from "@/src/shared/lib/deadline";
import { SettingsBlock, SettingsRow, SettingsSection } from "./SettingsSection";

// TODO: read the plan, usage and renewal date from the subscription API once it exists. Until
// then this matches the AI assistant: the plan comes from the billing mock, chat usage from the
// AI mock, and essay reviews from the local review store.

export function PlanSection() {
  const reviews = useReviews();
  // Quotas reset on the 1st of the month: always a future date.
  const [nextCycle] = useState(() => firstOfNextMonth());

  const planLabel = (
    <span className="flex items-center gap-2">
      Current plan
      <Badge tone={IS_PREMIUM ? "green" : "gray"}>{IS_PREMIUM ? "Premium" : "Free"}</Badge>
    </span>
  );

  return (
    <SettingsSection id="plan" title="Plan" description="Your plan and AI usage this month.">
      {IS_PREMIUM ? (
        <SettingsRow
          label={planLabel}
          help={
            <>
              <p>Unlimited AI guidance and priority deadline alerts</p>
              <p>Renews {formatDeadlineDay(PERIOD_END)}</p>
            </>
          }
        >
          <Link href="/billing" className={buttonClasses("secondary")}>
            Manage billing
          </Link>
        </SettingsRow>
      ) : (
        <>
          <SettingsRow
            label={planLabel}
            help={`${CREDIT_USAGE.limit} chat messages and ${REVIEW_QUOTA.limit} essay reviews a month`}
          >
            <Link href="/billing" className={buttonClasses("ghost")}>
              View plans and billing
            </Link>
            <Link href="/billing" className={buttonClasses("primary")}>
              Upgrade to Premium
            </Link>
          </SettingsRow>
          <SettingsBlock>
            <AiUsageCard
              headingLevel="h3"
              showUpgrade={false}
              resetsOn={nextCycle}
              rows={[
                { label: "Chat messages", used: CREDIT_USAGE.used, limit: CREDIT_USAGE.limit },
                { label: "Essay reviews", used: reviews.used, limit: REVIEW_QUOTA.limit },
              ]}
            />
          </SettingsBlock>
        </>
      )}
    </SettingsSection>
  );
}
