"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { MATCH_TIER_FILL, type MatchTier } from "../types/status";
import { cn } from "../services/utils";
import { CARD_CLASS, GHOST_LINK_CLASS } from "./styles";
import { useLocale, useTranslations } from "next-intl";
import { intlLocale } from "@/src/i18n/format";

const STALE_AFTER_DAYS = 180;

// Legend labels are matchTier.short.<key>.
const TIERS: MatchTier[] = ["strong", "possible", "low"];

export interface MatchesSnapshotCardProps {
  /** The user's matches by tier (≥70%, 40–69%, <40%). From the API these include closed ones. */
  counts: Record<MatchTier, number>;
  /** Matches published since the last visit; the pill only shows when > 0. */
  newCount?: number;
  /** When the profile (and its child records) last changed; the footer only shows when known. */
  lastUpdated?: Date;
}

/** "3 days ago", "5 months ago", relative to `now`. */
function relativeTime(date: Date, now: number, locale: string) {
  const days = Math.round((date.getTime() - now) / 86_400_000);
  const format = new Intl.RelativeTimeFormat(intlLocale(locale), { numeric: "auto" });
  if (Math.abs(days) < 30) return format.format(days, "day");
  if (Math.abs(days) < 365) return format.format(Math.round(days / 30), "month");
  return format.format(Math.round(days / 365), "year");
}

/**
 * "Your matches" snapshot for a complete profile: strong-match headline, possible count, a
 * tier bar with a legend, and a profile-freshness footer. Built from props only; the dev
 * preview (?preview=matches-snapshot) feeds it counts from the mock.
 */
export function MatchesSnapshotCard({ counts, newCount, lastUpdated }: MatchesSnapshotCardProps) {
  const t = useTranslations();
  const locale = useLocale();
  const total = counts.strong + counts.possible + counts.low;
  const isEmpty = counts.strong === 0 && counts.possible === 0;
  // Captured once so re-renders don't shift the relative times.
  const [now] = useState(() => Date.now());
  const stale = lastUpdated !== undefined && now - lastUpdated.getTime() > STALE_AFTER_DAYS * 86_400_000;

  return (
    <section aria-labelledby="matches-snapshot-heading" className={cn(CARD_CLASS, "self-start w-full")}>
      <div className="flex justify-between items-baseline gap-3">
        <h2 id="matches-snapshot-heading" className="text-h3 text-neutral-900">
          {t("dashboard.snapshot.title")}
        </h2>
        <Link href="/discover" className={GHOST_LINK_CLASS}>
          {t("dashboard.snapshot.explore")}
        </Link>
      </div>

      {isEmpty ? (
        <p className="mt-4 text-body text-neutral-800">{t("dashboard.snapshot.empty")}</p>
      ) : (
        <>
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mt-4">
            <span className="font-semibold text-[30px] text-success-800 leading-9">{counts.strong}</span>
            <span className="text-body text-neutral-800">{t("dashboard.snapshot.strong", { count: counts.strong })}</span>
            {newCount !== undefined && newCount > 0 && (
              <span className="bg-primary-50 px-2 py-0.5 rounded-full text-caption text-primary-800">
                {t("dashboard.snapshot.newThisWeek", { count: newCount })}
              </span>
            )}
          </div>
          <p className="text-neutral-600 text-small">
            {t("dashboard.snapshot.possible", { count: counts.possible })}
          </p>

          {/* The legend below carries the same numbers as text. */}
          <div aria-hidden="true" className="flex gap-1 mt-4 h-2">
            {TIERS.filter((tier) => counts[tier] > 0).map((tier) => (
              <div
                key={tier}
                className={cn("rounded-full", MATCH_TIER_FILL[tier])}
                style={{ flexGrow: counts[tier] }}
              />
            ))}
          </div>
          <ul className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-caption text-neutral-600">
            {TIERS.map((tier) => (
              <li key={tier} className="flex items-center gap-1.5">
                <span aria-hidden="true" className={cn("rounded-full size-2", MATCH_TIER_FILL[tier])} />
                {t(`matchTier.short.${tier}`)} <span className="text-neutral-900">{counts[tier]}</span>
              </li>
            ))}
            <li className="sr-only">{t("dashboard.snapshot.total", { count: total })}</li>
          </ul>
        </>
      )}

      {lastUpdated && (
        <div className="flex justify-between items-center gap-3 mt-5 pt-4 border-neutral-100 border-t text-neutral-600 text-small">
          {stale ? (
            <>
              <p>{t("dashboard.snapshot.staleUpdated", { when: relativeTime(lastUpdated, now, locale) })}</p>
              <Link
                href="/profile"
                className="inline-flex items-center rounded-sm min-h-11 md:min-h-0 font-medium text-neutral-800 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 shrink-0"
              >
                {t("common.review")}
              </Link>
            </>
          ) : (
            <>
              <p className="flex items-center gap-1.5">
                <CheckCircle2 size={16} strokeWidth={1.75} aria-hidden="true" className="text-primary-600 shrink-0" />
                {t("dashboard.snapshot.completeUpdated", { when: relativeTime(lastUpdated, now, locale) })}
              </p>
              <Link href="/profile" className={cn(GHOST_LINK_CLASS, "shrink-0")}>
                {t("common.edit")}
              </Link>
            </>
          )}
        </div>
      )}
    </section>
  );
}
