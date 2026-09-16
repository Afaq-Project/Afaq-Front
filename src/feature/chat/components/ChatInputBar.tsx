"use client";

import { FormEvent, useState } from "react";
import { Paperclip, SendHorizontal } from "lucide-react";

interface ChatInputBarProps {
  onSend?: (message: string) => void;
}

export function ChatInputBar({ onSend }: ChatInputBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setValue("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t border-stone-200 bg-white px-4 py-3"
    >
      <button
        type="button"
        aria-label="Attach file"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600"
      >
        <Paperclip size={18} />
      </button>

      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Ask a question about this scholarship..."
        className="flex-1 rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 focus:border-stone-400 focus:bg-white focus:outline-none"
      />

      <button
        type="submit"
        aria-label="Send message"
        disabled={!value.trim()}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-stone-900 text-white transition-colors hover:bg-stone-800 disabled:bg-stone-300"
      >
        <SendHorizontal size={16} />
      </button>
    </form>
  );
}
