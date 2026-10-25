import Link from "next/link";
import { Download, FileText, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReviewNoun } from "@/src/shared/lib/document-types";
import { CARD_CLASS } from "@/src/feature/dashboard/components/styles";
import { cn } from "@/src/feature/dashboard/services/utils";
import { buttonClasses } from "@/src/shared/ui/Button";
import { Skeleton } from "@/src/shared/ui/Skeleton";
import type { DocumentItem } from "../../types/document";

/** The feedback card while a review runs. */
export function ReviewingCard({ noun }: { noun: ReviewNoun }) {
  const t = useTranslations("documentReview");
  return (
    <section role="status" aria-live="polite" className={CARD_CLASS}>
      <p className="flex items-center gap-2 text-h2 text-neutral-900">
        <Sparkles size={18} strokeWidth={1.75} aria-hidden="true" className="text-primary-600" />
        {t("reviewingYour", { noun })}
      </p>
      <div className="flex flex-col gap-5 mt-5">
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-full h-3.5" />
            <Skeleton className="w-4/5 h-3.5" />
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * The file as a card with download.
 * TODO: preview PDFs and images inline. The file URL is served with X-Frame-Options: SAMEORIGIN
 * and Cross-Origin-Resource-Policy: same-origin, so it can't be framed or shown from this app
 * until the backend allows it (or serves it through our origin). Essays will show their text once
 * there's text extraction.
 */
export function FilePreviewCard({ item, onDownload }: { item: DocumentItem; onDownload: () => void }) {
  const t = useTranslations("documentReview");
  return (
    <section aria-label={t("file")} className={cn(CARD_CLASS, "flex flex-col items-center gap-3 py-12 text-center")}>
      <span aria-hidden="true" className="flex justify-center items-center bg-neutral-50 rounded-md size-14 text-neutral-600">
        <FileText size={26} strokeWidth={1.5} />
      </span>
      <div className="min-w-0 max-w-full">
        <p className="font-medium text-body text-neutral-900 break-words">{item.name}</p>
        <p className="text-caption text-neutral-600">
          {item.format} · {item.size}
        </p>
      </div>
      <p className="text-neutral-600 text-small">{t("noPreview")}</p>
      {!item.mock && (
        <button type="button" onClick={onDownload} className={buttonClasses("secondary")}>
          <Download size={16} strokeWidth={1.75} aria-hidden="true" />
          {t("download")}
        </button>
      )}
    </section>
  );
}

/** For an unreviewed document: what a review gives, the quota, and "Review with AI" (or the limit state). */
export function GetFeedbackCard({
  noun,
  remaining,
  limit,
  unlimited,
  onReview,
}: {
  noun: ReviewNoun;
  remaining: number;
  limit: number;
  unlimited: boolean;
  onReview: () => void;
}) {
  const t = useTranslations("documentReview");
  const atLimit = !unlimited && remaining === 0;
  return (
    <section aria-labelledby="get-feedback-heading" className={cn(CARD_CLASS, "flex flex-col gap-3 self-start")}>
      <span aria-hidden="true" className="flex justify-center items-center bg-primary-50 rounded-md size-10 text-primary-800">
        <Sparkles size={18} strokeWidth={1.75} />
      </span>
      <h2 id="get-feedback-heading" className="text-h2 text-neutral-900">
        {t("feedbackOn", { noun })}
      </h2>
      <p className="text-body text-neutral-600">
        {t("feedbackBody")}
      </p>
      {atLimit ? (
        <>
          <p className="text-body text-neutral-800">{t("usedAll", { limit })}</p>
          <Link href="/billing" className={buttonClasses("primary", "self-start")}>
            {t("upgrade")}
          </Link>
          <p className="text-caption text-neutral-600">{t("premiumIncludes")}</p>
        </>
      ) : (
        <>
          <p className="text-caption text-neutral-600">
            {unlimited ? t("unlimited") : t("left", { remaining, limit })}
          </p>
          <button type="button" onClick={onReview} className={buttonClasses("primary", "self-start")}>
            <Sparkles size={16} strokeWidth={1.75} aria-hidden="true" />
            {t("reviewWithAi")}
          </button>
        </>
      )}
    </section>
  );
}
