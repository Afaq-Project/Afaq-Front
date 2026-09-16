import { Bot, User } from "lucide-react";
import { ChatMessage } from "@/feature/chat/types/chat.types";
import { cn } from "@/shared/utils/cn";

interface ChatBubbleProps {
  message: ChatMessage;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
          isUser ? "bg-emerald-900 text-white" : "bg-stone-200 text-stone-600"
        )}
      >
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>

      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "rounded-br-sm bg-emerald-900 text-emerald-50"
            : "rounded-bl-sm bg-stone-100 text-stone-800"
        )}
      >
        {message.text}
      </div>
    </div>
  );
}
