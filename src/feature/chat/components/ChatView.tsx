"use client";

import { useState } from "react";
import { ChatBubble } from "@/feature/chat/components/ChatBubble";
import { ChatContextBanner } from "@/feature/chat/components/ChatContextBanner";
import { ChatInputBar } from "@/feature/chat/components/ChatInputBar";
import { EligibilityAlertCard } from "@/feature/chat/components/EligibilityAlertCard";
import { ChatMessage } from "@/feature/chat/types/chat.types";
import {
  mockChatContext,
  mockChatMessages,
  mockEligibilityAlert,
} from "@/feature/chat/data/mockChat";

export function ChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockChatMessages);

  function handleSend(text: string) {
    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      role: "user",
      text,
    };
    setMessages((prev) => [...prev, newMessage]);
  }

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col rounded-2xl border border-stone-200 bg-white shadow-sm">
      <ChatContextBanner context={mockChatContext} />

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}

        <EligibilityAlertCard alert={mockEligibilityAlert} />
      </div>

      <ChatInputBar onSend={handleSend} />
    </div>
  );
}
