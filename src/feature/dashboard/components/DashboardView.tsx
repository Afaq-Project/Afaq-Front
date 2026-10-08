"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarDays } from "lucide-react";
import { APPLICATIONS } from "@/src/feature/applications/mocks/applications";
import type { ApplicationStatus } from "@/src/feature/applications/types/status";
import { OpportunityCard } from "@/src/feature/opportunities/components/OpportunityCard";
import { OPPORTUNITIES, RECOMMENDED_OPPORTUNITIES } from "@/src/feature/opportunities/mocks/opportunities";
import { PROFILE_NEXT_STEP, type NextStep } from "@/src/feature/profile/components/header/completion";
import { useCurrentUserName } from "@/src/feature/profile/hooks/useCurrentUserName";
import { useProfileCompletion } from "@/src/feature/profile/hooks/useProfileCompletion";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { PROFILE_SECTIONS } from "../mocks/dashboard";
import { WORKSHOP_PROMO } from "../mocks/promos";
import { AttentionStrip } from "./AttentionStrip";
import { DeadlineList } from "./DeadlineList";
import { greetingFor, summarizeDeadlines } from "./format";
import { MatchesSnapshotCard } from "./MatchesSnapshotCard";
import { PageGreeting } from "./PageGreeting";
import { ProfileCompleteMoment } from "./ProfileCompleteMoment";
import { PipelineCard } from "./PipelineCard";
import { ProfileProgressCard, type ProfileSectionStatus } from "./ProfileProgressCard";
import { PromoCard } from "./PromoCard";
import { GHOST_LINK_CLASS } from "./styles";
import { getMatchTier, type MatchTier } from "../types/status";
import { WelcomeBanner } from "./WelcomeBanner";

// Deadlines only matter while there's still work to do: submitted and decided ones drop out.
const ACTIONABLE: ApplicationStatus[] = ["not_started", "in_progress"];

const countBy = (status: ApplicationStatus) => APPLICATIONS.filter((a) => a.status === status).length;

// TODO: replace with per-section status from the API, including field counts (`progress`) so
// unfinished sections can show "{done} of {total}". For now it's the dashboard mock's
// done/not-done flags, which aren't tied to the completion percentage.
const sectionComplete = (label: string) => PROFILE_SECTIONS.find((s) => s.label === label)?.complete ?? false;
const PROFILE_CHECKLIST: ProfileSectionStatus[] = [
  { key: "education", label: "Education", complete: sectionComplete("Education"), href: "/profile#education" },
  { key: "background", label: "Background & goals", complete: sectionComplete("Background & goals"), href: "/profile#background" },
  { key: "skills", label: "Skills & languages", complete: sectionComplete("Skills & language"), href: "/profile#skills" },
  { key: "documents", label: "Documents", complete: sectionComplete("Documents"), href: "/documents" },
];

// Next step for the first unfinished section. The percentages are the match-score weights
// (Sprint 3: field of study 30%, skills/interests 25%).
// TODO: copy for education and background & goals needs product review.
const SECTION_NEXT_STEP: Record<string, NextStep> = {
  education: { label: "Add your education", impact: "Field of study counts for 30% of your match score.", href: "#education" },
  background: { label: "Add your background & goals", impact: "Your study goals decide which opportunities you see.", href: "#background" },
  skills: { label: "Add your skills & languages", impact: "Skills count for 25% of your match score.", href: "#skills" },
  documents: { label: "Add your documents", impact: "Most applications ask for a resume and transcript.", href: "/documents" },
};

/** Dev preview only: tier counts from the opportunities mock, counting open ones (daysLeft >= 0). */
function mockMatchCounts(): Record<MatchTier, number> {
  const counts: Record<MatchTier, number> = { strong: 0, possible: 0, low: 0 };
  for (const opportunity of OPPORTUNITIES) {
    if (opportunity.daysLeft >= 0) counts[getMatchTier(opportunity.matchScore)] += 1;
  }
  return counts;
}

/**
 * Dashboard, ordered by what needs action: deadlines, then applications, then matches,
 * then the profile. Below 1024px it's one column with deadlines moved up under the header.
 */
export function DashboardView() {
  const { firstName } = useCurrentUserName();
  const completion = useProfileCompletion();
  const { user } = useAuth();
  const searchParams = useSearchParams();
  // NODE_ENV is inlined at build time, so in production this is `false && …` and the preview
  // branch is stripped from the bundle; the query param can't turn it on.
  const previewSnapshot =
    process.env.NODE_ENV === "development" && searchParams.get("preview") === "matches-snapshot";
  // Signed-in pages render on the client only (the protected layout waits for auth), so local time is safe here.
  const [hour] = useState(() => new Date().getHours());

  const upcoming = APPLICATIONS.filter((a) => ACTIONABLE.includes(a.status) && a.daysLeft >= 0).sort(
    (a, b) => a.daysLeft - b.daysLeft,
  );
  const needsAttention = upcoming.filter((a) => a.daysLeft <= 2);
  const deadlineSummary = summarizeDeadlines(upcoming.map((a) => a.daysLeft));


  const greeting = greetingFor(hour);
  const deadlines = <DeadlineList applications={upcoming} />;

  return (
    <div className="flex flex-col gap-8">
      <WelcomeBanner />

      {/* Greeting on the left, the promo pushed to the right; stacked below 768px. */}
      <div className="flex md:flex-row flex-col md:justify-between md:items-center gap-6">
        <PageGreeting title={firstName ? `${greeting}, ${firstName}` : greeting}>
          {deadlineSummary ?? (
            <>
              No deadlines this week. A good time to explore new matches.{" "}
              <Link
                href="/discover"
                className="rounded-sm font-medium text-primary-600 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
              >
                Discover
              </Link>
            </>
          )}
        </PageGreeting>

        {/* TODO: the promo has no description yet; its date, time and link are placeholders (see promos.ts). */}
        {WORKSHOP_PROMO && (
          <div className="md:w-100 shrink-0">
            <PromoCard
              icon={CalendarDays}
              eyebrow={WORKSHOP_PROMO.eyebrow}
              title={WORKSHOP_PROMO.title}
              date={WORKSHOP_PROMO.date}
              time={WORKSHOP_PROMO.time}
              href={WORKSHOP_PROMO.href}
            />
          </div>
        )}
      </div>

      <AttentionStrip applications={needsAttention} />

      {/* items-start: each column is as tall as its own cards, so nothing stretches to match the other side. */}
      <div className="items-start gap-6 grid grid-cols-1 lg:grid-cols-3">
        <div className="flex flex-col gap-8 lg:col-span-2 min-w-0">
          {/* TODO: pass "in_review" once applications report it; the status model has no such value yet, so it shows 0. */}
          <PipelineCard
            counts={{
              not_started: countBy("not_started"),
              in_progress: countBy("in_progress"),
              submitted: countBy("submitted"),
              accepted: countBy("accepted"),
              rejected: countBy("rejected"),
            }}
            closingDaysLeft={upcoming.filter((a) => a.daysLeft <= 7).map((a) => a.daysLeft)}
          />

          {/* Below 1024px deadlines follow the applications card; on desktop they're in the right column. */}
          <div className="lg:hidden">{deadlines}</div>

          <section aria-labelledby="matches-heading">
            <div className="flex justify-between items-baseline gap-3">
              <h2 id="matches-heading" className="text-h2 text-neutral-900">
                Best matches for you
              </h2>
              <Link href="/discover" className={GHOST_LINK_CLASS}>
                View all
              </Link>
            </div>
            <div className="gap-4 md:gap-6 grid grid-cols-1 md:grid-cols-2 mt-4">
              {RECOMMENDED_OPPORTUNITIES.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6 min-w-0">
          <div className="hidden lg:block">{deadlines}</div>
          {previewSnapshot ? (
            <MatchesSnapshotCard counts={mockMatchCounts()} />
          ) : completion >= 100 ? (
            // TODO: render <MatchesSnapshotCard> here once a feed/matching endpoint provides open,
            // feed-visible match counts by tier. Until then a complete profile gets the one-time
            // completion moment and then no card, so the cards below move up.
            user && <ProfileCompleteMoment userId={user.id} />
          ) : (
            <ProfileProgressCard
              percent={completion}
              sections={PROFILE_CHECKLIST}
              nextStep={PROFILE_NEXT_STEP ?? SECTION_NEXT_STEP[PROFILE_CHECKLIST.find((s) => !s.complete)?.key ?? ""]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
