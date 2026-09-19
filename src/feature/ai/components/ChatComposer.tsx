import { useState } from "react";
import { Paperclip, Send } from "lucide-react";

const MAX_LENGTH = 2000;

export function ChatComposer({
  onSend,
  isReplying,
  disabled,
}: {
  onSend: (text: string) => void;
  isReplying: boolean;
  disabled?: boolean;
}) {
  const [draft, setDraft] = useState("");
  const isDisabled = isReplying || disabled;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isDisabled) return;
    onSend(text);
    setDraft("");
  }

  return (
    <div className="p-4 border-neutral-100 border-t shrink-0">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Attach file"
          disabled={isDisabled}
          className="flex justify-center items-center hover:bg-neutral-100 disabled:opacity-50 rounded-md w-10 h-10 text-neutral-500 hover:text-neutral-900 transition-colors shrink-0 disabled:pointer-events-none"
        >
          <Paperclip size={18} strokeWidth={1.75} />
        </button>
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value.slice(0, MAX_LENGTH))}
          disabled={isDisabled}
          placeholder="Type your message here..."
          className="flex-1 border-neutral-200 rounded-sm focus:ring-2 focus:ring-primary-400 disabled:opacity-50 h-11 text-neutral-900 text-small focus:outline-none focus:border-transparent placeholder:text-neutral-400"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!draft.trim() || isDisabled}
          className="flex justify-center items-center bg-primary-600 hover:bg-primary-800 disabled:opacity-50 rounded-sm w-11 h-11 text-white transition-colors shrink-0 disabled:pointer-events-none"
        >
          <Send size={18} strokeWidth={1.75} />
        </button>
      </form>
      <div className="flex justify-between gap-3 mt-2 text-neutral-400 text-caption">
        <span>
          {disabled
            ? "You've reached your monthly message limit — upgrade your plan to continue."
            : "AI can make mistakes. Please verify important info."}
        </span>
        <span className="shrink-0">
          {draft.length} / {MAX_LENGTH}
        </span>
      </div>
    </div>
  );
}
