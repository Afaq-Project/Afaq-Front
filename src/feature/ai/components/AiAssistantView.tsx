"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import { PLANS } from "@/src/feature/billing/mocks/plans";
import { useDocumentItems } from "@/src/feature/documents/hooks/useDocumentItems";
import { isReviewable, reviewNoun } from "@/src/shared/lib/document-types";
import { REVIEW_QUOTA } from "@/src/feature/documents/mocks/reviews";
import { reviewPath, startReview } from "@/src/feature/documents/services/reviewStore";
import { AiUsageCard } from "@/src/shared/ui/AiUsageCard";
import { isoDateFromToday } from "@/src/shared/lib/deadline";
import { CONVERSATIONS, CREDIT_USAGE } from "../mocks/conversations";
import { contextFor } from "../services/context";
import { buildAssistantReply, formatMessageTime } from "../services/utils";
import type { ChatMessage, Conversation } from "../types/chat";
import { ChatList } from "./ChatList";
import { Composer } from "./Composer";
import { ContextHeader } from "./ContextHeader";
import { EmptyChat } from "./EmptyChat";
import { EssayReviewDialog, type EssaySubmission } from "./EssayReviewDialog";
import { MessageList } from "./MessageList";
import { YourReviews } from "./YourReviews";

const REPLY_DELAY_MS = 900;

// TODO: the plan should come from the user's subscription; this reads the billing mock.
const IS_PREMIUM = (PLANS.find((plan) => plan.isCurrent)?.price ?? 0) > 0;

function newConversation(context: { opportunityId?: string; applicationId?: string; documentId?: string } = {}): Conversation {
  return {
    id: `conv-${Date.now()}`,
    title: "New chat",
    timeLabel: "Now",
    updatedAt: isoDateFromToday(0),
    messages: [],
    ...context,
  };
}

const nowIso = () => new Date().toISOString();

/**
 * Opens the chat for ?document= (an essay's review), ?application= or ?opportunity= (an
 * existing one about it, or a new one), and prefills ?q= into the input. Falls back to the most
 * recent chat.
 * TODO: afaq-ai needs to receive the document context (the essay and its review) with each message.
 */
function initialState(params: URLSearchParams) {
  const opportunityId = params.get("opportunity") ?? undefined;
  const applicationId = params.get("application") ?? undefined;
  const documentId = params.get("document") ?? undefined;
  let conversations = CONVERSATIONS;
  let activeId = CONVERSATIONS[0]?.id;

  if (documentId) {
    const created = newConversation({ documentId });
    conversations = [created, ...CONVERSATIONS];
    activeId = created.id;
  } else if (opportunityId || applicationId) {
    const existing = CONVERSATIONS.find((c) =>
      applicationId ? c.applicationId === applicationId : c.opportunityId === opportunityId && !c.applicationId,
    );
    if (existing) {
      activeId = existing.id;
    } else {
      const created = newConversation(applicationId ? { applicationId } : { opportunityId });
      conversations = [created, ...CONVERSATIONS];
      activeId = created.id;
    }
  }
  return { conversations, activeId, draft: params.get("q") ?? "" };
}

/**
 * The AI assistant: chats grouped by context with usage on the left (a drawer below 1024px), and
 * the conversation on the right: context header, the message log, and the input pinned at the
 * bottom. Both fill the screen below the top bar; only the message log scrolls.
 */
export function AiAssistantView() {
  const searchParams = useSearchParams();
  const [initial] = useState(() => initialState(new URLSearchParams(searchParams.toString())));
  const [now] = useState(() => new Date());

  // Chats live in local state, as before (no persistence yet).
  const [conversations, setConversations] = useState<Conversation[]>(initial.conversations);
  const [activeId, setActiveId] = useState(initial.activeId);
  const [draft, setDraft] = useState(initial.draft);
  const [creditsUsed, setCreditsUsed] = useState(CREDIT_USAGE.used);
  const { items: documents, reviews } = useDocumentItems();
  const reviewsUsed = reviews.used;
  const reviewable = documents.filter((item) => isReviewable(item.type));
  const documentName = (id: string) =>
    documents.find((item) => item.id === id)?.name ?? reviews.reviews[id]?.essayName;
  const router = useRouter();
  const [isReplying, setIsReplying] = useState(false);
  const [failedChat, setFailedChat] = useState<{ id: string; text: string } | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const reviewTrigger = useRef<HTMLElement | null>(null);
  const drawerTrigger = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];
  const context = contextFor(active, documentName);
  const limitReached = creditsUsed >= CREDIT_USAGE.limit;

  const updateChat = (id: string, update: (c: Conversation) => Conversation) =>
    setConversations((prev) => prev.map((c) => (c.id === id ? update(c) : c)));
  const append = (id: string, message: ChatMessage) =>
    updateChat(id, (c) => ({
      ...c,
      messages: [...c.messages, message],
      updatedAt: isoDateFromToday(0),
      // A new chat takes its first question as its title.
      title: c.messages.length === 0 && message.role === "user" ? message.text.slice(0, 60) : c.title,
    }));

  /** Same reply mechanics as before: the canned reply after a short delay. */
  const requestReply = (chatId: string, text: string) => {
    setIsReplying(true);
    setFailedChat(null);
    setTimeout(() => {
      try {
        const reply = buildAssistantReply(text);
        append(chatId, {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: reply.text,
          timestamp: formatMessageTime(),
          at: nowIso(),
          suggestions: reply.suggestions,
        });
      } catch (error) {
        // TODO: the mock reply can't fail; this path is for the real AI call (FR-4.7).
        console.error("AI reply failed", error);
        setFailedChat({ id: chatId, text });
      } finally {
        setIsReplying(false);
      }
    }, REPLY_DELAY_MS);
  };

  const send = (text: string) => {
    if (limitReached || isReplying) return;
    append(active.id, { id: `u-${Date.now()}`, role: "user", text, timestamp: formatMessageTime(), at: nowIso() });
    setCreditsUsed((used) => Math.min(CREDIT_USAGE.limit, used + 1));
    setDraft("");
    requestReply(active.id, text);
  };

  const startNewChat = () => {
    const created = newConversation();
    setConversations((prev) => [created, ...prev]);
    setActiveId(created.id);
    setFailedChat(null);
    closeDrawer();
  };

  const openReview = () => {
    reviewTrigger.current = document.activeElement as HTMLElement | null;
    setReviewOpen(true);
  };
  const closeReview = () => {
    setReviewOpen(false);
    reviewTrigger.current?.focus();
  };
  const submitReview = (essay: EssaySubmission) => {
    setReviewOpen(false);
    const chatId = active.id;
    append(chatId, {
      id: `u-${Date.now()}`,
      role: "user",
      text: `Review my essay: ${essay.essayName}`,
      timestamp: formatMessageTime(),
      at: nowIso(),
    });
    setIsReplying(true);
    // TODO: the review is mocked (see reviewStore) and works from the name only; send the
    // essay text once there's a real essay-review call.
    startReview({
      essayName: essay.essayName,
      documentId: essay.documentId,
      type: documents.find((item) => item.id === essay.documentId)?.type,
      purpose: essay.purpose,
      onReady: (review) => {
        // Keep the feedback in the chat too; an uploaded document then opens on its review page.
        append(chatId, {
          id: `a-${Date.now()}`,
          role: "assistant",
          text: "",
          timestamp: formatMessageTime(),
          at: nowIso(),
          review: {
            essayName: review.essayName,
            documentId: review.documentId,
            purpose: review.purpose,
            strengths: review.strengths,
            weaknesses: review.weaknesses,
            suggestions: review.suggestions,
          },
        });
        setIsReplying(false);
        if (review.documentId) router.push(reviewPath(review.documentId, "ai"));
      },
    });
  };

  const openDrawer = () => {
    drawerTrigger.current = document.activeElement as HTMLElement | null;
    setDrawerOpen(true);
  };
  const closeDrawer = () => {
    setDrawerOpen(false);
    drawerTrigger.current?.focus();
  };
  useEffect(() => {
    if (!drawerOpen) return;
    drawerRef.current?.querySelector<HTMLElement>("button")?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  });

  const usage = (
    <AiUsageCard
      premium={IS_PREMIUM}
      resetsOn={CREDIT_USAGE.resetsOn}
      rows={[
        { label: "Chat messages", used: creditsUsed, limit: CREDIT_USAGE.limit },
        { label: "Essay reviews", used: reviewsUsed, limit: REVIEW_QUOTA.limit },
      ]}
    />
  );
  const chatList = (
    <ChatList
      conversations={conversations}
      activeId={active.id}
      onSelect={(id) => {
        setActiveId(id);
        setFailedChat(null);
        closeDrawer();
      }}
      onNewChat={startNewChat}
      now={now}
      footer={usage}
      documentName={documentName}
      afterChats={
        <YourReviews
          reviews={Object.values(reviews.reviews)}
          nameFor={(review) => (review.documentId && documentName(review.documentId)) || review.essayName}
        />
      }
    />
  );

  return (
    // Fills the screen below the top bar: minus the top bar, page padding and (on phones) the tab bar.
    <div className="flex gap-6 h-[calc(100dvh-168px-env(safe-area-inset-bottom))] md:h-[calc(100dvh-108px)] lg:h-[calc(100dvh-116px)]">
      <h1 className="sr-only">AI assistant</h1>

      <aside aria-label="Chats and usage" className="hidden lg:flex flex-col bg-white border border-neutral-100 rounded-lg w-80 min-h-0 shrink-0">
        {chatList}
      </aside>

      <section aria-label="Conversation" className="flex flex-col flex-1 bg-white border border-neutral-100 rounded-lg min-w-0 min-h-0 overflow-hidden">
        <ContextHeader context={context} onOpenChats={openDrawer} />
        <div className="flex-1 min-h-0 overflow-y-auto">
          {active.messages.length === 0 && !isReplying ? (
            <EmptyChat context={context} onSuggestion={send} onReviewEssay={openReview} />
          ) : (
            <MessageList
              messages={active.messages}
              isReplying={isReplying}
              failed={failedChat?.id === active.id}
              onRetry={() => failedChat && requestReply(failedChat.id, failedChat.text)}
              onSuggestion={send}
              now={now}
            />
          )}
        </div>
        <Composer
          draft={draft}
          onDraftChange={setDraft}
          onSend={send}
          onReviewEssay={openReview}
          busy={isReplying}
          limitReached={limitReached}
          chatLimit={CREDIT_USAGE.limit}
          resetsOn={CREDIT_USAGE.resetsOn}
        />
      </section>

      {drawerOpen && (
        <div className="lg:hidden z-50 fixed inset-0">
          <div aria-hidden="true" onClick={closeDrawer} className="absolute inset-0 bg-neutral-900/40" />
          <div ref={drawerRef} role="dialog" aria-modal="true" aria-label="Your chats" className="top-0 bottom-0 left-0 absolute bg-white shadow-sm w-80 max-w-[85vw]">
            <button
              type="button"
              onClick={closeDrawer}
              aria-label="Close chats"
              className="top-3 right-14 z-10 absolute flex justify-center items-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 size-11 text-neutral-600"
            >
              <X size={18} strokeWidth={1.75} aria-hidden="true" />
            </button>
            {chatList}
          </div>
        </div>
      )}

      <EssayReviewDialog
        open={reviewOpen}
        onClose={closeReview}
        defaultPurpose={context.kind === "general" ? undefined : context.title}
        choices={reviewable.map((item) => ({
          id: item.id,
          name: item.name,
          detail: `${item.format} · ${item.size}`,
          hasReview: Boolean(reviews.reviews[item.id]),
          noun: reviewNoun(item.type),
        }))}
        used={reviewsUsed}
        limit={REVIEW_QUOTA.limit}
        unlimited={IS_PREMIUM}
        resetsOn={CREDIT_USAGE.resetsOn}
        onSubmit={submitReview}
      />
    </div>
  );
}
