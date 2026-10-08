"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark, Info } from "lucide-react";

import { cn } from "@/src/feature/dashboard/services/utils";
import { formatDeadline } from "@/src/feature/applications/services/utils";
import { DEADLINE_URGENCY_ICON, DEADLINE_URGENCY_TEXT, getDeadlineUrgency } from "@/src/shared/lib/deadline";
import { notify } from "@/src/shared/lib/notify";
import Badge from "@/src/shared/ui/Badge";
import { countryName } from "@/src/shared/lib/countries";
import { FlagTile } from "./FlagTile";
import MatchBadge from "./MatchBadge";
import { MatchWhyPopover } from "./MatchWhyPopover";
import type { OpportunitySummary } from "../types/opportunity";
import { FUNDING_LABEL } from "./labels";
import { formatDaysLeft } from "../services/utils";

const MAX_CHIPS = 3;

function DeadlineLabel({ daysLeft }: { daysLeft: number }) {
  const urgency = getDeadlineUrgency(daysLeft);
  const Icon = DEADLINE_URGENCY_ICON[urgency];
  const text =
    urgency === "urgent" ? formatDeadline(daysLeft) : urgency === "soon" ? `${daysLeft} days left` : formatDaysLeft(daysLeft);

  return (
    <span className={cn("flex items-center gap-1.5 shrink-0", DEADLINE_URGENCY_TEXT[urgency])}>
      <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
      {text}
    </span>
  );
}

/**
 * Opportunity card, shared by Discover and the dashboard: provider, title, match score with a
 * "Why this match" breakdown, up to three fact chips, description, and a deadline/location
 * footer. The whole card links to the details page. Closed opportunities are dimmed; ones that
 * fail a hard filter carry a "You may not be eligible" note.
 */
export function OpportunityCard({ opportunity }: { opportunity: OpportunitySummary }) {
  // TODO: wire to a real save action and persist it; there's no saved-opportunities API yet.
  const [saved, setSaved] = useState(false);
  const closed = opportunity.daysLeft < 0;
  const relaxed = opportunity.meetsRequirements === false;
  const remote = Boolean(opportunity.isRemote) || !opportunity.countryCode;
  const country = opportunity.countryCode ? countryName(opportunity.countryCode) : undefined;

  const chips = [
    opportunity.type,
    opportunity.fundingStatus && FUNDING_LABEL[opportunity.fundingStatus],
    opportunity.level,
    opportunity.isRemote && "Remote",
  ]
    .filter((chip): chip is string => Boolean(chip))
    .slice(0, MAX_CHIPS);

  const toggleSaved = () => {
    const next = !saved;
    setSaved(next);
    // TODO: add a "View saved" link once there's a saved-opportunities page.
    if (next) notify.success("Saved to your list");
  };

  return (
    <article
      className={cn(
        "relative flex flex-col gap-3 bg-white p-5 border border-neutral-100 hover:border-neutral-200 rounded-lg h-full transition-colors",
        closed && "opacity-60",
      )}
    >
      {relaxed && (
        <p className="flex items-center gap-1.5 bg-warning-50 px-3 py-2 rounded-md text-caption text-warning-800">
          <Info size={14} strokeWidth={2} aria-hidden="true" className="shrink-0" />
          You may not be eligible
        </p>
      )}

      <div className="flex items-center gap-3">
        <FlagTile countryCode={opportunity.countryCode} countryName={country} remote={remote} />
        <div className="flex-1 min-w-0">
          {/* TODO: every opportunity should have a provider; the line is omitted when it's missing. */}
          {opportunity.provider && (
            <p className="font-medium text-neutral-800 text-small truncate">{opportunity.provider}</p>
          )}
          <p className="text-caption text-neutral-600 truncate">{remote ? "Remote" : country}</p>
        </div>
        {/* Sits above the card's stretched link, so clicking it doesn't open the details page. */}
        <button
          type="button"
          aria-label={saved ? "Remove from saved" : "Save opportunity"}
          aria-pressed={saved}
          onClick={(event) => {
            event.stopPropagation();
            toggleSaved();
          }}
          className={cn(
            "after:absolute relative z-10 flex justify-center items-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 size-8 transition-colors after:-inset-1.5 after:content-[''] shrink-0",
            saved ? "text-primary-600" : "text-neutral-600 hover:text-neutral-900",
          )}
        >
          <Bookmark size={18} strokeWidth={1.75} aria-hidden="true" className={cn(saved && "fill-current")} />
        </button>
      </div>

      <h3 className="text-h3 text-neutral-900 line-clamp-2">
        <Link
          href={`/discover/${opportunity.id}`}
          className="after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-primary-400 focus-visible:after:ring-inset after:rounded-lg focus-visible:outline-none after:content-['']"
        >
          {opportunity.title}
        </Link>
      </h3>

      {/* Raised while its popover is open so the panel isn't covered by the next card. */}
      <div className="relative z-10 has-aria-expanded:z-30 flex items-center gap-1">
        <MatchBadge percent={opportunity.matchScore} muted={closed} />
        {/* TODO: every opportunity should carry matchFactors once the matching API returns them. */}
        {opportunity.matchFactors && <MatchWhyPopover factors={opportunity.matchFactors} />}
      </div>

      {chips.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <li key={chip} className="px-2.5 py-0.5 border border-neutral-200 rounded-full text-caption text-neutral-800">
              {chip}
            </li>
          ))}
        </ul>
      )}

      <p className="text-neutral-600 text-small line-clamp-2">{opportunity.description}</p>

      <div className="flex justify-between items-center gap-3 mt-auto pt-3 border-neutral-100 border-t text-small">
        {closed ? <Badge tone="gray">Closed</Badge> : <DeadlineLabel daysLeft={opportunity.daysLeft} />}
        <span className="text-neutral-600 text-right truncate">{opportunity.isRemote ? "Remote" : opportunity.location}</span>
      </div>
    </article>
  );
}
