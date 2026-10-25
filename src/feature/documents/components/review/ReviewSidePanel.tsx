"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { Download, FileText, RefreshCw, RotateCcw } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReviewNoun } from "@/src/shared/lib/document-types";
import { cn } from "@/src/feature/dashboard/services/utils";
import { FlagTile } from "@/src/feature/opportunities/components/FlagTile";
import { countryName } from "@/src/shared/lib/countries";
import { buttonClasses } from "@/src/shared/ui/Button";
import type { DialogKind } from "../library/DocumentDialogs";
import { DocumentMenu } from "../library/DocumentRows";
import type { DocumentItem } from "../../types/document";
import { Deadline } from "../library/NeededSection";

const SIDE_CARD = "flex flex-col gap-3 bg-white p-5 border border-neutral-100 rounded-lg";
const SMALL_GHOST = "gap-1.5 px-2 h-9 md:h-8 text-small";

function CardTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex justify-between items-center gap-2">
      <h2 className="text-h3 text-neutral-900">{children}</h2>
      {action}
    </div>
  );
}

/** The file: name, format and size, Download and Replace file, and the ⋯ menu (rename, link, delete). */
export function YourFileCard({
  item,
  noun,
  onDownload,
  onAction,
}: {
  item: DocumentItem;
  noun: ReviewNoun;
  onDownload: () => void;
  onAction: (kind: DialogKind, item: DocumentItem) => void;
}) {
  const t = useTranslations("documentReview");
  const title = t("yourNoun", { noun });
  return (
    <section aria-label={title} className={SIDE_CARD}>
      <CardTitle action={<DocumentMenu item={item} onAction={onAction} onPage />}>{title}</CardTitle>
      <div className="flex items-center gap-3 min-w-0">
        <span aria-hidden="true" className="flex justify-center items-center bg-neutral-50 rounded-md size-10 text-neutral-600 shrink-0">
          <FileText size={18} strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="font-medium text-body text-neutral-900 truncate">{item.name}</p>
          <p className="text-caption text-neutral-600">
            {item.format} · {item.size}
          </p>
        </div>
      </div>
      {!item.mock && (
        <div className="flex flex-wrap gap-1 -ms-2">
          <button type="button" onClick={onDownload} className={buttonClasses("ghost", SMALL_GHOST)}>
            <Download size={14} strokeWidth={1.75} aria-hidden="true" />
            {t("download")}
          </button>
          <button type="button" onClick={() => onAction("replace", item)} className={buttonClasses("ghost", SMALL_GHOST)}>
            <RefreshCw size={14} strokeWidth={1.75} aria-hidden="true" />
            {t("replaceFile")}
          </button>
        </div>
      )}
    </section>
  );
}

/** The applications the document is linked to, with each one's deadline; or a prompt to link one. */
export function UsedForCard({ item, onLink }: { item: DocumentItem; onLink: () => void }) {
  const t = useTranslations("documentReview");
  const locale = useLocale();
  return (
    <section aria-labelledby="used-for-heading" className={SIDE_CARD}>
      <h2 id="used-for-heading" className="text-h3 text-neutral-900">
        {t("usedFor")}
      </h2>
      {item.usedIn.length === 0 ? (
        <>
          <p className="text-neutral-600 text-small">{t("notLinked")}</p>
          <button type="button" onClick={onLink} className={buttonClasses("soft", "self-start px-3 h-9 md:h-8 text-small")}>
            {t("linkToApplication")}
          </button>
        </>
      ) : (
        <ul className="flex flex-col gap-3">
          {item.usedIn.map((application) => (
            <li key={application.id}>
              <Link
                href={`/applications/${application.id}`}
                className="group flex items-start gap-2.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
              >
                <FlagTile
                  countryCode={application.opportunity?.countryCode}
                  countryName={application.opportunity?.countryCode ? countryName(application.opportunity.countryCode, locale) : undefined}
                  remote={Boolean(application.opportunity?.isRemote) || !application.opportunity?.countryCode}
                />
                <span className="flex flex-col min-w-0">
                  <span className="text-neutral-900 text-small group-hover:underline underline-offset-2">{application.title}</span>
                  <span className="text-caption">
                    <Deadline days={application.daysLeft} />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/**
 * The next review: the quota and "Review again". Once every suggestion is checked it turns into a
 * green prompt with a primary "Review again"; at the limit, the upgrade state.
 */
export function NextReviewCard({
  remaining,
  limit,
  unlimited,
  allDone,
  onReview,
}: {
  remaining: number;
  limit: number;
  unlimited: boolean;
  allDone: boolean;
  onReview: () => void;
}) {
  const t = useTranslations("documentReview");
  const atLimit = !unlimited && remaining === 0;
  const highlight = allDone && !atLimit;
  return (
    <section aria-labelledby="next-review-heading" className={cn(SIDE_CARD, highlight && "bg-primary-50 border-primary-100")}>
      <h2 id="next-review-heading" className="text-h3 text-neutral-900">
        {t("nextReview")}
      </h2>
      {atLimit ? (
        <>
          <p className="text-body text-neutral-800">{t("usedAll", { limit })}</p>
          {/* Secondary so the header's "Ask a follow-up" stays the page's only primary action. */}
          <Link href="/billing" className={buttonClasses("secondary", "self-start")}>
            {t("upgrade")}
          </Link>
          <p className="text-caption text-neutral-600">{t("premiumIncludes")}</p>
        </>
      ) : (
        <>
          {highlight && <p className="text-body text-neutral-900">{t("allWorkedThrough")}</p>}
          <p className="text-neutral-600 text-small">
            {unlimited ? t("unlimited") : t("left", { remaining, limit })}
          </p>
          <button type="button" onClick={onReview} className={buttonClasses(highlight ? "primary" : "secondary", "self-start")}>
            <RotateCcw size={16} strokeWidth={1.75} aria-hidden="true" />
            {t("reviewAgain")}
          </button>
        </>
      )}
    </section>
  );
}
