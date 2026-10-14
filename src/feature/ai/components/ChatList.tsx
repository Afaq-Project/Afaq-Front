"use client";

import { useState, type ReactNode } from "react";
import { FileText, Plus, Search, Sparkles } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { FlagTile } from "@/src/feature/opportunities/components/FlagTile";
import { countryName } from "@/src/shared/lib/countries";
import { relativeDay } from "@/src/shared/lib/deadline";
import { contextFor, type ChatContext } from "../services/context";
import type { Conversation } from "../types/chat";

const SEARCH_THRESHOLD = 8;

export function ContextTile({ context }: { context: ChatContext }) {
  if (context.kind === "general" || context.kind === "document") {
    const Icon = context.kind === "document" ? FileText : Sparkles;
    return (
      <span aria-hidden="true" className="flex justify-center items-center bg-primary-50 rounded-[6px] w-10 h-7.5 text-primary-800 shrink-0">
        <Icon size={16} strokeWidth={1.75} />
      </span>
    );
  }
  return (
    <FlagTile
      countryCode={context.countryCode}
      countryName={context.countryCode ? countryName(context.countryCode) : undefined}
      remote={Boolean(context.isRemote) || !context.countryCode}
    />
  );
}

/**
 * "Your chats": a new-chat button, a search field once there are more than 8 chats, and the
 * chats grouped by what they're about (opportunity or application, then general guidance).
 * `footer` (the usage card) sits at the bottom.
 */
export function ChatList({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  now,
  footer,
  afterChats,
  documentName,
}: {
  conversations: Conversation[];
  activeId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  now: Date;
  footer: ReactNode;
  /** Shown below the chats, in the same scroll area (e.g. "Your reviews"). */
  afterChats?: ReactNode;
  /** Names essay documents that chats are about. */
  documentName?: (id: string) => string | undefined;
}) {
  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const groups = new Map<string, { context: ChatContext; chats: Conversation[] }>();
  for (const conversation of conversations) {
    const context = contextFor(conversation, documentName);
    if (query && !conversation.title.toLowerCase().includes(query) && !context.title.toLowerCase().includes(query)) continue;
    const group = groups.get(context.key) ?? { context, chats: [] };
    group.chats.push(conversation);
    groups.set(context.key, group);
  }
  // Opportunity/application groups first (in chat order), general guidance last.
  const ordered = [...groups.values()].sort((a, b) => Number(a.context.kind === "general") - Number(b.context.kind === "general"));

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex justify-between items-center gap-3 px-4 pt-4 pb-3">
        <h2 className="text-h3 text-neutral-900">Your chats</h2>
        <button
          type="button"
          onClick={onNewChat}
          aria-label="New chat"
          className="flex justify-center items-center bg-primary-600 hover:bg-primary-800 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 size-11 md:size-10 text-white transition-colors"
        >
          <Plus size={18} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      {conversations.length > SEARCH_THRESHOLD && (
        <label className="flex items-center gap-2 bg-white mx-4 mb-3 px-3 border border-neutral-200 focus-within:border-primary-600 rounded-sm focus-within:ring-2 focus-within:ring-primary-400 h-10">
          <Search size={16} strokeWidth={1.75} aria-hidden="true" className="text-neutral-600 shrink-0" />
          <span className="sr-only">Search chats</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search chats"
            className="flex-1 bg-transparent min-w-0 text-neutral-900 text-small placeholder:text-neutral-400 focus:outline-none"
          />
        </label>
      )}

      <div className="flex-1 px-2 pb-4 min-h-0 overflow-y-auto">
        <nav aria-label="Chats">
          {ordered.length === 0 ? (
            <p className="px-2 py-3 text-neutral-600 text-small">No chats match.</p>
          ) : (
            ordered.map(({ context, chats }) => (
              <div key={context.key} className="mb-3">
                <div className="flex items-center gap-2.5 px-2 py-2">
                  <ContextTile context={context} />
                  <p className="font-medium text-neutral-900 text-small truncate">{context.title}</p>
                </div>
                <ul className="flex flex-col gap-0.5">
                  {chats.map((chat) => {
                    const active = chat.id === activeId;
                    return (
                      <li key={chat.id}>
                        <button
                          type="button"
                          aria-current={active ? "true" : undefined}
                          onClick={() => onSelect(chat.id)}
                          className={cn(
                            "flex flex-col items-start px-3 py-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 w-full min-h-11 text-left transition-colors",
                            active ? "bg-primary-50" : "hover:bg-neutral-50",
                          )}
                        >
                          <span className={cn("max-w-full text-small truncate", active ? "font-medium text-primary-800" : "text-neutral-800")}>
                            {chat.title}
                          </span>
                          <span className="text-caption text-neutral-600">
                            {chat.updatedAt ? relativeDay(chat.updatedAt, now) : chat.timeLabel}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </nav>
        {afterChats}
      </div>

      <div className="p-4 border-neutral-100 border-t">{footer}</div>
    </div>
  );
}
