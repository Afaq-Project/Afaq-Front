import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ChatContext } from "../services/context";

// Starting points by context: ai.empty.<key>. "reviewEssay" opens the review dialog instead of sending.
type Suggestion = "eligibleAny" | "eligibleFor" | "startStatement" | "reviewEssay" | "prepare" | "firstSuggestion" | "biggestFix" | "explainWeaknesses" | "standOut";

function suggestionsFor(context: ChatContext): Suggestion[] {
  if (context.kind === "general") return ["eligibleAny", "startStatement", "reviewEssay", "prepare"];
  if (context.kind === "document") return ["firstSuggestion", "biggestFix", "explainWeaknesses", "standOut"];
  return ["eligibleFor", "startStatement", "reviewEssay", "prepare"];
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
  const t = useTranslations("ai.empty");
  return (
    <div className="flex flex-col justify-center items-center gap-5 mx-auto px-4 py-8 w-full max-w-2xl h-full text-center">
      <span aria-hidden="true" className="flex justify-center items-center bg-primary-50 rounded-lg size-12 text-primary-800">
        <Sparkles size={22} strokeWidth={1.75} />
      </span>
      <h2 className="text-h2 text-neutral-900">{t("title")}</h2>
      <ul className="gap-3 grid grid-cols-1 sm:grid-cols-2 w-full">
        {suggestionsFor(context).map((suggestion) => {
          const text = t(suggestion, { title: context.title });
          return (
            <li key={suggestion} className="flex">
              <button
                type="button"
                onClick={() => (suggestion === "reviewEssay" ? onReviewEssay() : onSuggestion(text))}
                className="bg-primary-50 hover:bg-primary-100 px-4 py-3 border border-primary-200 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 w-full min-h-14 font-medium text-primary-800 text-small text-start transition-colors"
              >
                {text}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
