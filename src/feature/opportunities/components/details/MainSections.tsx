"use client";

import Link from "next/link";
import { Check, CircleHelp, ExternalLink, FileText, X } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { CARD_CLASS } from "@/src/feature/dashboard/components/styles";
import { useUserDocuments } from "@/src/feature/profile/hooks/useUserDocuments";
import type { EligibilityCriterion, EligibilityFit, OpportunityDetail } from "../../types/opportunity";
import { useLocale, useTranslations } from "next-intl";
import { intlLocale } from "@/src/i18n/format";

// What a section says when the listing doesn't cover it.
const NOT_LISTED_CLASS = "mt-2 text-body text-neutral-600";

/**
 * A short paragraph (four lines at most) with "Read more" to the official page, which has the
 * full text; many listings only carry an excerpt. Without an official link, the whole text shows.
 */
export function AboutSection({ description, officialLink }: { description?: string; officialLink?: string }) {
  const t = useTranslations();
  return (
    <section aria-labelledby="about-heading" className={CARD_CLASS}>
      <h2 id="about-heading" className="text-h2 text-neutral-900">
        {t("opportunity.details.about")}
      </h2>
      {description ? (
        <p dir="auto" className={cn("mt-2 max-w-[70ch] text-body text-neutral-800", officialLink && "line-clamp-4")}>
          {description}
        </p>
      ) : (
        <p className={NOT_LISTED_CLASS}>{t("opportunity.details.noDescription")}</p>
      )}
      {officialLink && (
        <a
          href={officialLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-3 rounded-sm font-medium text-primary-600 text-small hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
        >
          {t("opportunity.details.readMore")}
          <ExternalLink size={14} strokeWidth={1.75} aria-hidden="true" />
          <span className="sr-only">{t("common.opensInNewTab")}</span>
        </a>
      )}
    </section>
  );
}

// Labels are opportunity.details.<label>.
const FIT_STATE: Record<EligibilityFit, { label: "youMeet" | "youDontMeet" | "checkOfficial"; text: string; icon: React.ReactNode }> = {
  met: {
    label: "youMeet",
    text: "text-primary-800",
    icon: (
      <span className="flex justify-center items-center bg-primary-600 rounded-full size-5 text-white">
        <Check size={12} strokeWidth={3} />
      </span>
    ),
  },
  not_met: {
    label: "youDontMeet",
    text: "text-danger-800",
    icon: (
      <span className="flex justify-center items-center bg-danger-200 rounded-full size-5 text-danger-800">
        <X size={12} strokeWidth={3} />
      </span>
    ),
  },
  unknown: {
    label: "checkOfficial",
    text: "text-neutral-600",
    icon: <CircleHelp size={20} strokeWidth={1.75} className="text-neutral-600" />,
  },
};

/**
 * One line that never claims more than we know: "You meet 3 of 4 requirements" only when every
 * criterion has a verified fit; otherwise how many couldn't be verified. Nothing when no
 * criterion has a fit at all.
 */
function eligibilitySummary(criteria: EligibilityCriterion[]) {
  const withFit = criteria.filter((c) => c.userFit !== undefined);
  if (withFit.length === 0) return null;
  const unverified = criteria.filter((c) => c.userFit === undefined || c.userFit === "unknown").length;
  if (unverified > 0) return { kind: "unverified", count: unverified } as const;
  return { kind: "met", met: criteria.filter((c) => c.userFit === "met").length, total: criteria.length } as const;
}

export function EligibilitySection({ criteria }: { criteria: EligibilityCriterion[] }) {
  const t = useTranslations("opportunity.details");
  const result = eligibilitySummary(criteria);
  const summary = !result
    ? null
    : result.kind === "unverified"
      ? t("unverified", { count: result.count })
      : t("meetCount", { met: result.met, total: result.total });

  return (
    <section aria-labelledby="eligibility-heading" className={CARD_CLASS}>
      <h2 id="eligibility-heading" className="text-h2 text-neutral-900">
        {t("eligibility")}
      </h2>
      {criteria.length === 0 && (
        <p className={NOT_LISTED_CLASS}>{t("eligibilityNotListed")}</p>
      )}
      {summary && <p className="mt-1 text-body text-neutral-600">{summary}</p>}

      <ul className="empty:hidden flex flex-col gap-3 mt-4">
        {criteria.map((criterion) => {
          const state = criterion.userFit ? FIT_STATE[criterion.userFit] : undefined;
          return (
            <li key={criterion.text} className="flex items-start gap-3">
              <span aria-hidden="true" className="flex justify-center items-center size-5 shrink-0">
                {state ? state.icon : <span className="bg-neutral-400 rounded-full size-1.5" />}
              </span>
              <div className="min-w-0">
                <p className="text-body text-neutral-900">{criterion.text}</p>
                {state && <p className={cn("text-caption", state.text)}>{t(state.label)}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * Required documents with the user's upload state. Every row shows one: "Uploaded · filename"
 * when the user has a document of the same document type, otherwise "Not uploaded yet" with
 * an Add link, including documents with no type to match on. While loading,
 * or if the user's documents can't be fetched, rows say so instead of claiming either way.
 */
export function DocumentsSection({ documents }: { documents: OpportunityDetail["requiredDocuments"] }) {
  const t = useTranslations("opportunity.details");
  const userDocs = useUserDocuments();
  // TODO: if the user's documents carry no type at all, nothing can be matched, so every row
  // shows "Not uploaded yet" until uploads are typed.
  const matchFor = (doc: OpportunityDetail["requiredDocuments"][number]) =>
    userDocs.available && userDocs.typed && doc.type ? userDocs.byType.get(doc.type) : undefined;
  const ready = documents.filter((doc) => matchFor(doc) !== undefined).length;

  return (
    <section aria-labelledby="documents-heading" className={CARD_CLASS}>
      <h2 id="documents-heading" className="text-h2 text-neutral-900">
        {t("documents")}
      </h2>
      {documents.length === 0 ? (
        <p className={NOT_LISTED_CLASS}>{t("documentsNotListed")}</p>
      ) : (
        <p className="mt-1 text-body text-neutral-600">
          {userDocs.available
            ? t("documentsReady", { ready, count: documents.length })
            : userDocs.isLoading
              ? t("checkingDocuments")
              : t("documentsUnavailable")}
        </p>
      )}

      <ul className="empty:hidden flex flex-col gap-3 mt-4">
        {documents.map((doc) => {
          const uploaded = matchFor(doc);
          const status = !userDocs.available
            ? userDocs.isLoading
              ? t("checking")
              : t("notChecked")
            : uploaded
              ? null
              : t("notUploaded");

          return (
            <li key={doc.name} className="flex items-start gap-3">
              <span aria-hidden="true" className="flex justify-center items-center size-5 shrink-0">
                {uploaded ? (
                  <span className="flex justify-center items-center bg-primary-600 rounded-full size-5 text-white">
                    <Check size={12} strokeWidth={3} />
                  </span>
                ) : (
                  <FileText size={18} strokeWidth={1.75} className="text-neutral-600" />
                )}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-body text-neutral-900">{doc.name}</p>
                {uploaded ? (
                  <p className="text-neutral-600 text-small truncate">
                    <span className="text-primary-800">{t("uploaded")}</span> · {uploaded.displayName ?? t("documentFallback")}
                  </p>
                ) : (
                  <p className="text-neutral-600 text-small">{status}</p>
                )}
              </div>
              {userDocs.available && !uploaded && (
                // TODO: link to a Documents section on the profile once one exists.
                <Link
                  href="/documents"
                  aria-label={t("addItem", { item: doc.name.toLowerCase() })}
                  className="inline-flex items-center rounded-sm min-h-11 md:min-h-0 font-medium text-neutral-600 text-small hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 shrink-0"
                >
                  {t("add")}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/** "Information last checked Oct 6, 2026 · Source: listings.example.org"; hidden without both. */
export function SourceLine({ sourceUrl, lastCheckedAt }: { sourceUrl?: string; lastCheckedAt?: string }) {
  const t = useTranslations();
  const locale = useLocale();
  // TODO: every listing should carry its source and last-checked date once scraping provides them.
  if (!sourceUrl || !lastCheckedAt) return null;
  const [year, month, day] = lastCheckedAt.split("-").map(Number);
  const checked = new Date(year, month - 1, day).toLocaleDateString(intlLocale(locale), { month: "short", day: "numeric", year: "numeric" });
  const domain = new URL(sourceUrl).hostname.replace(/^www\./, "");

  return (
    <p className="text-neutral-600 text-small">
      {t("opportunity.details.lastChecked", { date: checked })}{" "}
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-sm text-neutral-800 hover:text-neutral-900 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
      >
        {domain}
        <ExternalLink size={12} strokeWidth={1.75} aria-hidden="true" />
        <span className="sr-only">{t("common.opensInNewTab")}</span>
      </a>
    </p>
  );
}
