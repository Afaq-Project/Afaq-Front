"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Returns the ID of the section currently in view: the first of `ids` (in order) that
 * intersects a band near the top of the viewport. Works inside nested scroll containers,
 * since intersection is measured against the viewport. Once the page is scrolled to the
 * bottom, the last section wins (short final sections never reach the band).
 *
 * The setter pins an item, e.g. after a nav click: it stays active until the smooth scroll
 * it started has settled, instead of flickering through the sections in between.
 */
export function useScrollSpy(ids: string[], rootMargin = "-15% 0px -70% 0px") {
  const [activeId, setActiveIdState] = useState(ids[0]);
  const pinned = useRef(false);
  const key = ids.join("|");

  useEffect(() => {
    const sectionIds = key.split("|");
    const visible = new Set<string>();
    const atBottom = () =>
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    const update = () => {
      if (pinned.current) return;
      if (atBottom()) {
        setActiveIdState(sectionIds[sectionIds.length - 1]);
        return;
      }
      const first = sectionIds.find((id) => visible.has(id));
      if (first) setActiveIdState(first);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        update();
      },
      { rootMargin },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, [key, rootMargin]);

  const setActiveId = useCallback((id: string) => {
    setActiveIdState(id);
    pinned.current = true;
    let timer = 0;
    const release = () => {
      window.clearTimeout(timer);
      window.removeEventListener("scrollend", release);
      pinned.current = false;
    };
    window.addEventListener("scrollend", release, { once: true });
    // Fallback where scrollend isn't supported, or nothing needed to scroll.
    timer = window.setTimeout(release, 1000);
  }, []);

  return [activeId, setActiveId] as const;
}
