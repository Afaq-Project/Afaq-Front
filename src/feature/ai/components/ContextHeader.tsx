"use client";

import { useState } from "react";
import Link from "next/link";
import { Info, MessagesSquare, MoreHorizontal } from "lucide-react";
import { GHOST_LINK_CLASS } from "@/src/feature/dashboard/components/styles";
import { Popover } from "@/src/shared/ui/Popover";
import type { ChatContext } from "../services/context";
import { ContextTile } from "./ChatList";

/**
 * What the chat is about: flag, title and provider, with a link to the opportunity or
 * application on the right (in a ⋯ menu below 1024px, where a "Chats" button opens the list).
 */
export function ContextHeader({ context, onOpenChats }: { context: ChatContext; onOpenChats: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const general = context.kind === "general";

  return (
    <div className="flex flex-col gap-2 px-4 md:px-5 py-3 border-neutral-100 border-b">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenChats}
          aria-haspopup="dialog"
          className="lg:hidden inline-flex items-center gap-1.5 bg-white px-3 border border-neutral-200 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 h-11 font-medium text-neutral-800 text-small shrink-0"
        >
          <MessagesSquare size={16} strokeWidth={1.75} aria-hidden="true" />
          Chats
        </button>
        <ContextTile context={context} />
        <div className="flex-1 min-w-0">
          <h2 className="text-h3 text-neutral-900 truncate">{context.title}</h2>
          {context.provider && <p className="hidden sm:block text-neutral-600 text-small truncate">{context.provider}</p>}
        </div>

        {!general && (
          <>
            <div className="hidden lg:flex items-center gap-4">
              {context.href && (
                <Link href={context.href} className={GHOST_LINK_CLASS}>
                  {context.linkLabel}
                </Link>
              )}
            </div>
            <div className="lg:hidden">
              <Popover
                open={menuOpen}
                onOpenChange={setMenuOpen}
                label="Opportunity details"
                panelClassName="w-56"
                trigger={(triggerProps) => (
                  <button
                    type="button"
                    {...triggerProps}
                    aria-label="More about this chat"
                    className="flex justify-center items-center hover:bg-neutral-50 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 size-11 text-neutral-600"
                  >
                    <MoreHorizontal size={18} strokeWidth={1.75} aria-hidden="true" />
                  </button>
                )}
              >
                <div className="flex flex-col gap-3">
                  {context.href && (
                    <Link href={context.href} className={GHOST_LINK_CLASS}>
                      {context.linkLabel}
                    </Link>
                  )}
                </div>
              </Popover>
            </div>
          </>
        )}
      </div>
      <p className="flex items-center gap-1.5 text-caption text-neutral-600">
        <Info size={14} strokeWidth={1.75} aria-hidden="true" className="shrink-0" />
        {general
          ? "Answers use your profile."
          : `Answers use your profile and this ${context.kind === "application" ? "application" : "opportunity"}'s details.`}
      </p>
    </div>
  );
}
