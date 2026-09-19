"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";

import { CATEGORY_META } from "../services/utils";
import { buildAssistantReply, generateMockReview } from "../services/review";
import { REVIEW_QUOTA } from "../mocks/documentDetails";
import type { ChatMessage, DocumentDetail, DocumentVersion } from "../types/review";
import { DocumentChatCard } from "./DocumentChatCard";
import { DocumentReviewResultsCard } from "./DocumentReviewResultsCard";

export function DocumentReviewView({ document }: { document: DocumentDetail }) {
  const [versions, setVersions] = useState<DocumentVersion[]>(document.versions);
  const [review, setReview] = useState(document.review);
  const [quotaUsed, setQuotaUsed] = useState(REVIEW_QUOTA.used);
  const [isReviewing, setIsReviewing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "m0",
      role: "assistant",
      text: `Hi! Ask me anything about the feedback on ${document.name}, or ask me to apply the suggested edits.`,
    },
  ]);
  const [isReplying, setIsReplying] = useState(false);

  const meta = CATEGORY_META[document.category];
  const Icon = meta.icon;
  const quotaExhausted = quotaUsed >= REVIEW_QUOTA.limit;

  function addRevisedVersion() {
    setVersions((prev) => [
      ...prev,
      {
        id: `${document.id}-v${prev.length + 1}-${Date.now()}`,
        label: "AI-revised version",
        uploadedOn: "Just now",
        sizeBytes: prev[prev.length - 1]?.sizeBytes ?? 0,
      },
    ]);
  }

  function handleRequestReview() {
    setIsReviewing(true);
    setTimeout(() => {
      setReview(generateMockReview());
      setQuotaUsed((used) => Math.min(REVIEW_QUOTA.limit, used + 1));
      setIsReviewing(false);
    }, 1200);
  }

  function handleApplySuggestions() {
    if (!review) return;
    setIsApplying(true);
    setTimeout(() => {
      addRevisedVersion();
      setIsApplying(false);
    }, 900);
  }

  function handleUploadVersion(file: File) {
    setVersions((prev) => [
      ...prev,
      {
        id: `${document.id}-v${prev.length + 1}-${Date.now()}`,
        label: file.name,
        uploadedOn: "Just now",
        sizeBytes: file.size,
      },
    ]);
    setReview(null);
  }

  function handleSendMessage(text: string) {
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: "user", text }]);
    setIsReplying(true);

    setTimeout(() => {
      const reply = buildAssistantReply(text, review);
      setMessages((prev) => [
        ...prev,
        { id: `a-${Date.now()}`, role: "assistant", text: reply },
      ]);
      setIsReplying(false);

      if (/apply/i.test(text) && review) {
        addRevisedVersion();
      }
    }, 900);
  }

  return (
    <div className="flex flex-col gap-4 md:h-full">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-2 shrink-0">
        <Link
          href="/documents"
          className="inline-flex items-center gap-1.5 w-fit text-neutral-600 hover:text-neutral-900 text-small transition-colors"
        >
          <ArrowLeft size={16} strokeWidth={1.75} />
          Back to documents
        </Link>

        <div className="flex items-center gap-2 min-w-0 sm:ml-auto">
          <span className="inline-flex items-center gap-1.5 min-w-0 text-neutral-500 text-caption">
            <Icon size={13} strokeWidth={1.75} className="shrink-0" />
            <span className="max-w-50 truncate">{document.name}</span>
          </span>

          <span
            title="AI reviews remaining this month"
            className="inline-flex items-center gap-1.5 bg-primary-50 px-3 rounded-full w-fit h-7 font-semibold text-primary-800 text-caption whitespace-nowrap shrink-0"
          >
            <Sparkles size={12} strokeWidth={2} />
            {Math.max(0, REVIEW_QUOTA.limit - quotaUsed)} / {REVIEW_QUOTA.limit}{" "}
            reviews left
          </span>
        </div>
      </div>

      <div className="flex-1 gap-6 grid grid-cols-1 lg:grid-cols-3 md:min-h-0">
        <div className="md:h-full min-h-0 lg:col-span-2">
          <DocumentChatCard
            messages={messages}
            onSend={handleSendMessage}
            isReplying={isReplying}
            versions={versions}
            onUploadVersion={handleUploadVersion}
          />
        </div>

        <div className="md:h-full md:overflow-y-auto md:pr-0.5 scrollbar-minimal">
          <DocumentReviewResultsCard
            review={review}
            onRequestReview={handleRequestReview}
            isReviewing={isReviewing}
            onApplySuggestions={handleApplySuggestions}
            isApplying={isApplying}
            quotaExhausted={quotaExhausted}
          />
        </div>
      </div>
    </div>
  );
}
