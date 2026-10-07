"use client";

import { useEffect, useState } from "react";

/**
 * Returns the ID of the section currently in view: the first of `ids` (in order) that
 * intersects a band near the top of the viewport. Works inside nested scroll containers,
 * since intersection is measured against the viewport.
 */
export function useScrollSpy(ids: string[], rootMargin = "-15% 0px -70% 0px") {
  const [activeId, setActiveId] = useState(ids[0]);
  const key = ids.join("|");

  useEffect(() => {
    const sectionIds = key.split("|");
    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        });
        const first = sectionIds.find((id) => visible.has(id));
        if (first) setActiveId(first);
      },
      { rootMargin },
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [key, rootMargin]);

  return [activeId, setActiveId] as const;
}
