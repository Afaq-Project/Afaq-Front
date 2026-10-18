"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { twMerge } from "tailwind-merge";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Dialog over a dimmed page. While open, Tab stays inside it and Escape closes it; it focuses
 * the first control in the body on open and gives focus back to whatever had it on close.
 */
export default function Modal({ open, onClose, title, children, className = "" }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  // An autoFocus field takes focus before the effect below runs; its focus event still says
  // where focus came from, which is where it goes back on close.
  const triggerRef = useRef<HTMLElement | null>(null);
  // Callers often pass an inline onClose; reading it from a ref keeps the effect below from
  // re-running (and moving focus) on every render.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const trigger = active && !dialog?.contains(active) ? active : triggerRef.current;
    if (!dialog?.contains(active)) {
      (bodyRef.current?.querySelector<HTMLElement>(FOCUSABLE) ?? dialog?.querySelector<HTMLElement>(FOCUSABLE))?.focus();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onCloseRef.current();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const items = Array.from(dialog.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const outside = !dialog.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || outside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || outside)) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      triggerRef.current = null;
      trigger?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="z-50 fixed inset-0 flex justify-center items-center p-4">
      <div className="absolute inset-0 bg-neutral-900/50" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        onFocusCapture={(event) => {
          const from = event.relatedTarget;
          if (!triggerRef.current && from instanceof HTMLElement && !dialogRef.current?.contains(from)) {
            triggerRef.current = from;
          }
        }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        // twMerge lets `className` override the defaults, e.g. a wider max-w.
        className={twMerge("relative flex flex-col bg-white shadow-card rounded-lg w-full max-w-lg max-h-[90vh]", className)}
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
        <div ref={bodyRef} className="flex-1 p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
