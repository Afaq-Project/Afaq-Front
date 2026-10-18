"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/src/feature/dashboard/services/utils";

type RevealState = "static" | "hidden" | "shown";

const DISTANCE = { sm: "translate-y-2", md: "translate-y-3" };

/**
 * Fades its content in and lifts it (8px "sm" or 12px "md") the first time it scrolls into view,
 * after `delay` ms (for staggering a list). Server-rendered visible: it only hides after mount,
 * and only if the element is still below the viewport and motion is allowed, so nothing is ever
 * stuck hidden without JavaScript and content already on screen doesn't flash.
 */
export function Reveal({
  as = "div",
  delay = 0,
  distance = "sm",
  className,
  children,
}: {
  as?: "div" | "li";
  delay?: number;
  distance?: keyof typeof DISTANCE;
  className?: string;
  children: ReactNode;
}) {
  // Both possible tags, so one ref type fits either.
  const ref = useRef<HTMLDivElement & HTMLLIElement>(null);
  const [state, setState] = useState<RevealState>("static");

  useEffect(() => {
    const element = ref.current;
    if (!element || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setState("shown");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref}
      className={cn(
        state !== "static" && "transition-[opacity,translate] duration-500 ease-out",
        state === "hidden" && ["opacity-0", DISTANCE[distance]],
        className,
      )}
      style={state === "shown" && delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
