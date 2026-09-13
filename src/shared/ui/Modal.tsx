"use client";

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({ open, onClose, title, children, className = "" }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center p-4">
      <div className="absolute inset-0 bg-neutral-900/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex flex-col bg-white shadow-card rounded-lg w-full max-w-lg max-h-[90vh] ${className}`}
      >
        <div className="flex flex-shrink-0 justify-between items-center px-5 py-4 border-neutral-100 border-b">
          <h2 className="text-h3">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex justify-center items-center hover:bg-neutral-100 rounded-md w-8 h-8 text-neutral-500 transition-colors"
          >
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex-1 p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
