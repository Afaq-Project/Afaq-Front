"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { APPLICATIONS } from "@/src/feature/applications/mocks/applications";
import type { ApplicationStatus } from "@/src/feature/applications/types/status";
import { OpportunityCard } from "@/src/feature/opportunities/components/OpportunityCard";
import { OpportunityCardSkeleton } from "@/src/feature/opportunities/components/OpportunityCardSkeleton";
import {
  useMatchTierCounts,
  useNewestOpportunities,
  useTopMatches,
} from "@/src/feature/opportunities/hooks/useOpportunities";
import { OPPORTUNITIES } from "@/src/feature/opportunities/mocks/opportunities";
import {
  PROFILE_NEXT_STEP,
} from "@/src/feature/profile/components/header/completion";
import { useCurrentUserName } from "@/src/feature/profile/hooks/useCurrentUserName";
import { useProfileCompletion } from "@/src/feature/profile/hooks/useProfileCompletion";
import { useProfileQuery } from "@/src/feature/profile/hooks/useProfileQuery";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { PROFILE_SECTIONS } from "../mocks/dashboard";
import { ApplicationMetrics } from "./ApplicationMetrics";
import { DeadlineList } from "./DeadlineList";
import { DashboardHero } from "./DashboardHero";
import { greetingFor, pickFocusApplication, summarizeDeadlines } from "./format";
import { MatchesSnapshotCard } from "./MatchesSnapshotCard";
import { ProfileCompleteMoment } from "./ProfileCompleteMoment";
import {
  ProfileProgressCard,
  ProfileProgressCardSkeleton,
} from "./ProfileProgressCard";
import { GHOST_LINK_CLASS } from "./styles";
import { getMatchTier, type MatchTier } from "../types/status";
import { WelcomeBanner } from "./WelcomeBanner";
import { useTranslations } from "next-intl";

// Deadlines only matter while there's still work to do: submitted and decided ones drop out.
const ACTIONABLE: ApplicationStatus[] = ["not_started", "in_progress"];

const countBy = (status: ApplicationStatus) =>
  APPLICATIONS.filter((a) => a.status === status).length;

// TODO: replace with per-section status from the API, including field counts (`progress`) so
// unfinished sections can show "{done} of {total}". For now it's the dashboard mock's
// done/not-done flags, which aren't tied to the completion percentage.
const sectionComplete = (label: string) =>
  PROFILE_SECTIONS.find((s) => s.label === label)?.complete ?? false;
// Labels are dashboard.profile.sections.<key>.
const PROFILE_CHECKLIST = [
  { key: "education", complete: sectionComplete("Education"), href: "/profile#education" },
  { key: "background", complete: sectionComplete("Background & goals"), href: "/profile#background" },
  { key: "skills", complete: sectionComplete("Skills & language"), href: "/profile#skills" },
  { key: "documents", complete: sectionComplete("Documents"), href: "/documents" },
] as const;

// Next step for the first unfinished section; its text is dashboard.profile.nextSteps.<key> and
// <key>Impact. The percentages there are the match-score weights (Sprint 3: field of study 30%,
// skills/interests 25%).
// TODO: copy for education and background & goals needs product review.
const SECTION_NEXT_STEP_HREF: Record<(typeof PROFILE_CHECKLIST)[number]["key"], string> = {
  education: "#education",
  background: "#background",
  skills: "#skills",
  documents: "/documents",
};

/** Dev preview only: tier counts from the opportunities mock, counting open ones (daysLeft >= 0). */
function mockMatchCounts(): Record<MatchTier, number> {
  const counts: Record<MatchTier, number> = { strong: 0, possible: 0, low: 0 };
  for (const opportunity of OPPORTUNITIES) {
    if (opportunity.daysLeft >= 0)
      counts[getMatchTier(opportunity.matchScore)] += 1;
  }
  return counts;
}

const MATCHES_SHOWN = 4;

/**
 * The best four matches; without any (profile not matchable, or scores not calculated yet),
 * the newest opportunities instead.
 */
function MatchesSection() {
  const t = useTranslations("dashboard.matches");
  const tc = useTranslations("common");
  // The backend scores incomplete profiles too, so matches are always tried first.
  const top = useTopMatches({ limit: MATCHES_SHOWN });
  const showNewest = top.isSuccess && top.opportunities.length === 0;
  const newest = useNewestOpportunities({ limit: MATCHES_SHOWN, enabled: showNewest });
  const feed = showNewest ? newest : top;

  return (
    <section aria-labelledby="matches-heading">
      <div className="flex justify-between items-baseline gap-3">
        <h2 id="matches-heading" className="text-h2 text-neutral-900">
          {showNewest ? t("newest") : t("best")}
        </h2>
        <Link href="/discover" className={GHOST_LINK_CLASS}>
          {tc("viewAll")}
        </Link>
      </div>
      {feed.isError ? (
        <p className="mt-4 text-body text-neutral-600">{t("error")}</p>
      ) : feed.isPending ? (
        <div role="status" className="gap-4 md:gap-6 grid grid-cols-1 md:grid-cols-2 mt-4">
          <span className="sr-only">{t("loading")}</span>
          {Array.from({ length: MATCHES_SHOWN }, (_, index) => (
            <OpportunityCardSkeleton key={index} />
          ))}
        </div>
      ) : feed.opportunities.length === 0 ? (
        <p className="mt-4 text-body text-neutral-600">{t("empty")}</p>
      ) : (
        <div className="gap-4 md:gap-6 grid grid-cols-1 md:grid-cols-2 mt-4">
          {feed.opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      )}
    </section>
  );
}

/** "Your matches" by tier, once there's at least one match to count. */
function LiveMatchesSnapshot() {
  const { counts } = useMatchTierCounts();
  if (!counts || counts.strong + counts.possible + counts.low === 0) return null;
  return <MatchesSnapshotCard counts={counts} />;
}

/**
 * Dashboard, ordered by what needs action: deadlines, then applications, then matches,
 * then the profile. Below 1024px it's one column with deadlines moved up under the header.
 */
export function DashboardView() {
  const t = useTranslations("dashboard");
  const { firstName } = useCurrentUserName();
  const completion = useProfileCompletion();
  // Until the profile loads, completion is the (possibly stale) value from sign-in, so a complete
  // profile would flash the progress card first. Wait for it; on an error the fallback is used.
  // While waiting, hold the slot only if sign-in says incomplete: a complete profile almost
  // always ends with no card, so a placeholder there would just vanish.
  const completionKnown = !useProfileQuery().isPending;
  const { user } = useAuth();
  const searchParams = useSearchParams();
  // NODE_ENV is inlined at build time, so in production this is `false && …` and the preview
  // branch is stripped from the bundle; the query param can't turn it on.
  const previewSnapshot =
    process.env.NODE_ENV === "development" &&
    searchParams.get("preview") === "matches-snapshot";
  // Signed-in pages render on the client only (the protected layout waits for auth), so local time is safe here.
  const [hour] = useState(() => new Date().getHours());

  const upcoming = APPLICATIONS.filter(
    (a) => ACTIONABLE.includes(a.status) && a.daysLeft >= 0,
  ).sort((a, b) => a.daysLeft - b.daysLeft);
  const deadlineCounts = summarizeDeadlines(upcoming.map((a) => a.daysLeft));

  const greeting = t(`greeting.${greetingFor(hour)}`);
  const deadlineSummary = deadlineCounts
    ? [
        deadlineCounts.today > 0 && t("deadlinesToday", { count: deadlineCounts.today }),
        deadlineCounts.thisWeek > 0 &&
          (deadlineCounts.today > 0
            ? t("moreThisWeek", { count: deadlineCounts.thisWeek })
            : t("deadlinesThisWeek", { count: deadlineCounts.thisWeek })),
      ]
        .filter(Boolean)
        .join(" · ")
    : null;
  const checklist = PROFILE_CHECKLIST.map((section) => ({ ...section, label: t(`profile.sections.${section.key}`) }));
  const nextKey = PROFILE_CHECKLIST.find((s) => !s.complete)?.key;
  const deadlines = <DeadlineList applications={upcoming} />;

  return (
    <div className="flex flex-col gap-8">
      <WelcomeBanner />

      <DashboardHero
        title={firstName ? t("greeting.withName", { greeting, name: firstName }) : greeting}
        summary={
          deadlineSummary ??
          t.rich("noDeadlines", {
            link: (chunks) => (
              <Link
                href="/discover"
                className="rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900 font-medium text-white underline underline-offset-2 hover:text-primary-50"
              >
                {chunks}
              </Link>
            ),
          })
        }
        application={pickFocusApplication(upcoming)}
      />

      {/* items-start: each column is as tall as its own cards, so nothing stretches to match the other side. */}
      <div className="items-start gap-6 grid grid-cols-1 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2 min-w-0">
          {/* TODO: pass `loading` once applications come from the tracker API instead of the mock. */}
          <ApplicationMetrics
            counts={{
              in_progress: countBy("in_progress"),
              submitted: countBy("submitted"),
              in_review: countBy("in_review"),
              accepted: countBy("accepted"),
            }}
            deadlineDaysLeft={upcoming
              .filter((a) => a.daysLeft <= 14)
              .map((a) => a.daysLeft)}
          />

          {/* Below 1024px deadlines follow the applications cards; on desktop they're in the right column. */}
          <div className="lg:hidden">{deadlines}</div>

          <MatchesSection />
        </div>

        <div className="flex flex-col gap-6 min-w-0">
          <div className="hidden lg:block">{deadlines}</div>
          {previewSnapshot ? (
            <MatchesSnapshotCard counts={mockMatchCounts()} />
          ) : !completionKnown ? (
            completion < 100 && <ProfileProgressCardSkeleton />
          ) : completion >= 100 ? (
            // The one-time completion moment (nothing after the first time), then the tier counts.
            <>
              {user && <ProfileCompleteMoment userId={user.id} />}
              <LiveMatchesSnapshot />
            </>
          ) : (
            <ProfileProgressCard
              percent={completion}
              sections={checklist}
              nextStep={
                PROFILE_NEXT_STEP ??
                (nextKey && {
                  label: t(`profile.nextSteps.${nextKey}`),
                  impact: t(`profile.nextSteps.${nextKey}Impact`),
                  href: SECTION_NEXT_STEP_HREF[nextKey],
                })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
