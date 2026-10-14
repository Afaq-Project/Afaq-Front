import { CircleAlert } from "lucide-react";
import { buttonClasses } from "./Button";
import { STATE_CARD_CLASS } from "./EmptyState";

interface ErrorStateProps {
  /** What failed, plainly: "We couldn't load your documents". */
  title: string;
  /** What to do about it. */
  message?: string;
  /** Retries the failed request; the button is left out without it. */
  onRetry?: () => void;
  retryLabel?: string;
  /** The title's heading level, so a page without other headings can use h1. */
  titleAs?: "h1" | "h2";
}

/** A centered card for content that failed to load, with "Try again". */
export function ErrorState({
  title,
  message = "Check your connection and try again.",
  onRetry,
  retryLabel = "Try again",
  titleAs: Title = "h2",
}: ErrorStateProps) {
  return (
    <div role="alert" className={STATE_CARD_CLASS}>
      <span aria-hidden="true" className="flex justify-center items-center bg-danger-50 mb-2 rounded-md size-12 text-danger-800">
        <CircleAlert size={22} strokeWidth={1.75} />
      </span>
      <Title className="text-h2 text-neutral-900">{title}</Title>
      <p className="max-w-md text-body text-neutral-600">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className={buttonClasses("secondary", "mt-3")}>
          {retryLabel}
        </button>
      )}
    </div>
  );
}
