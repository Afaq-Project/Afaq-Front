"use client";

import { useState } from "react";
import { Info, Sparkles } from "lucide-react";

import Card from "@/src/shared/ui/Card";
import { CONVERSATIONS, CREDIT_USAGE } from "../mocks/conversations";
import { buildAssistantReply, formatMessageTime } from "../services/utils";
import type { ChatMessage, Conversation } from "../types/chat";
import { ChatHistorySidebar } from "./ChatHistorySidebar";
import { CreditUsageCard } from "./CreditUsageCard";
import { ChatThread } from "./ChatThread";
import { ChatComposer } from "./ChatComposer";

function createConversation(): Conversation {
  const now = Date.now();

  return {
    id: `conv-${now}`,
    title: "New conversation",
    timeLabel: "Now",
    messages: [
      {
        id: `conv-${now}-m1`,
        role: "assistant",
        text: "Hi! I'm your AI assistant. Ask me about eligibility, essays, or anything else related to your applications.",
        timestamp: formatMessageTime(),
      },
    ],
  };
}

export function AiAssistantView() {
  const [conversations, setConversations] =
    useState<Conversation[]>(CONVERSATIONS);
  const [activeId, setActiveId] = useState(CONVERSATIONS[0].id);
  const [creditsUsed, setCreditsUsed] = useState(CREDIT_USAGE.used);
  const [isReplying, setIsReplying] = useState(false);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeId) ??
    conversations[0];
  const creditsExhausted = creditsUsed >= CREDIT_USAGE.limit;

  function updateActiveMessages(
    updater: (messages: ChatMessage[]) => ChatMessage[],
  ) {
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === activeId
          ? { ...conversation, messages: updater(conversation.messages) }
          : conversation,
      ),
    );
  }

  function handleSend(text: string) {
    if (creditsExhausted) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      timestamp: formatMessageTime(),
    };
    updateActiveMessages((messages) => [...messages, userMessage]);
    setCreditsUsed((used) => Math.min(CREDIT_USAGE.limit, used + 1));
    setIsReplying(true);

    setTimeout(() => {
      const reply = buildAssistantReply(text);
      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: reply.text,
        timestamp: formatMessageTime(),
        suggestions: reply.suggestions,
      };
      updateActiveMessages((messages) => [...messages, assistantMessage]);
      setIsReplying(false);
    }, 900);
  }

  function handleNewChat() {
    const conversation = createConversation();
    setConversations((prev) => [conversation, ...prev]);
    setActiveId(conversation.id);
  }

  return (
    <div className="flex flex-col gap-4 md:h-full">
      <div className="flex items-center gap-2 bg-warning-50 px-4 py-2.5 rounded-md text-warning-800 text-caption shrink-0">
        <Info size={14} strokeWidth={1.75} className="shrink-0" />
        These instructions do not guarantee a scholarship.
      </div>

      <div className="flex-1 gap-4 grid grid-cols-1 lg:grid-cols-4 md:min-h-0">
        <div className="flex flex-col gap-4 md:h-full lg:col-span-1">
          <ChatHistorySidebar
            conversations={conversations}
            activeId={activeConversation.id}
            onSelect={setActiveId}
            onNewChat={handleNewChat}
          />
          <CreditUsageCard used={creditsUsed} limit={CREDIT_USAGE.limit} />
        </div>

        <Card className="flex flex-col p-0 md:h-full overflow-hidden lg:col-span-3">
          <div className="flex items-center gap-3 p-4 border-neutral-100 border-b shrink-0">
            <span className="relative flex justify-center items-center bg-primary-600 rounded-full w-10 h-10 text-white shrink-0">
              <Sparkles size={18} strokeWidth={1.75} />
              <span className="right-0 bottom-0 absolute bg-success-600 border-2 border-white rounded-full w-3 h-3" />
            </span>
            <div>
              <h1 className="text-h3">AI Assistant</h1>
              <p className="text-success-600 text-caption">Online</p>
            </div>
          </div>

          <ChatThread
            messages={activeConversation.messages}
            isReplying={isReplying}
            onSuggestionClick={handleSend}
          />

          <ChatComposer
            onSend={handleSend}
            isReplying={isReplying}
            disabled={creditsExhausted}
          />
        </Card>
      </div>
    </div>
  );
}
