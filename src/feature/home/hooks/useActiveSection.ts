"use client";

import { useEffect, useState } from "react";
import { SECTION_SLOTS } from "../constants";

const SLOT_IDS = SECTION_SLOTS.map((slot) => slot.id);

/**
 * The nav section currently in view, or null. Watches every landing section through a band
 * just below the header (top 40% of the viewport); the first section in that band wins. If
 * that section has no nav link (hero, trust row, ...), nothing is active.
 */
export function useActiveSection(navIds: string[]) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const key = navIds.join("|");

  useEffect(() => {
    const linked = new Set(key.split("|"));
    const visible = new Set<string>();
    // The header (id "top") is 56px or 64px depending on the breakpoint.
    const headerHeight = document.getElementById("top")?.offsetHeight ?? 64;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        const current = SLOT_IDS.find((id) => visible.has(id));
        setActiveId(current && linked.has(current) ? current : null);
      },
      { rootMargin: `-${headerHeight + 1}px 0px -60% 0px` },
    );

    SLOT_IDS.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [key]);

  return activeId;
}
