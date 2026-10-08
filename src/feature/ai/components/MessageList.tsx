"use client";

import { Fragment, useEffect, useRef } from "react";
import { AlertTriangle, Check, Copy, Sparkles } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { notify } from "@/src/shared/lib/notify";
import { buttonClasses } from "@/src/shared/ui/Button";
import type { ChatMessage, EssayReview } from "../types/chat";
import { Markdown } from "./Markdown";

const DIVIDER_GAP_MS = 30 * 60 * 1000;

function AiAvatar() {
  return (
    <span aria-hidden="true" className="flex justify-center items-center bg-primary-50 rounded-md size-7 text-primary-800 shrink-0">
      <Sparkles size={14} strokeWidth={1.75} />
    </span>
  );
}

/** "Today, 10:30", "Yesterday, 14:05", "Mar 15, 10:00". */
function dividerLabel(iso: string, now: Date) {
  const date = new Date(iso);
  const time = date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOf(now) - startOf(date)) / 86_400_000);
  if (days === 0) return `Today, ${time}`;
  if (days === 1) return `Yesterday, ${time}`;
  return `${date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}, ${time}`;
}

/** Structured essay feedback: strengths, weaknesses and suggestions, each with an icon. */
export function EssayReviewCard({ review }: { review: EssayReview }) {
  const sections = [
    { title: "Strengths", items: review.strengths, icon: <Check size={14} strokeWidth={2.5} className="text-primary-600" /> },
    { title: "Weaknesses", items: review.weaknesses, icon: <AlertTriangle size={14} strokeWidth={2} className="text-warning-600" /> },
    { title: "Suggestions", items: review.suggestions, icon: <Sparkles size={14} strokeWidth={2} className="text-primary-600" /> },
  ];

  return (
    <div className="bg-white p-4 border border-neutral-100 rounded-lg w-full max-w-[72ch]">
      <p className="font-medium text-neutral-900 text-body">Essay feedback</p>
      <p className="text-neutral-600 text-small">
        {review.essayName}
        {review.purpose && ` · for ${review.purpose}`}
      </p>
      <div className="flex flex-col gap-4 mt-4">
        {sections.map((section) => (
          <div key={section.title}>
            <p className="flex items-center gap-1.5 font-medium text-neutral-900 text-small">
              <span aria-hidden="true">{section.icon}</span>
              {section.title}
            </p>
            <ul className="flex flex-col gap-1 mt-1.5 pl-5 text-body text-neutral-800 list-disc">
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 pt-3 border-neutral-100 border-t text-caption text-neutral-600">
        AI feedback can miss context. Use it as a starting point, not a final verdict.
      </p>
    </div>
  );
}

interface MessageListProps {
  messages: ChatMessage[];
  isReplying: boolean;
  /** Set when the last reply failed; shows the error card with "Try again". */
  failed: boolean;
  onRetry: () => void;
  onSuggestion: (text: string) => void;
  now: Date;
}

/**
 * The conversation log (role="log", announces new messages politely): bubble-less assistant
 * replies with markdown, light user bubbles, timestamps on hover/focus, time dividers after
 * 30+ minute gaps, quick replies under the latest answer, and the typing / error states.
 */
export function MessageList({ messages, isReplying, failed, onRetry, onSuggestion, now }: MessageListProps) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, isReplying, failed]);

  const last = messages[messages.length - 1];
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      notify.success("Copied");
    } catch {
      // Clipboard blocked; nothing else to do.
    }
  };

  return (
    <div role="log" aria-live="polite" aria-label="Conversation" className="flex flex-col gap-5 px-4 md:px-5 py-5">
      {messages.map((message, index) => {
        const previous = messages[index - 1];
        const showDivider =
          message.at && (!previous?.at || new Date(message.at).getTime() - new Date(previous.at).getTime() > DIVIDER_GAP_MS);
        const time = <span className="sr-only">, {message.timestamp}</span>;
        const visibleTime = (
          <span
            aria-hidden="true"
            className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 text-caption text-neutral-600 transition-opacity"
          >
            {message.timestamp}
          </span>
        );

        return (
          <Fragment key={message.id}>
            {showDivider && (
              <p className="text-caption text-neutral-600 text-center">{dividerLabel(message.at!, now)}</p>
            )}
            {message.role === "user" ? (
              <div className="group flex flex-col items-end gap-1">
                <div className="bg-primary-50 px-4 py-2.5 rounded-lg rounded-br-sm max-w-[70%] text-body text-primary-900 whitespace-pre-wrap">
                  {message.text}
                  {time}
                </div>
                {visibleTime}
              </div>
            ) : (
              <div className="group flex items-start gap-3">
                <AiAvatar />
                <div className="flex flex-col gap-2 min-w-0 max-w-[72ch]">
                  {message.review ? (
                    <EssayReviewCard review={message.review} />
                  ) : (
                    <div className="text-body text-neutral-900">
                      <Markdown text={message.text} />
                      {time}
                    </div>
                  )}
                  {/* Hover actions; always shown on touch screens. TODO: thumbs up/down once feedback is collected. */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => copy(message.review ? [message.review.essayName, ...message.review.suggestions].join("\n") : message.text)}
                      aria-label="Copy message"
                      className="flex justify-center items-center hover:bg-neutral-50 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 size-11 md:size-8 text-neutral-600 hover:text-neutral-900"
                    >
                      <Copy size={14} strokeWidth={1.75} aria-hidden="true" />
                    </button>
                    {visibleTime}
                  </div>
                  {message === last && message.suggestions && message.suggestions.length > 0 && !isReplying && (
                    <div className="flex flex-wrap gap-2">
                      {message.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => onSuggestion(suggestion)}
                          className="bg-white px-3 border border-neutral-200 hover:border-neutral-400 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 min-h-11 md:min-h-8 text-neutral-800 text-small transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Fragment>
        );
      })}

      {isReplying && (
        <div className="flex items-start gap-3" aria-label="Assistant is typing">
          <AiAvatar />
          <span className="flex items-center gap-1 h-7" aria-hidden="true">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="bg-neutral-400 rounded-full size-1.5 animate-bounce motion-reduce:animate-none"
                style={{ animationDelay: `${delay}ms` }}
              />
            ))}
          </span>
        </div>
      )}

      {failed && !isReplying && (
        <div className="flex items-start gap-3">
          <AiAvatar />
          <div className="flex sm:flex-row flex-col sm:items-center gap-3 bg-neutral-50 px-4 py-3 border border-neutral-100 rounded-lg">
            <p className="text-body text-neutral-800">Something went wrong on our side. Try again in a moment.</p>
            <button type="button" onClick={onRetry} className={buttonClasses("secondary", "shrink-0 self-start sm:self-auto")}>
              Try again
            </button>
          </div>
        </div>
      )}

      <div ref={endRef} className={cn("h-px")} />
    </div>
  );
}
