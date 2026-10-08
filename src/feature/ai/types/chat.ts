export interface EssayReview {
  /** What the user called the essay, or its file name. */
  essayName: string;
  /** What the essay is for, e.g. an opportunity title. */
  purpose?: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** Display time, e.g. "10:30 AM". */
  timestamp: string;
  /** Full date and time (ISO); drives the time dividers. Optional: older messages lack it. */
  at?: string;
  /** Quick-reply chips shown under an assistant message. */
  suggestions?: string[];
  /** Present when the assistant message is an essay review. */
  review?: EssayReview;
}

export interface Conversation {
  id: string;
  title: string;
  timeLabel: string;
  messages: ChatMessage[];
  /** The opportunity or application the chat is about; absent for general guidance. */
  opportunityId?: string;
  applicationId?: string;
  /** Last activity (ISO), for "2 days ago" in the chat list. */
  updatedAt?: string;
}

export interface CreditUsage {
  used: number;
  limit: number;
  /** ISO date the monthly quota resets. */
  resetsOn?: string;
}
