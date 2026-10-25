"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReviewNoun } from "@/src/shared/lib/document-types";
import { buttonClasses } from "@/src/shared/ui/Button";
import Modal from "@/src/shared/ui/Modal";

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])';

export interface EssaySubmission {
  essayName: string;
  /** Set when an uploaded essay document was reviewed. */
  documentId?: string;
  purpose?: string;
  text: string;
}

/** An uploaded essay the dialog can review. */
export interface EssayChoice {
  id?: string;
  name: string;
  detail?: string;
  /** It already has a review, which a new one replaces. */
  hasReview?: boolean;
  /** How the copy names it: "essay" (default), "CV", "recommendation letter". */
  noun?: ReviewNoun;
}

interface EssayReviewDialogProps {
  open: boolean;
  onClose: () => void;
  /** Prefills "What is this essay for?", e.g. the chat's opportunity. */
  defaultPurpose?: string;
  /** An uploaded essay to review; replaces the paste and file fields. */
  document?: EssayChoice;
  /** The user's essay documents to pick from (when no `document` is given), besides pasting one. */
  choices?: (EssayChoice & { id: string })[];
  used: number;
  limit: number;
  /** Premium: no monthly limit, so no quota line or limit-reached state. */
  unlimited?: boolean;
  resetsOn?: string;
  onSubmit: (essay: EssaySubmission) => void;
}

/**
 * Paste an essay or pick a .docx/.pdf/.txt (or review an uploaded `document`), say what it's
 * for, and request a review. Shows the remaining quota, or an upgrade card once it's used up.
 * Keeps focus inside while open.
 */
export function EssayReviewDialog({
  open,
  onClose,
  defaultPurpose,
  document: givenDocument,
  choices = [],
  used,
  limit,
  unlimited = false,
  resetsOn,
  onSubmit,
}: EssayReviewDialogProps) {
  const tReview = useTranslations("documentReview");
  const t = useTranslations("ai.reviewDialog");
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [purpose, setPurpose] = useState(defaultPurpose ?? "");
  const [choiceId, setChoiceId] = useState("");
  const essayDocument = givenDocument ?? choices.find((choice) => choice.id === choiceId);
  const noun: ReviewNoun = essayDocument?.noun ?? "essay";
  const contentRef = useRef<HTMLDivElement>(null);
  const remaining = Math.max(0, limit - used);

  // Start fresh each time it opens.
  const [openedFor, setOpenedFor] = useState(false);
  if (open !== openedFor) {
    setOpenedFor(open);
    if (open) {
      setText("");
      setFileName(null);
      setPurpose(defaultPurpose ?? "");
      setChoiceId("");
    }
  }

  // Focus the first field, and keep Tab inside the dialog.
  useEffect(() => {
    if (!open) return;
    const dialog = contentRef.current?.closest<HTMLElement>('[role="dialog"]');
    dialog?.querySelector<HTMLElement>("textarea, input, a[href], button:not([disabled])")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    setFileName(file.name);
    if (file.name.toLowerCase().endsWith(".txt")) {
      file.text().then(setText).catch(() => setText(""));
    }
    // TODO: extract text from .docx and .pdf (needs a parser or a server call); for now the file
    // name is sent and the review works from whatever text is pasted.
  };

  const canSubmit = Boolean(essayDocument) || text.trim().length > 0 || fileName !== null;

  return (
    <Modal open={open} onClose={onClose} title={givenDocument ? tReview("reviewYour", { noun }) : tReview("reviewWithAi")} className="max-w-xl">
      <div ref={contentRef}>
        {!unlimited && remaining === 0 ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-body text-neutral-800">
              {t("usedAll", { limit })}
              {resetsOn && t("resetsNextMonth")}
            </p>
            <Link href="/billing" className={buttonClasses("primary")}>
              {tReview("upgrade")}
            </Link>
            <p className="text-caption text-neutral-600">{tReview("premiumIncludes")}</p>
          </div>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!canSubmit) return;
              onSubmit({
                essayName: essayDocument?.name ?? fileName ?? t("pasted"),
                documentId: essayDocument?.id,
                purpose: purpose.trim() || undefined,
                text,
              });
            }}
          >
            {!givenDocument && choices.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="essay-choice" className="text-caption text-neutral-600">
                  {t("document")}
                </label>
                <select
                  id="essay-choice"
                  value={choiceId}
                  onChange={(event) => setChoiceId(event.target.value)}
                  className="bg-white px-3 border border-neutral-200 focus:border-primary-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full h-10 text-body text-neutral-900"
                >
                  <option value="">{t("pasteOrUpload")}</option>
                  {choices.map((choice) => (
                    <option key={choice.id} value={choice.id}>
                      {choice.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {essayDocument ? (
              <div className="flex items-center gap-3 px-3 py-2.5 border border-neutral-200 rounded-sm">
                <span aria-hidden="true" className="flex justify-center items-center bg-neutral-50 rounded-md size-9 text-neutral-600 shrink-0">
                  <FileText size={16} strokeWidth={1.75} />
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-body text-neutral-900 truncate">{essayDocument.name}</p>
                  {essayDocument.detail && <p className="text-caption text-neutral-600">{essayDocument.detail}</p>}
                </div>
              </div>
            ) : null}
            {essayDocument?.hasReview && (
              <p className="text-neutral-600 text-small">{t("replaces")}</p>
            )}
            {!essayDocument && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="essay-text" className="text-caption text-neutral-600">
                    {t("paste")}
                  </label>
                  <textarea
                    id="essay-text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    rows={8}
                    className="bg-white px-3 py-2 border border-neutral-200 focus:border-primary-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full text-body text-neutral-900 resize-y"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="essay-file" className="text-caption text-neutral-600">
                    {t("upload")}
                  </label>
                  <input
                    id="essay-file"
                    type="file"
                    accept=".docx,.pdf,.txt"
                    onChange={(event) => onFile(event.target.files?.[0])}
                    className="file:bg-white file:me-3 file:px-3 file:border file:border-neutral-200 file:rounded-sm file:h-9 file:font-medium text-neutral-800 text-small file:text-neutral-800 file:cursor-pointer"
                  />
                </div>
              </>
            )}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="essay-purpose" className="text-caption text-neutral-600">
                {tReview("whatFor", { noun })}
              </label>
              <input
                id="essay-purpose"
                value={purpose}
                onChange={(event) => setPurpose(event.target.value)}
                className="bg-white px-3 border border-neutral-200 focus:border-primary-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full h-10 text-body text-neutral-900"
              />
            </div>
            <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-3 pt-2">
              <p className="text-caption text-neutral-600">
                {unlimited ? tReview("unlimited") : tReview("left", { remaining, limit })}
              </p>
              <button type="submit" disabled={!canSubmit} className={buttonClasses("primary")}>
                {t("submit")}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
