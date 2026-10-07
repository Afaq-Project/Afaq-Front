import type { ReactNode } from "react";
import AuthBrand from "./AuthBrand";

interface AuthLayoutProps {
  /** Left-hand visual panel, shown at ≥1024px only. */
  visual: ReactNode;
  children: ReactNode;
}

/**
 * Auth card. The page shell (background, centering, footer) lives in src/app/(auth)/layout.tsx.
 * - <768px: no card, full-bleed form under a compact brand header.
 * - 768–1023px: form in a centered card.
 * - ≥1024px: wide card split 50/50 with the visual panel on the left.
 * The form block is centered vertically in the card, so spare height splits evenly above and below.
 * The card grows with its content, so short viewports scroll instead of squashing the form.
 */
export default function AuthLayout({ visual, children }: AuthLayoutProps) {
  return (
    <>
      <header className="md:hidden px-4 pt-6">
        <AuthBrand />
      </header>

      {/*
        Shared min height = sign-up form in its tallest state (all fields + a one-line
        error alert), measured in the browser: 788px, or 644px with the short-viewport
        spacing. Login and sign-up therefore render the same card size; longer content
        grows the card instead of clipping. Re-measure if the sign-up form changes.
      */}
      <main className="md:flex md:flex-col lg:grid lg:grid-cols-2 md:min-h-[788px] md:short:min-h-[644px] md:bg-white md:border md:border-neutral-100 md:rounded-lg w-full md:max-w-[480px] lg:max-w-[1120px]">
        {/* Absolutely positioned so the panel never adds height — the form sets the card height. */}
        <div className="hidden lg:block relative">
          <div className="absolute inset-2.5">{visual}</div>
        </div>

        <div className="flex flex-1 justify-center md:items-center px-4 md:px-10 lg:px-12 pt-6 pb-10 md:py-10 short:py-7">
          <div className="flex flex-col w-full max-w-[440px]">
            <AuthBrand className="max-md:hidden mb-8 short:mb-4" />
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
