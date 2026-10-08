"use client";

import Link from "next/link";
import { Check, CircleHelp, ExternalLink, FileText, X } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { CARD_CLASS } from "@/src/feature/dashboard/components/styles";
import { useUserDocuments } from "@/src/feature/profile/hooks/useUserDocuments";
import type { EligibilityCriterion, EligibilityFit, OpportunityDetail } from "../../types/opportunity";

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? "" : "s"}`;

export function AboutSection({ description }: { description: string }) {
  return (
    <section aria-labelledby="about-heading" className={CARD_CLASS}>
      <h2 id="about-heading" className="text-h2 text-neutral-900">
        About
      </h2>
      <p className="mt-2 max-w-[70ch] text-body text-neutral-800">{description}</p>
    </section>
  );
}

const FIT_STATE: Record<EligibilityFit, { label: string; text: string; icon: React.ReactNode }> = {
  met: {
    label: "You meet this",
    text: "text-primary-800",
    icon: (
      <span className="flex justify-center items-center bg-primary-600 rounded-full size-5 text-white">
        <Check size={12} strokeWidth={3} />
      </span>
    ),
  },
  not_met: {
    label: "You don't meet this",
    text: "text-danger-800",
    icon: (
      <span className="flex justify-center items-center bg-danger-200 rounded-full size-5 text-danger-800">
        <X size={12} strokeWidth={3} />
      </span>
    ),
  },
  unknown: {
    label: "Check the official page",
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
  if (unverified > 0) return `We couldn't verify ${plural(unverified, "requirement")}. Check the official page.`;
  const met = criteria.filter((c) => c.userFit === "met").length;
  return `You meet ${met} of ${criteria.length} requirements`;
}

export function EligibilitySection({ criteria }: { criteria: EligibilityCriterion[] }) {
  const summary = eligibilitySummary(criteria);

  return (
    <section aria-labelledby="eligibility-heading" className={CARD_CLASS}>
      <h2 id="eligibility-heading" className="text-h2 text-neutral-900">
        Eligibility
      </h2>
      {summary && <p className="mt-1 text-body text-neutral-600">{summary}</p>}

      <ul className="flex flex-col gap-3 mt-4">
        {criteria.map((criterion) => {
          const state = criterion.userFit ? FIT_STATE[criterion.userFit] : undefined;
          return (
            <li key={criterion.text} className="flex items-start gap-3">
              <span aria-hidden="true" className="flex justify-center items-center size-5 shrink-0">
                {state ? state.icon : <span className="bg-neutral-400 rounded-full size-1.5" />}
              </span>
              <div className="min-w-0">
                <p className="text-body text-neutral-900">{criterion.text}</p>
                {state && <p className={cn("text-caption", state.text)}>{state.label}</p>}
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
 * when the user has a document of the same explicit category, otherwise "Not uploaded yet" with
 * an Add link, including documents no profile category covers (e.g. passport). While loading,
 * or if the user's documents can't be fetched, rows say so instead of claiming either way.
 */
export function DocumentsSection({ documents }: { documents: OpportunityDetail["requiredDocuments"] }) {
  const userDocs = useUserDocuments();
  // TODO: if the user's documents carry no type at all, nothing can be matched, so every row
  // shows "Not uploaded yet" until uploads are typed.
  const matchFor = (doc: OpportunityDetail["requiredDocuments"][number]) =>
    userDocs.available && userDocs.typed && doc.category ? userDocs.byCategory.get(doc.category) : undefined;
  const ready = documents.filter((doc) => matchFor(doc) !== undefined).length;

  return (
    <section aria-labelledby="documents-heading" className={CARD_CLASS}>
      <h2 id="documents-heading" className="text-h2 text-neutral-900">
        Documents required
      </h2>
      <p className="mt-1 text-body text-neutral-600">
        {userDocs.available
          ? `You have ${ready} of ${plural(documents.length, "document")} ready.`
          : userDocs.isLoading
            ? "Checking your documents…"
            : "We couldn't check your uploaded documents right now."}
      </p>

      <ul className="flex flex-col gap-3 mt-4">
        {documents.map((doc) => {
          const uploaded = matchFor(doc);
          const status = !userDocs.available
            ? userDocs.isLoading
              ? "Checking…"
              : "Not checked"
            : uploaded
              ? null
              : "Not uploaded yet";

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
                    <span className="text-primary-800">Uploaded</span> · {uploaded.displayName ?? "Document"}
                  </p>
                ) : (
                  <p className="text-neutral-600 text-small">{status}</p>
                )}
              </div>
              {userDocs.available && !uploaded && (
                // TODO: link to a Documents section on the profile once one exists.
                <Link
                  href="/documents"
                  aria-label={`Add ${doc.name.toLowerCase()}`}
                  className="inline-flex items-center rounded-sm min-h-11 md:min-h-0 font-medium text-neutral-600 text-small hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 shrink-0"
                >
                  Add
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
  // TODO: every listing should carry its source and last-checked date once scraping provides them.
  if (!sourceUrl || !lastCheckedAt) return null;
  const [year, month, day] = lastCheckedAt.split("-").map(Number);
  const checked = new Date(year, month - 1, day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const domain = new URL(sourceUrl).hostname.replace(/^www\./, "");

  return (
    <p className="text-neutral-600 text-small">
      Information last checked {checked} · Source:{" "}
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 rounded-sm text-neutral-800 hover:text-neutral-900 underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
      >
        {domain}
        <ExternalLink size={12} strokeWidth={1.75} aria-hidden="true" />
        <span className="sr-only">(opens in a new tab)</span>
      </a>
    </p>
  );
}
