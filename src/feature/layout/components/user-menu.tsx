"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import Link from "next/link";
import { ChevronDown, Loader2, LogOut, User } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { useCurrentUserName } from "@/src/feature/profile/hooks/useCurrentUserName";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { useClickOutside } from "@/src/shared/hooks/useClickOutside";
import { MENU_ITEMS, type ShellVariant } from "./shell-config";

const ITEM_CLASS =
  "flex items-center gap-3 px-4 w-full h-11 md:h-10 text-neutral-800 text-small text-left hover:bg-neutral-50 focus:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-400 transition-colors";

/** Avatar button with the account menu (menu-button pattern: arrow keys, Home/End, Escape). */
export function UserMenu({ variant }: { variant: ShellVariant }) {
  const { logout } = useAuth();
  const { name, initials, email } = useCurrentUserName();
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const focusOnOpen = useRef<"first" | "last">("first");
  const menuId = useId();

  useClickOutside(containerRef, () => setOpen(false));

  // Items hidden at this breakpoint (mobile-only ones) have no offsetParent and are skipped.
  const getItems = () =>
    Array.from(menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? []).filter(
      (item) => item.offsetParent !== null,
    );

  useEffect(() => {
    if (!open) return;
    const items = getItems();
    items[focusOnOpen.current === "first" ? 0 : items.length - 1]?.focus();
  }, [open]);

  const openMenu = (focus: "first" | "last") => {
    focusOnOpen.current = focus;
    setOpen(true);
  };

  const closeMenu = (returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu(event.key === "ArrowDown" ? "first" : "last");
    }
  };

  const handleMenuKeyDown = (event: KeyboardEvent) => {
    const items = getItems();
    const index = items.indexOf(document.activeElement as HTMLElement);
    const focusAt = (next: number) => items[(next + items.length) % items.length]?.focus();

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusAt(index + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusAt(index - 1);
        break;
      case "Home":
        event.preventDefault();
        focusAt(0);
        break;
      case "End":
        event.preventDefault();
        focusAt(items.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        closeMenu(true);
        break;
      case "Tab":
        closeMenu(false);
        break;
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? closeMenu(false) : openMenu("first"))}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={name ? `Account menu, ${name}` : "Account menu"}
        className="after:absolute relative flex items-center gap-1 hover:bg-neutral-50 py-1 pr-1.5 pl-1 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 h-10 transition-colors after:-inset-0.5 after:content-['']"
      >
        <span
          aria-hidden="true"
          className="flex justify-center items-center bg-primary-50 rounded-full size-8 text-caption text-primary-800"
        >
          {initials || <User size={16} strokeWidth={1.75} />}
        </span>
        <ChevronDown
          size={16}
          strokeWidth={1.75}
          aria-hidden="true"
          className={cn("text-neutral-600 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="top-full right-0 z-50 absolute bg-white shadow-sm mt-2 border border-neutral-100 rounded-lg w-60 overflow-hidden">
          <div className="px-4 py-3 border-neutral-100 border-b">
            <p className="font-medium text-neutral-900 text-small truncate">{name || "Your account"}</p>
            {email && <p className="text-caption text-neutral-600 truncate">{email}</p>}
          </div>

          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            aria-label="Account"
            onKeyDown={handleMenuKeyDown}
            className="py-1"
          >
            {MENU_ITEMS[variant].map(({ href, label, icon: Icon, mobileOnly }) => (
              <Link
                key={href}
                href={href}
                role="menuitem"
                tabIndex={-1}
                onClick={() => closeMenu(false)}
                className={cn(ITEM_CLASS, mobileOnly && "md:hidden")}
              >
                <Icon size={16} strokeWidth={1.75} aria-hidden="true" className="text-neutral-600" />
                {label}
              </Link>
            ))}

            {MENU_ITEMS[variant].length > 0 && (
              <div
                role="separator"
                className={cn(
                  "my-1 border-neutral-100 border-t",
                  MENU_ITEMS[variant].every((item) => item.mobileOnly) && "md:hidden",
                )}
              />
            )}

            <button
              type="button"
              role="menuitem"
              tabIndex={-1}
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={cn(ITEM_CLASS, "disabled:opacity-50")}
            >
              {isLoggingOut ? (
                <Loader2 size={16} strokeWidth={1.75} aria-hidden="true" className="text-neutral-600 animate-spin" />
              ) : (
                <LogOut size={16} strokeWidth={1.75} aria-hidden="true" className="text-neutral-600" />
              )}
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
