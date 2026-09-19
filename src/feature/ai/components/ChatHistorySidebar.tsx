import { Plus } from "lucide-react";

import Card from "@/src/shared/ui/Card";
import { cn } from "@/src/feature/dashboard/services/utils";
import type { Conversation } from "../types/chat";

export function ChatHistorySidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
}: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}) {
  return (
    <Card className="flex flex-col gap-3 md:flex-1 md:min-h-0 overflow-y-auto scrollbar-minimal">
      <div className="flex justify-between items-center">
        <h2 className="text-h3">Chat History</h2>
        <button
          type="button"
          aria-label="Start a new chat"
          title="New chat"
          onClick={onNewChat}
          className="flex justify-center items-center hover:bg-neutral-100 rounded-md w-7 h-7 text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <Plus size={15} strokeWidth={1.75} />
        </button>
      </div>

      <ul className="flex flex-col gap-1">
        {conversations.map((conversation) => {
          const active = conversation.id === activeId;

          return (
            <li key={conversation.id}>
              <button
                type="button"
                onClick={() => onSelect(conversation.id)}
                className={cn(
                  "flex flex-col gap-0.5 border-l-2 py-2 pl-3 pr-2 rounded-r-md w-full text-left transition-colors",
                  active
                    ? "border-primary-600 bg-primary-50"
                    : "border-transparent hover:bg-neutral-50",
                )}
              >
                <span
                  className={cn(
                    "text-caption",
                    active
                      ? "font-medium text-primary-700"
                      : "text-neutral-400",
                  )}
                >
                  {conversation.timeLabel}
                </span>
                <span
                  className={cn(
                    "text-small truncate",
                    active
                      ? "font-medium text-primary-900"
                      : "text-neutral-700",
                  )}
                >
                  {conversation.title}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
