"use client";

import { smoothScrollToHash } from "../lib/scroll";

interface NextStepPromptProps {
  /** The top missing item, e.g. "Add your institution". */
  title: string;
  /** Impact or "Go to field". */
  linkLabel: string;
  /** In-page anchor of the field, e.g. "#education". */
  href: string;
}

/** The single next action: an H3-weight line and a green link that smooth-scrolls to the field. */
export function NextStepPrompt({ title, linkLabel, href }: NextStepPromptProps) {
  return (
    <div className="min-w-0">
      <p className="text-h3 text-neutral-900">{title}</p>
      <a
        href={href}
        onClick={(e) => smoothScrollToHash(e, href)}
        className="inline-flex min-h-11 items-center rounded-sm text-small text-primary-600 hover:text-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 md:min-h-0"
      >
        {linkLabel}
      </a>
    </div>
  );
}
