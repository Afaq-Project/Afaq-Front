import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

import { cn } from "@/src/feature/dashboard/services/utils";
import type { ChatMessage } from "../types/chat";

export function ChatThread({
  messages,
  isReplying,
  onSuggestionClick,
}: {
  messages: ChatMessage[];
  isReplying: boolean;
  onSuggestionClick: (text: string) => void;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isReplying]);

  return (
    <div className="flex flex-col gap-3 px-4 py-4 h-96 md:h-auto md:flex-1 md:min-h-0 overflow-y-auto scrollbar-minimal">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex flex-col gap-1",
            message.role === "user" ? "items-end" : "items-start",
          )}
        >
          <div
            className={cn(
              "max-w-[80%] rounded-lg px-4 py-2.5 text-small",
              message.role === "assistant"
                ? "bg-neutral-100 text-neutral-800"
                : "bg-primary-600 text-white",
            )}
          >
            {message.text}
          </div>
          <span className="px-1 text-neutral-400 text-caption">
            {message.role === "assistant" ? "AI Assistant" : "You"} •{" "}
            {message.timestamp}
          </span>

          {message.suggestions && message.suggestions.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-1">
              {message.suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onSuggestionClick(suggestion)}
                  className="bg-white hover:bg-primary-50 px-3 py-1.5 border border-neutral-200 hover:border-primary-200 rounded-full text-neutral-700 hover:text-primary-800 text-caption transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {isReplying && (
        <div className="flex items-center gap-1.5 self-start bg-neutral-100 px-3 py-2 rounded-lg text-neutral-500">
          <Loader2 size={14} strokeWidth={2} className="animate-spin" />
          <span className="text-caption">Thinking...</span>
        </div>
      )}

      <div ref={endRef} />
    </div>
  );
}
