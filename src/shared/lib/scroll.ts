import type { MouseEvent } from "react";

/**
 * Smooth-scrolls to an in-page anchor ("#education") instead of jumping, and keeps the URL
 * hash in sync. Falls back to the browser's default when the target isn't on the page.
 */
export function smoothScrollToHash(event: MouseEvent, href: string) {
  if (!href.startsWith("#")) return;
  const target = document.getElementById(href.slice(1));
  if (!target) return;
  event.preventDefault();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  window.history.replaceState(null, "", href);
}
