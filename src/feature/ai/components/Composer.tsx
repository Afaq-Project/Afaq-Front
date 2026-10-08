"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUp, FileText } from "lucide-react";
import { formatDeadlineDay } from "@/src/shared/lib/deadline";
import { buttonClasses } from "@/src/shared/ui/Button";

const MAX_HEIGHT_PX = 6 * 22 + 20; // six 22px lines plus vertical padding
const SHOW_COUNT_FROM = 1500;

interface ComposerProps {
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: (text: string) => void;
  onReviewEssay: () => void;
  /** While waiting for a reply. */
  busy: boolean;
  limitReached: boolean;
  chatLimit: number;
  resetsOn?: string;
}

/**
 * Message input pinned to the bottom of the conversation: a textarea that grows to six lines
 * (Enter sends, Shift+Enter adds a line), "Review an essay", the send button, and one
 * disclaimer line. Replaced by an upgrade card once the monthly chat limit is reached.
 */
export function Composer({ draft, onDraftChange, onSend, onReviewEssay, busy, limitReached, chatLimit, resetsOn }: ComposerProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [draft]);

  if (limitReached) {
    return (
      <div className="flex flex-col items-start gap-2 bg-neutral-50 m-4 md:m-5 px-4 py-4 border border-neutral-100 rounded-lg">
        <p className="text-body text-neutral-800">
          You&apos;ve used all {chatLimit} chat messages this month.
          {resetsOn && ` They reset on ${formatDeadlineDay(resetsOn)}.`}
        </p>
        <Link href="/billing" className={buttonClasses("primary")}>
          Upgrade to Premium
        </Link>
        <p className="text-caption text-neutral-600">Premium includes unlimited chat and essay reviews.</p>
      </div>
    );
  }

  const text = draft.trim();
  const send = () => {
    if (!text || busy) return;
    onSend(text);
  };

  return (
    <div className="flex flex-col gap-2 px-4 md:px-5 pt-3 pb-3 border-neutral-100 border-t">
      <label htmlFor="chat-input" className="sr-only">
        Message
      </label>
      <textarea
        ref={textareaRef}
        id="chat-input"
        rows={1}
        value={draft}
        onChange={(event) => onDraftChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
            event.preventDefault();
            send();
          }
        }}
        placeholder="Ask about eligibility, essays, or your application…"
        className="bg-white px-3 py-2.5 border border-neutral-200 focus:border-primary-600 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-400 w-full text-body text-neutral-900 placeholder:text-neutral-400 resize-none"
      />
      <div className="flex justify-between items-center gap-3">
        <button type="button" onClick={onReviewEssay} className={buttonClasses("soft", "px-3 text-small")}>
          <FileText size={16} strokeWidth={1.75} aria-hidden="true" />
          Review an essay
        </button>
        <button
          type="button"
          onClick={send}
          disabled={!text || busy}
          aria-label="Send message"
          className="flex justify-center items-center bg-primary-600 hover:bg-primary-800 disabled:opacity-50 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 size-11 md:size-10 text-white transition-colors disabled:pointer-events-none"
        >
          <ArrowUp size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
      <div className="flex justify-between items-start gap-3">
        <p className="text-caption text-neutral-600">
          AI guidance can be wrong and doesn&apos;t guarantee outcomes. Verify important details on the official page.
        </p>
        {draft.length > SHOW_COUNT_FROM && (
          <p className="text-caption text-neutral-600 whitespace-nowrap">{draft.length.toLocaleString("en-US")} characters</p>
        )}
      </div>
    </div>
  );
}
