import { Info } from "lucide-react";
import { ChatContext } from "@/feature/chat/types/chat.types";

interface ChatContextBannerProps {
  context: ChatContext;
}

export function ChatContextBanner({ context }: ChatContextBannerProps) {
  return (
    <div className="border-b border-stone-200 bg-white px-6 py-4">
      <h1 className="text-lg font-semibold text-stone-900">
        Chatting about: {context.scholarshipName}
      </h1>
      <div className="mt-2 flex w-fit items-center gap-2 rounded-full bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-700">
        <Info size={13} />
        {context.disclaimer}
      </div>
    </div>
  );
}
