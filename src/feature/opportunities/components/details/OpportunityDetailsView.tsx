"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { daysUntil } from "@/src/shared/lib/deadline";
import { notify } from "@/src/shared/lib/notify";
import type { ApplicationStatusKey } from "@/src/shared/lib/status-colors";
import { buttonClasses } from "@/src/shared/ui/Button";
import type { OpportunityDetail } from "../../types/opportunity";
import { DetailsHeader } from "./DetailsHeader";
import { AboutSection, DocumentsSection, EligibilitySection, SourceLine } from "./MainSections";
import { ActionsCard, AskAiCard, MatchCard, UpdateStatusMenu, type TrackingState } from "./SideCards";

/**
 * Opportunity details. Desktop: the header (with key facts), then the main column (about,
 * eligibility, documents, AI questions, source) beside a sticky side column with only the
 * actions and match cards. Below 1024px it's one column with actions and match right under
 * the header; on phones the primary action also sits in a bar above the tab bar.
 */
export function OpportunityDetailsView({ opportunity }: { opportunity: OpportunityDetail }) {
  // The countdown comes from the deadline date, computed now rather than trusting a stored count.
  const [now] = useState(() => new Date());
  const daysLeft = daysUntil(opportunity.deadlineDate, now);
  const closed = daysLeft < 0;

  // TODO: there's no tracker or saved-list API yet, so tracking, status and saving are local and
  // reset on reload. Wire these to the real actions when they exist.
  const [tracked, setTracked] = useState(false);
  const [status, setStatus] = useState<ApplicationStatusKey>("not_started");
  const [saved, setSaved] = useState(false);

  const tracking: TrackingState = {
    tracked,
    status,
    saved,
    onTrack: () => {
      setTracked(true);
      notify.success("Added to your applications");
    },
    onStatusChange: setStatus,
    onToggleSaved: () => {
      setSaved((value) => !value);
      if (!saved) notify.success("Saved to your list");
    },
  };

  const actions = <ActionsCard opportunity={opportunity} closed={closed} tracking={tracking} />;
  const match = <MatchCard opportunity={opportunity} />;
  const showMobileBar = tracked || !closed;

  return (
    // Room for the phone action bar so it never covers the last card.
    <div className={showMobileBar ? "flex flex-col gap-6 pb-20 md:pb-0" : "flex flex-col gap-6"}>
      <Link
        href="/discover"
        className="flex items-center gap-1.5 rounded-sm w-fit text-neutral-600 text-small hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
      >
        <ArrowLeft size={16} strokeWidth={1.75} aria-hidden="true" />
        Back to Discover
      </Link>

      <DetailsHeader opportunity={opportunity} daysLeft={daysLeft} />

      {/* Below 1024px actions and match come right after the header. */}
      <div className="lg:hidden flex flex-col gap-6">
        {actions}
        {match}
      </div>

      <div className="items-start gap-6 grid grid-cols-1 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2 min-w-0">
          <AboutSection description={opportunity.description} />
          <EligibilitySection criteria={opportunity.eligibility} />
          <DocumentsSection documents={opportunity.requiredDocuments} />
          <AskAiCard opportunityId={opportunity.id} />
          <SourceLine sourceUrl={opportunity.sourceUrl} lastCheckedAt={opportunity.lastCheckedAt} />
        </div>

        {/* Desktop only. Sticks below the top bar (60px) plus the page's 24px top spacing. */}
        <aside className="hidden top-21 sticky lg:flex flex-col gap-6 min-w-0" aria-label="Actions and match">
          {actions}
          {match}
        </aside>
      </div>

      {showMobileBar && (
        <div className="md:hidden right-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 z-30 fixed bg-white px-4 py-3 border-neutral-100 border-t">
          {tracked ? (
            <UpdateStatusMenu status={status} onChange={setStatus} side="top" />
          ) : (
            <button type="button" onClick={tracking.onTrack} className={buttonClasses("primary", "w-full")}>
              Track this application
            </button>
          )}
        </div>
      )}
    </div>
  );
}
