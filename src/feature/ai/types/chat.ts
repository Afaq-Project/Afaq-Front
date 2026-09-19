export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  /** Quick-reply chips shown under an assistant message. */
  suggestions?: string[];
}

export interface Conversation {
  id: string;
  title: string;
  timeLabel: string;
  messages: ChatMessage[];
}

export interface CreditUsage {
  used: number;
  limit: number;
}
