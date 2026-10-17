"use client";

import { useEffect, useRef, type MouseEvent, type RefObject } from "react";
import { X } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { APP_LOGIN_URL, APP_SIGNUP_URL, MENU_PANEL_ID } from "../../constants";
import { content } from "../../content/en";
import { Button } from "../ui/Button";
import { Logo } from "./Logo";

const TITLE_ID = `${MENU_PANEL_ID}-title`;
const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-primary-400 focus-visible:-outline-offset-2";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  activeId: string | null;
  /** Gets focus back when the menu closes. */
  menuButtonRef: RefObject<HTMLButtonElement | null>;
}

/** Locks page scroll, padding for the removed scrollbar so the page doesn't shift. Returns the undo. */
function lockScroll() {
  const html = document.documentElement;
  const scrollbar = window.innerWidth - html.clientWidth;
  const previous = { overflow: html.style.overflow, padding: document.body.style.paddingInlineEnd };
  html.style.overflow = "hidden";
  if (scrollbar > 0) document.body.style.paddingInlineEnd = `${scrollbar}px`;
  return () => {
    html.style.overflow = previous.overflow;
    document.body.style.paddingInlineEnd = previous.padding;
  };
}

/**
 * Below 1024px: a full-height panel that slides in from the inline-end side over a 40% overlay.
 * A modal dialog: focus moves to the first link and stays inside, Escape or the overlay closes
 * it, page scroll is locked, and focus returns to the menu button. Choosing a link closes the
 * menu first, then scrolls to the section.
 */
export function MobileMenu({ open, onClose, activeId, menuButtonRef }: MobileMenuProps) {
  const { nav } = content;
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  /** Section to scroll to once the menu has closed and scrolling is unlocked. */
  const pendingHash = useRef<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const unlockScroll = lockScroll();
    firstLinkRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const inside = panelRef.current.contains(document.activeElement);
      if (event.shiftKey && (document.activeElement === first || !inside)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !inside)) {
        event.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);

    const menuButton = menuButtonRef.current;
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      unlockScroll();
      menuButton?.focus({ preventScroll: true });

      const hash = pendingHash.current;
      pendingHash.current = null;
      if (hash) {
        // scrollIntoView follows the CSS scroll-behavior (smooth unless reduced motion) and scroll-margin-top.
        document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
        window.history.pushState(null, "", hash);
      }
    };
  }, [open, onClose, menuButtonRef]);

  function navigate(event: MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    pendingHash.current = event.currentTarget.getAttribute("href");
    onClose();
  }

  return (
    <div className="lg:hidden">
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "z-50 fixed inset-0 bg-neutral-900/40 duration-200 motion-reduce:transition-none",
          open ? "visible opacity-100 transition-opacity" : "invisible opacity-0 transition-[opacity,visibility]",
        )}
      />

      <div
        ref={panelRef}
        id={MENU_PANEL_ID}
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        inert={!open}
        className={cn(
          "z-50 fixed inset-y-0 end-0 flex flex-col bg-white w-[min(360px,100vw)]",
          // Visibility only transitions on close (hidden at the end). On open it must flip at once,
          // or the first link can't take focus while the transition starts.
          "duration-200 ease-out motion-reduce:transition-none",
          open ? "visible translate-x-0 transition-[translate]" : "invisible translate-x-full rtl:-translate-x-full transition-[translate,visibility]",
        )}
      >
        <h2 id={TITLE_ID} className="sr-only">
          {nav.menu.title}
        </h2>

        <div className="flex justify-between items-center gap-4 ps-4 pe-2 border-neutral-100 border-b h-14 shrink-0">
          <Logo onClick={navigate} />
          <button
            type="button"
            aria-label={nav.menu.close}
            onClick={onClose}
            className={cn("inline-flex justify-center items-center rounded-md size-11 text-neutral-900 hover:bg-neutral-900/5", FOCUS_RING)}
          >
            <X size={22} strokeWidth={1.75} aria-hidden="true" />
          </button>
        </div>

        <div className="flex-1 px-4 py-2 overflow-y-auto">
          <nav aria-label={nav.label}>
            <ul className="divide-y divide-neutral-100">
              {nav.links.map((link, index) => {
                const active = activeId === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      aria-current={active ? "true" : undefined}
                      onClick={navigate}
                      className={cn(
                        "flex justify-between items-center gap-3 px-1 rounded-sm min-h-13 font-medium text-landing-body-lg",
                        FOCUS_RING,
                        active ? "text-primary-800" : "text-neutral-900",
                      )}
                    >
                      {link.label}
                      {active && <span aria-hidden="true" className="bg-primary-600 rounded-full size-2 shrink-0" />}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col gap-3 px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] border-neutral-100 border-t shrink-0">
          <Button href={APP_SIGNUP_URL} variant="primary" className="w-full">
            {nav.signUp}
          </Button>
          <Button href={APP_LOGIN_URL} variant="secondary" className="w-full">
            {nav.logIn}
          </Button>
        </div>
      </div>
    </div>
  );
}
