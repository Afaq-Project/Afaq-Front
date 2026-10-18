/**
 * Jumps to an in-page section: scrolls it into view (smoothly unless the visitor prefers reduced
 * motion, via the CSS scroll-behavior on <html>, and clear of the sticky header via
 * scroll-margin-top), moves focus to its heading (or the section itself) so keyboard and screen
 * reader users continue from there, and updates the URL hash. Returns false if the section
 * isn't on the page, so callers can let the browser handle the link normally.
 */
export function scrollToSection(id: string) {
  const section = document.getElementById(id);
  if (!section) return false;
  section.scrollIntoView({ block: "start" });

  const focusTarget = section.querySelector<HTMLElement>("h2") ?? section;
  if (!focusTarget.hasAttribute("tabindex")) focusTarget.setAttribute("tabindex", "-1");
  focusTarget.focus({ preventScroll: true });
  window.history.pushState(null, "", `#${id}`);
  return true;
}
