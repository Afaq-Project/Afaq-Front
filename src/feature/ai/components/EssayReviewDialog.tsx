"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { buttonClasses } from "@/src/shared/ui/Button";
import Modal from "@/src/shared/ui/Modal";

const FOCUSABLE = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled])';

export interface EssaySubmission {
  essayName: string;
  purpose?: string;
  text: string;
}

interface EssayReviewDialogProps {
  open: boolean;
  onClose: () => void;
  /** Prefills "What is this essay for?", e.g. the chat's opportunity. */
  defaultPurpose?: string;
  used: number;
  limit: number;
  resetsOn?: string;
  onSubmit: (essay: EssaySubmission) => void;
}

/**
 * Paste an essay or pick a .docx/.pdf/.txt, say what it's for, and request a review. Shows the
 * remaining quota, or an upgrade card once it's used up. Keeps focus inside while open.
 */
export function EssayReviewDialog({ open, onClose, defaultPurpose, used, limit, resetsOn, onSubmit }: EssayReviewDialogProps) {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [purpose, setPurpose] = useState(defaultPurpose ?? "");
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
    }
  }

  // Focus the first field, and keep Tab inside the dialog.
  useEffect(() => {
    if (!open) return;
    const dialog = contentRef.current?.closest<HTMLElement>('[role="dialog"]');
    dialog?.querySelector<HTMLElement>("textarea, a[href], button:not([disabled])")?.focus();
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

  const canSubmit = text.trim().length > 0 || fileName !== null;

  return (
    <Modal open={open} onClose={onClose} title="Review an essay" className="max-w-xl">
      <div ref={contentRef}>
        {remaining === 0 ? (
          <div className="flex flex-col items-start gap-3">
            <p className="text-body text-neutral-800">
              You&apos;ve used all {limit} essay reviews this month.
              {resetsOn && " They reset next month."}
            </p>
            <Link href="/billing" className={buttonClasses("primary")}>
              Upgrade to Premium
            </Link>
            <p className="text-caption text-neutral-600">Premium includes unlimited chat and essay reviews.</p>
          </div>
        ) : (
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (!canSubmit) return;
              onSubmit({ essayName: fileName ?? "Pasted essay", purpose: purpose.trim() || undefined, text });
            }}
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="essay-text" className="text-caption text-neutral-600">
                Paste your essay
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
                Or upload a file (.docx, .pdf, .txt)
              </label>
              <input
                id="essay-file"
                type="file"
                accept=".docx,.pdf,.txt"
                onChange={(event) => onFile(event.target.files?.[0])}
                className="file:bg-white file:mr-3 file:px-3 file:border file:border-neutral-200 file:rounded-sm file:h-9 file:font-medium text-neutral-800 text-small file:text-neutral-800 file:cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="essay-purpose" className="text-caption text-neutral-600">
                What is this essay for? (optional)
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
                {remaining} of {limit} reviews left this month
              </p>
              <button type="submit" disabled={!canSubmit} className={buttonClasses("primary")}>
                Review essay
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
}
