"use client";

import { useState } from "react";
import { Bookmark, Check, ExternalLink, Share2, Sparkles } from "lucide-react";

import { cn } from "@/src/feature/dashboard/services/utils";
import { OpportunityDetail } from "../../types/opportunity";

const ICON_BUTTON_CLASS =
  "flex justify-center items-center bg-white shadow-card rounded-md w-8 h-8 text-neutral-600 hover:text-primary-800 transition-colors shrink-0";

/** Compact icon-only stand-in for ApplyCard's actions, shown on small
 * screens where ApplyCard itself is hidden. */
export function OverviewQuickActions({
  opportunity,
}: {
  opportunity: OpportunityDetail;
}) {
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: opportunity.title, url });
        return;
      } catch {
        // user cancelled the share sheet — fall through to clipboard copy
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard access denied — nothing more we can do here
    }
  }

  return (
    <div className="top-3 right-3 z-10 absolute flex gap-2 lg:hidden">
      <a
        href={opportunity.officialLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Apply now"
        className={cn(
          ICON_BUTTON_CLASS,
          "bg-primary-600 text-white hover:text-white hover:bg-primary-800",
        )}
      >
        <ExternalLink size={16} strokeWidth={1.75} />
      </a>
      <button
        type="button"
        aria-label={saved ? "Remove from saved" : "Save opportunity"}
        onClick={() => setSaved((value) => !value)}
        className={ICON_BUTTON_CLASS}
      >
        <Bookmark
          size={16}
          strokeWidth={1.75}
          className={cn(saved && "fill-primary-600 text-primary-600")}
        />
      </button>
      <button
        type="button"
        aria-label="Share opportunity"
        onClick={handleShare}
        className={ICON_BUTTON_CLASS}
      >
        {copied ? (
          <Check size={16} strokeWidth={1.75} />
        ) : (
          <Share2 size={16} strokeWidth={1.75} />
        )}
      </button>
      <button
        type="button"
        aria-label="Ask AI assistant"
        className={ICON_BUTTON_CLASS}
      >
        <Sparkles size={16} strokeWidth={1.75} />
      </button>
    </div>
  );
}
