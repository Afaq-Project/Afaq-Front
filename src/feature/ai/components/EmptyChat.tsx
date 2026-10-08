import { Sparkles } from "lucide-react";
import type { ChatContext } from "../services/context";

const GENERAL_SUGGESTIONS = [
  "Am I eligible for a scholarship I found?",
  "Help me start my personal statement",
  "Review my essay",
  "What should I prepare before applying?",
];

function suggestionsFor(context: ChatContext) {
  if (context.kind === "general") return GENERAL_SUGGESTIONS;
  return [
    `Am I eligible for ${context.title}?`,
    "Help me start my personal statement",
    "Review my essay",
    "What should I prepare before applying?",
  ];
}

/** A new chat: a short welcome and four starting points, tailored to the chat's opportunity. */
export function EmptyChat({
  context,
  onSuggestion,
  onReviewEssay,
}: {
  context: ChatContext;
  onSuggestion: (text: string) => void;
  onReviewEssay: () => void;
}) {
  return (
    <div className="flex flex-col justify-center items-center gap-5 mx-auto px-4 py-8 w-full max-w-2xl h-full text-center">
      <span aria-hidden="true" className="flex justify-center items-center bg-primary-50 rounded-lg size-12 text-primary-800">
        <Sparkles size={22} strokeWidth={1.75} />
      </span>
      <h2 className="text-h2 text-neutral-900">How can I help with your applications?</h2>
      <ul className="gap-3 grid grid-cols-1 sm:grid-cols-2 w-full">
        {suggestionsFor(context).map((suggestion) => (
          <li key={suggestion} className="flex">
            <button
              type="button"
              onClick={() => (suggestion === "Review my essay" ? onReviewEssay() : onSuggestion(suggestion))}
              className="bg-primary-50 hover:bg-primary-100 px-4 py-3 border border-primary-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 w-full min-h-14 font-medium text-primary-800 text-small text-left transition-colors"
            >
              {suggestion}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
