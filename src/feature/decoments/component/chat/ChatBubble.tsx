import { ChatMessage } from "./types";

export default function ChatBubble({ message }: { message: ChatMessage }) {
    const isUser = message.sender === "user";

    return (
        <div className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}>
            {!isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-200 text-xs">
                    🤖
                </div>
            )}

            <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${isUser
                        ? "bg-green-800 text-white rounded-br-sm"
                        : "bg-stone-100 text-stone-800 rounded-bl-sm"
                    }`}
            >
                {message.text}
            </div>

            {isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-stone-800 text-white text-xs">
                    🧑
                </div>
            )}
        </div>
    );
}