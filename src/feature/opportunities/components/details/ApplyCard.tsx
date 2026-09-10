"use client";

import { useState } from "react";
import { Bookmark, Check, Share2, Sparkles } from "lucide-react";

import Card from "@/src/shared/ui/Card";
import Button from "@/src/shared/ui/Button";
import { cn } from "@/src/feature/dashboard/services/utils";
import { OpportunityDetail } from "../../types/opportunity";

export function ApplyCard({
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
    <Card>
      <a
        href={opportunity.officialLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex justify-center items-center gap-2 bg-primary-600 hover:bg-primary-800 rounded-sm w-full h-11 font-medium text-white text-sm transition-colors"
      >
        Apply now
      </a>

      <div className="gap-2 grid grid-cols-2 mt-3">
        <Button
          type="button"
          variant="secondary"
          onClick={() => setSaved((value) => !value)}
          className="gap-1.5"
        >
          <Bookmark
            size={16}
            strokeWidth={1.75}
            className={cn(saved && "fill-primary-600 text-primary-600")}
          />
          {saved ? "Saved" : "Save"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={handleShare}
          className="gap-1.5"
        >
          {copied ? (
            <Check size={16} strokeWidth={1.75} />
          ) : (
            <Share2 size={16} strokeWidth={1.75} />
          )}
          {copied ? "Copied" : "Share"}
        </Button>
      </div>

      <Button type="button" variant="ghost" className="gap-1.5 mt-2 w-full">
        <Sparkles size={16} strokeWidth={1.75} />
        Ask AI assistant
      </Button>
    </Card>
  );
}
