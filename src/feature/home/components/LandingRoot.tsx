import type { ReactNode } from "react";

/**
 * Wraps a public page in `.landing` (globals.css): the Inter font, the landing type scale and
 * the header height variable. lang and dir come from <html> (English, left to right).
 */
export function LandingRoot({ children }: { children: ReactNode }) {
  return <div className="landing flex flex-col flex-1 bg-white text-neutral-900">{children}</div>;
}
