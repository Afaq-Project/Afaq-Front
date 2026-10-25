"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";
import { APP_LOGIN_URL, APP_SIGNUP_URL, MENU_PANEL_ID } from "../../constants";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useScrolledPast } from "../../hooks/useScrolledPast";
import { LanguageToggle } from "@/src/shared/ui/LanguageToggle";
import { useLandingContent } from "../../content";
import { Logo } from "../nav/Logo";
import { MobileMenu } from "../nav/MobileMenu";
import { Button } from "../ui/Button";
import { Container } from "./Container";

const FOCUS_RING = "focus-visible:outline-2 focus-visible:outline-primary-400 focus-visible:outline-offset-2";

/**
 * Sticky header (id "top"), 56px below 1024px and 64px from 1024px (--landing-header-height).
 * Overlaps the hero (negative bottom margin; the hero pads for it) and is transparent at the
 * top of the page, white with a bottom border once scrolled. Desktop shows
 * the logo, the centered section links (the one in view is underlined), then Log in and Sign up;
 * smaller screens show Sign up and a menu button that opens MobileMenu.
 */
export function LandingHeader() {
  const content = useLandingContent();
  const { nav } = content;
  const scrolled = useScrolledPast(8);
  const activeId = useActiveSection(nav.links.map((link) => link.href.slice(1)));
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // The menu only exists below 1024px; close it if the window grows past that.
  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const onChange = () => desktop.matches && setMenuOpen(false);
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header
        id="top"
        className={cn(
          "top-0 z-40 sticky h-(--landing-header-height) mb-[calc(var(--landing-header-height)*-1)] border-b transition-colors duration-150 motion-reduce:transition-none",
          scrolled ? "bg-white border-neutral-100" : "bg-transparent border-transparent",
        )}
      >
        {/* From 1024px a 1fr / auto / 1fr grid keeps the links centered in the header whatever the widths of the logo and actions. */}
        <Container className="flex lg:grid lg:grid-cols-[1fr_auto_1fr] items-center gap-8 h-full">
          <Logo className="lg:justify-self-start" />

          <nav aria-label={nav.label} className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {nav.links.map((link) => {
                const active = activeId === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={active ? "true" : undefined}
                      className={cn(
                        "inline-flex items-center rounded-sm h-11 font-medium text-landing-small whitespace-nowrap transition-colors",
                        FOCUS_RING,
                        active
                          ? "text-neutral-900 underline decoration-2 decoration-primary-600 underline-offset-[6px]"
                          : "text-neutral-600 hover:text-neutral-900",
                      )}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center lg:justify-self-end gap-2 ms-auto">
            {/* Globe only on phones; the language name stays its accessible label. */}
            <LanguageToggle className="text-landing-small" labelClassName="max-sm:sr-only" />
            <Button href={APP_LOGIN_URL} variant="secondary" size="sm" className="hidden lg:inline-flex">
              {nav.logIn}
            </Button>
            {/* The ::after strip stretches the 36px button to a 44px tap target. */}
            <Button href={APP_SIGNUP_URL} variant="primary" size="sm" className="relative after:absolute after:inset-x-0 after:-inset-y-1">
              {nav.signUp}
            </Button>
            <button
              ref={menuButtonRef}
              type="button"
              aria-label={menuOpen ? nav.menu.close : nav.menu.open}
              aria-expanded={menuOpen}
              aria-controls={MENU_PANEL_ID}
              onClick={() => setMenuOpen((open) => !open)}
              className={cn("lg:hidden inline-flex justify-center items-center -me-2 rounded-md size-11 text-neutral-900 hover:bg-neutral-900/5", FOCUS_RING)}
            >
              {menuOpen ? <X size={22} strokeWidth={1.75} aria-hidden="true" /> : <Menu size={22} strokeWidth={1.75} aria-hidden="true" />}
            </button>
          </div>
        </Container>
      </header>

      <MobileMenu open={menuOpen} onClose={closeMenu} activeId={activeId} menuButtonRef={menuButtonRef} />
    </>
  );
}
