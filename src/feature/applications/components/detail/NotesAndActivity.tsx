"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { CARD_CLASS, GHOST_LINK_CLASS } from "@/src/feature/dashboard/components/styles";
import { cn } from "@/src/feature/dashboard/services/utils";
import { relativeDay } from "@/src/shared/lib/deadline";
import { STATUS_COLORS } from "@/src/shared/lib/status-colors";
import type { ApplicationActivityItem } from "../../types/detail";

/** The entry's text, from its kind and data. */
function useActivityLabel() {
  const t = useTranslations("applications.activity");
  const tStatus = useTranslations("applicationStatus");
  return (item: ApplicationActivityItem) => {
    if (item.kind === "tracked") return t("started");
    if (item.kind === "document") return t("linked", { name: item.documentName ?? "" });
    if (item.kind === "reminder") return t("reminder");
    if (item.status === "accepted" || item.status === "rejected") return t(item.status);
    return t("movedTo", { status: item.status ? tStatus(item.status) : "" });
  };
}

/** Free-form notes, saved when the field loses focus. */
export function NotesCard({ initial }: { initial?: string }) {
  // TODO: notes aren't persisted yet; they live in local state and reset on reload.
  const t = useTranslations("applications.notes");
  const [notes, setNotes] = useState(initial ?? "");
  const [savedValue, setSavedValue] = useState(initial ?? "");
  const [showSaved, setShowSaved] = useState(false);

  return (
    <section aria-labelledby="notes-heading" className={CARD_CLASS}>
      <div className="flex justify-between items-center gap-3">
        <h2 id="notes-heading" className="text-h2 text-neutral-900">
          {t("title")}
        </h2>
        <p aria-live="polite" className="flex items-center gap-1 text-caption text-neutral-600">
          {showSaved && (
            <>
              <Check size={12} strokeWidth={2.5} aria-hidden="true" className="text-primary-600" />
              {t("saved")}
            </>
          )}
        </p>
      </div>
      <label htmlFor="application-notes" className="sr-only">
        {t("title")}
      </label>
      <textarea
        id="application-notes"
        value={notes}
        onChange={(event) => {
          setNotes(event.target.value);
          setShowSaved(false);
        }}
        onBlur={() => {
          if (notes === savedValue) return;
          setSavedValue(notes);
          setShowSaved(true);
        }}
        placeholder={t("placeholder")}
        className="bg-white mt-3 px-3 py-2 border border-neutral-200 focus:border-primary-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full min-h-24 text-body text-neutral-900 placeholder:text-neutral-400 resize-y"
      />
    </section>
  );
}

const VISIBLE = 5;

/** Status changes (dot in the status color), linked documents and reminders, newest first. */
export function ActivityCard({ items, now }: { items: ApplicationActivityItem[]; now: Date }) {
  const t = useTranslations("applications.activity");
  const locale = useLocale();
  const labelFor = useActivityLabel();
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? items : items.slice(0, VISIBLE);

  return (
    <section aria-labelledby="activity-heading" className={CARD_CLASS}>
      <h2 id="activity-heading" className="text-h3 text-neutral-900">
        {t("title")}
      </h2>
      {items.length === 0 ? (
        <p className="mt-3 text-neutral-600 text-small">{t("empty")}</p>
      ) : (
        <ol className="mt-4">
          {shown.map((item, index) => (
            <li key={`${item.id}-${index}`} className="relative flex gap-3 pb-4 last:pb-0">
              {index < shown.length - 1 && (
                <span aria-hidden="true" className="top-3 bottom-0 start-[4.5px] absolute bg-neutral-100 w-px" />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  "relative mt-1.5 rounded-full size-2.5 shrink-0",
                  (item.kind === "status" || item.kind === "tracked") && item.status ? STATUS_COLORS[item.status].dot : "bg-neutral-400",
                )}
              />
              <div className="min-w-0">
                <p className="font-medium text-neutral-900 text-small">{labelFor(item)}</p>
                <p className="text-caption text-neutral-600">{relativeDay(item.at, now, locale)}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
      {items.length > VISIBLE && (
        <button type="button" onClick={() => setShowAll((value) => !value)} className={cn(GHOST_LINK_CLASS, "mt-2")}>
          {showAll ? t("showLess") : t("showAll", { count: items.length })}
        </button>
      )}
    </section>
  );
}
