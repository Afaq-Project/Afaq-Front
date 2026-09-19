import { useEffect, useRef, useState } from "react";
import { History, Loader2, Send, Sparkles, Upload } from "lucide-react";

import Card from "@/src/shared/ui/Card";
import { cn } from "@/src/feature/dashboard/services/utils";
import type { ChatMessage, DocumentVersion } from "../types/review";

export function DocumentChatCard({
  messages,
  onSend,
  isReplying,
  versions,
  onUploadVersion,
}: {
  messages: ChatMessage[];
  onSend: (text: string) => void;
  isReplying: boolean;
  versions: DocumentVersion[];
  onUploadVersion: (file: File) => void;
}) {
  const [draft, setDraft] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages, isReplying]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isReplying) return;
    onSend(text);
    setDraft("");
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) onUploadVersion(file);
    event.target.value = "";
  }

  const orderedVersions = [...versions].reverse();

  return (
    <Card className="flex flex-col gap-0 p-0 overflow-hidden md:h-full">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="flex justify-between items-center gap-2 p-4 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="flex justify-center items-center bg-primary-50 rounded-full w-8 h-8 text-primary-800 shrink-0">
            <Sparkles size={15} strokeWidth={1.75} />
          </span>
          <h2 className="text-h2">Ask AI</h2>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 font-medium text-primary-600 hover:text-primary-800 text-small transition-colors shrink-0"
        >
          <Upload size={14} strokeWidth={2} />
          Upload version
        </button>
      </div>

      <div className="flex items-center gap-2 px-4 pb-3 border-neutral-100 border-b overflow-x-auto scrollbar-minimal shrink-0">
        {orderedVersions.map((version, index) => (
          <span
            key={version.id}
            title={version.uploadedOn}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-caption whitespace-nowrap",
              index === 0
                ? "bg-primary-50 border-primary-200 text-primary-800 font-medium"
                : "bg-white border-neutral-200 text-neutral-600",
            )}
          >
            <History size={12} strokeWidth={1.75} />
            {version.label}
          </span>
        ))}
      </div>

      <div className="flex flex-col gap-2.5 px-4 py-4 h-96 md:h-auto md:flex-1 md:min-h-0 overflow-y-auto scrollbar-minimal">
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "max-w-[75%] rounded-lg px-3 py-2 text-small",
              message.role === "assistant"
                ? "self-start bg-neutral-100 text-neutral-800"
                : "self-end bg-primary-600 text-white",
            )}
          >
            {message.text}
          </div>
        ))}

        {isReplying && (
          <div className="flex items-center gap-1.5 self-start bg-neutral-100 px-3 py-2 rounded-lg text-neutral-500">
            <Loader2 size={14} strokeWidth={2} className="animate-spin" />
            <span className="text-caption">Thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 p-4 border-neutral-100 border-t shrink-0"
      >
        <input
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Ask about the feedback..."
          className="flex-1 border-neutral-200 rounded-sm focus:ring-2 focus:ring-primary-400 h-10 text-neutral-900 text-small focus:outline-none focus:border-transparent placeholder:text-neutral-400"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={!draft.trim() || isReplying}
          className="flex justify-center items-center bg-primary-600 hover:bg-primary-800 disabled:opacity-50 rounded-sm w-10 h-10 text-white transition-colors shrink-0 disabled:pointer-events-none"
        >
          <Send size={16} strokeWidth={1.75} />
        </button>
      </form>
    </Card>
  );
}
