"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Bookmark } from "lucide-react";

import { cn } from "@/src/feature/dashboard/services/utils";
import { DEADLINE_URGENCY_ICON, DEADLINE_URGENCY_TEXT, getDeadlineUrgency } from "@/src/shared/lib/deadline";
import MatchBadge from "./MatchBadge";
import { OpportunitySummary } from "../types/opportunity";
import { formatDaysLeft } from "../services/utils";

interface OpportunityCardProps {
  opportunity: OpportunitySummary;
  /** Shown under the title and used for the image fallback; summaries don't carry it. */
  provider?: string;
}

/**
 * Opportunity card: a 140px media area (the image, or a green-50 panel with the provider's
 * initial when there's no image or it fails to load), then type, title, provider,
 * description and a deadline/location footer. The whole card links to the details page.
 */
export function OpportunityCard({ opportunity, provider }: OpportunityCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(opportunity.imageUrl) && !imageFailed;
  const initial = (provider || opportunity.title).trim().charAt(0).toUpperCase();
  const urgency = getDeadlineUrgency(opportunity.daysLeft);
  const DeadlineIcon = DEADLINE_URGENCY_ICON[urgency];

  return (
    <article className="relative flex flex-col bg-white border border-neutral-100 hover:border-neutral-200 rounded-lg overflow-hidden transition-colors">
      <div className="relative h-35 shrink-0">
        {showImage ? (
          <Image
            src={opportunity.imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 50vw, 100vw"
            onError={() => setImageFailed(true)}
            className="object-cover"
          />
        ) : (
          <div aria-hidden="true" className="flex justify-center items-center bg-primary-50 h-full">
            <span className="flex justify-center items-center bg-primary-100 rounded-md size-12 text-h2 text-primary-800">
              {initial}
            </span>
          </div>
        )}

        {/* Above the card's stretched link so it stays clickable. */}
        <button
          type="button"
          aria-label="Save opportunity"
          className="after:absolute top-3 left-3 z-10 absolute flex justify-center items-center bg-white rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 size-8 text-neutral-600 hover:text-neutral-900 transition-colors after:-inset-1.5 after:content-['']"
        >
          <Bookmark size={16} strokeWidth={1.75} aria-hidden="true" />
        </button>
        <MatchBadge percent={opportunity.matchScore} className="top-3 right-3 absolute" />
      </div>

      <div className="flex flex-col flex-1 gap-3 p-5">
        <span className="self-start px-2.5 py-0.5 border border-neutral-200 rounded-full text-caption text-neutral-800">
          {opportunity.type}
        </span>

        <div>
          <h3 className="text-h3 text-neutral-900 line-clamp-2">
            <Link
              href={`/discover/${opportunity.id}`}
              className="after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-primary-400 focus-visible:after:ring-inset after:rounded-lg focus-visible:outline-none after:content-['']"
            >
              {opportunity.title}
            </Link>
          </h3>
          {provider && <p className="mt-1 text-neutral-600 text-small">{provider}</p>}
        </div>

        <p className="text-neutral-600 text-small line-clamp-2">{opportunity.description}</p>

        <div className="flex justify-between items-center gap-3 mt-auto text-small">
          <span className={cn("flex items-center gap-1.5 shrink-0", DEADLINE_URGENCY_TEXT[urgency])}>
            <DeadlineIcon size={16} strokeWidth={1.75} aria-hidden="true" />
            {formatDaysLeft(opportunity.daysLeft)}
          </span>
          <span className="text-neutral-600 text-right truncate">{opportunity.location}</span>
        </div>
      </div>
    </article>
  );
}
