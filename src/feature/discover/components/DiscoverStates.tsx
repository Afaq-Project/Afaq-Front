import Link from "next/link";
import { Info, SearchX } from "lucide-react";
import { buttonClasses } from "@/src/shared/ui/Button";
import type { MissingField } from "../hooks/useMatchingReadiness";
import { useTranslations } from "next-intl";

const STATE_LAYOUT_CLASS = "flex flex-col items-center gap-2 mx-auto px-6 py-12 w-full max-w-xl text-center";
const BANNER_CLASS = "flex items-start gap-2 bg-info-50 px-4 py-3 border border-info-400/30 rounded-md text-body text-info-800";
const BANNER_LINK_CLASS =
  "rounded-sm font-medium underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2";

/**
 * Above the results while the profile lacks what matching needs (FR-3.11). With matches it asks
 * for more accurate ones; without, for any score at all.
 */
export function ProfileIncompleteBanner({ missing, hasMatches }: { missing: MissingField; hasMatches: boolean }) {
  const t = useTranslations("discover");
  const field = t(`missing.${missing.key}`);
  return (
    <p className={BANNER_CLASS}>
      <Info size={20} strokeWidth={1.75} aria-hidden="true" className="mt-px shrink-0" />
      <span>
        {hasMatches
          ? t("improveMatches", { field })
          : t("seeMatches", { field })}{" "}
        <Link href={missing.href} className={BANNER_LINK_CLASS}>
          {t("completeProfile")}
        </Link>
      </span>
    </p>
  );
}

/**
 * Above unscored results when the profile is matchable but nothing scored can be shown: no
 * scores yet, or every match is one v1 hides (closed, another type, or in Arabic).
 */
export function MatchesPendingBanner({ hiddenMatches }: { hiddenMatches: boolean }) {
  const t = useTranslations("discover");
  return (
    <p className={BANNER_CLASS}>
      <Info size={20} strokeWidth={1.75} aria-hidden="true" className="mt-px shrink-0" />
      {hiddenMatches
        ? t("hiddenMatches")
        : t("calculating")}
    </p>
  );
}

/** Empty results; with filters on, offers to clear them. */
export function NoResultsState({ onClearAll }: { onClearAll?: () => void }) {
  const t = useTranslations("discover");
  return (
    // Sits on the page background; the icon gets the white circle so it still reads.
    <div className={STATE_LAYOUT_CLASS}>
      <span aria-hidden="true" className="flex justify-center items-center bg-white mb-2 rounded-full size-12 text-neutral-600">
        <SearchX size={24} strokeWidth={1.75} />
      </span>
      <h2 className="text-h3 text-neutral-900">
        {onClearAll ? t("noMatchFilters") : t("noneYet")}
      </h2>
      {onClearAll ? (
        <button type="button" onClick={onClearAll} className={buttonClasses("secondary", "mt-3")}>
          {t("clearFilters")}
        </button>
      ) : (
        <p className="text-body text-neutral-600">{t("addedDaily")}</p>
      )}
    </div>
  );
}
