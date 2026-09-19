"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { MoreVertical, Sparkles } from "lucide-react";

import { useClickOutside } from "@/src/shared/hooks/useClickOutside";
import { cn } from "@/src/feature/dashboard/services/utils";

export function DocumentActionsMenu({
  documentId,
  documentName,
  className,
}: {
  documentId: string;
  documentName: string;
  className?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        aria-label={`More options for ${documentName}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className={cn(
          "flex justify-center items-center hover:bg-neutral-100 rounded-md w-9 h-9 text-neutral-500 hover:text-neutral-900 transition-colors",
          className,
        )}
      >
        <MoreVertical size={16} strokeWidth={1.75} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="top-full right-0 z-20 absolute bg-white shadow-card mt-1 p-1.5 border border-neutral-100 rounded-lg w-48 overflow-hidden"
        >
          <Link
            href={`/documents/${documentId}`}
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 hover:bg-primary-50 px-3 py-2 rounded-md text-neutral-700 hover:text-primary-800 text-small transition-colors"
          >
            <Sparkles size={15} strokeWidth={1.75} />
            Review with AI
          </Link>
        </div>
      )}
    </div>
  );
}
