"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CREDIT_USAGE } from "@/src/feature/ai/mocks/conversations";
import { useReviews } from "@/src/feature/documents/services/reviewStore";
import { AiUsageCard } from "@/src/shared/ui/AiUsageCard";
import Badge from "@/src/shared/ui/Badge";
import { firstOfNextMonth, formatDeadlineDay } from "@/src/shared/lib/deadline";
import { FREE_LIMITS } from "../config/plans";
import { IS_PREMIUM, PERIOD_END, SUBSCRIPTION } from "../mocks/subscription";

/** The left column: the current plan, with AI usage on Free or renewal details on Premium. */
export function YourPlanCard() {
  const t = useTranslations("billing");
  const locale = useLocale();
  const reviews = useReviews();
  // Quotas reset on the 1st of the month (SRS BR-7): always a future date.
  const [resetsOn] = useState(() => firstOfNextMonth());

  return (
    <section aria-labelledby="your-plan-heading" className="flex flex-col gap-4 bg-white p-5 border border-neutral-100 rounded-lg">
      <div className="flex justify-between items-center gap-3">
        <h2 id="your-plan-heading" className="text-h2 text-neutral-900">
          {t("yourPlan")}
        </h2>
        <Badge tone={IS_PREMIUM ? "green" : "gray"}>{t(IS_PREMIUM ? "planNames.premium" : "planNames.free")}</Badge>
      </div>

      {IS_PREMIUM ? (
        <div className="flex flex-col gap-1 text-small">
          <p className="text-neutral-800">{t("premiumSummary")}</p>
          {SUBSCRIPTION.cycle && (
            <p className="text-neutral-600">{SUBSCRIPTION.cycle === "annual" ? t("billedAnnually") : t("billedMonthly")}</p>
          )}
          {SUBSCRIPTION.cancelAtPeriodEnd ? (
            <>
              <p className="text-neutral-600">{t("endsOn", { date: formatDeadlineDay(PERIOD_END, locale) })}</p>
              <p className="text-caption text-neutral-600">{t("moveAfter")}</p>
            </>
          ) : (
            <p className="text-neutral-600">{t("renewsOn", { date: formatDeadlineDay(PERIOD_END, locale) })}</p>
          )}
        </div>
      ) : (
        <AiUsageCard
          headingLevel="h3"
          showUpgrade={false}
          resetsOn={resetsOn}
          rows={[
            { label: t("chatMessages"), used: CREDIT_USAGE.used, limit: FREE_LIMITS.chatMessages },
            { label: t("essayReviews"), used: reviews.used, limit: FREE_LIMITS.essayReviews },
          ]}
        />
      )}
    </section>
  );
}
