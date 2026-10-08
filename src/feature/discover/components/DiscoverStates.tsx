import Link from "next/link";
import { Info, SearchX } from "lucide-react";
import { buttonClasses } from "@/src/shared/ui/Button";
import type { MissingField } from "../hooks/useMatchingReadiness";

const STATE_LAYOUT_CLASS = "flex flex-col items-center gap-2 mx-auto px-6 py-12 w-full max-w-xl text-center";
const STATE_CARD_CLASS = `${STATE_LAYOUT_CLASS} bg-white border border-neutral-100 rounded-lg`;

/** Replaces results until the profile has the fields matching needs (FR-3.11). */
export function ProfileIncompleteState({ missing }: { missing: MissingField }) {
  return (
    <div className={STATE_CARD_CLASS}>
      <h2 className="text-h3 text-neutral-900">Complete your profile to see matches</h2>
      <p className="max-w-md text-body text-neutral-600">
        Your education level, field of study, and nationality decide which opportunities you&apos;re eligible for.
      </p>
      <Link href={missing.href} className={buttonClasses("primary", "mt-3")}>
        Complete your profile
      </Link>
    </div>
  );
}

export function NoResultsState({ onClearAll }: { onClearAll: () => void }) {
  return (
    // Sits on the page background; the icon gets the white circle so it still reads.
    <div className={STATE_LAYOUT_CLASS}>
      <span aria-hidden="true" className="flex justify-center items-center bg-white mb-2 rounded-full size-12 text-neutral-600">
        <SearchX size={24} strokeWidth={1.75} />
      </span>
      <h2 className="text-h3 text-neutral-900">No opportunities match these filters</h2>
      <button type="button" onClick={onClearAll} className={buttonClasses("secondary", "mt-3")}>
        Clear all filters
      </button>
    </div>
  );
}

/** Shown above the grid when nothing passes the hard filters and closest results are shown instead. */
export function RelaxedResultsBanner() {
  return (
    <p className="flex items-start gap-2 bg-info-50 px-4 py-3 border border-info-400/30 rounded-md text-body text-info-800">
      <Info size={20} strokeWidth={1.75} aria-hidden="true" className="mt-px shrink-0" />
      No exact matches yet, so here are the closest opportunities. Check eligibility before applying.
    </p>
  );
}
