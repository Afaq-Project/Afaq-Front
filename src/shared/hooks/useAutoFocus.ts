"use client";

import { useEffect } from "react";

const FOCUSABLE = "input, select, textarea, button, [tabindex]";

/**
 * Focuses the element with this ID once mounted (or its first focusable child), e.g. the
 * field an "Add …" button asked to fill in.
 */
export function useAutoFocus(id?: string) {
  useEffect(() => {
    if (!id) return;
    const element = document.getElementById(id);
    if (!element) return;
    const target = element.matches(FOCUSABLE) ? element : element.querySelector<HTMLElement>(FOCUSABLE);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [id]);
}
