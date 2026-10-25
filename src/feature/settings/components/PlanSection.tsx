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
import { useLocale, useTranslations } from "next-intl";

// TODO: read the plan, usage and renewal date from the subscription API once it exists. Until
// then this matches the AI assistant: the plan comes from the billing mock, chat usage from the
// AI mock, and essay reviews from the local review store.

export function PlanSection() {
  const t = useTranslations("settings.plan");
  const tSections = useTranslations("settings.sections");
  const locale = useLocale();
  const reviews = useReviews();
  // Quotas reset on the 1st of the month: always a future date.
  const [nextCycle] = useState(() => firstOfNextMonth());

  const planLabel = (
    <span className="flex items-center gap-2">
      {t("current")}
      <Badge tone={IS_PREMIUM ? "green" : "gray"}>{IS_PREMIUM ? t("premium") : t("free")}</Badge>
    </span>
  );

  return (
    <SettingsSection id="plan" title={tSections("plan")} description={t("description")}>
      {IS_PREMIUM ? (
        <SettingsRow
          label={planLabel}
          help={
            <>
              <p>{t("premiumHelp")}</p>
              <p>{t("renews", { date: formatDeadlineDay(PERIOD_END, locale) })}</p>
            </>
          }
        >
          <Link href="/billing" className={buttonClasses("secondary")}>
            {t("manage")}
          </Link>
        </SettingsRow>
      ) : (
        <>
          <SettingsRow
            label={planLabel}
            help={t("freeHelp", { chats: CREDIT_USAGE.limit, reviews: REVIEW_QUOTA.limit })}
          >
            <Link href="/billing" className={buttonClasses("ghost")}>
              {t("viewPlans")}
            </Link>
            <Link href="/billing" className={buttonClasses("primary")}>
              {t("upgrade")}
            </Link>
          </SettingsRow>
          <SettingsBlock>
            <AiUsageCard
              headingLevel="h3"
              showUpgrade={false}
              resetsOn={nextCycle}
              rows={[
                { label: t("chatMessages"), used: CREDIT_USAGE.used, limit: CREDIT_USAGE.limit },
                { label: t("essayReviews"), used: reviews.used, limit: REVIEW_QUOTA.limit },
              ]}
            />
          </SettingsBlock>
        </>
      )}
    </SettingsSection>
  );
}
