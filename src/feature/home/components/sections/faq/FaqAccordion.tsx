"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/src/feature/dashboard/services/utils";

interface FaqItem {
  question: string;
  answer: string;
}

/**
 * FAQ list, divided by 1px rules, no cards. Each question is a button (aria-expanded,
 * aria-controls; Enter and Space toggle natively) and each answer a region labelled by its
 * question. Any number can be open. Opening animates the height over 200ms by transitioning the
 * grid row from 0fr to 1fr (no measuring); none with reduced motion. Closed answers are inert, so
 * they are skipped by keyboard and screen readers.
 */
export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(() => new Set());

  function toggle(index: number) {
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <ul className="border-neutral-100 border-y divide-y divide-neutral-100">
      {items.map((item, index) => {
        const expanded = open.has(index);
        const buttonId = `${baseId}-q${index}`;
        const panelId = `${baseId}-a${index}`;
        return (
          <li key={item.question}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className={cn(
                  "flex justify-between items-center gap-4 py-5 w-full font-medium text-landing-body-lg text-neutral-900 text-start",
                  "focus-visible:outline-2 focus-visible:outline-primary-400 focus-visible:-outline-offset-2 rounded-sm",
                )}
              >
                {item.question}
                <ChevronDown
                  size={20}
                  strokeWidth={1.75}
                  aria-hidden="true"
                  className={cn("text-neutral-600 transition-transform duration-200 motion-reduce:transition-none shrink-0", expanded && "rotate-180")}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!expanded}
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p className="pb-5 max-w-[65ch] text-landing-body text-neutral-600">{item.answer}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
