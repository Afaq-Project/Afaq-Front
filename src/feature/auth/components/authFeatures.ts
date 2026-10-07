import { CalendarClock, MessageSquareText, Sparkles, type LucideIcon } from "lucide-react";

export interface AuthFeature {
  icon: LucideIcon;
  /** Sentence case, no trailing period. */
  title: string;
  description: string;
}

/** Feature trio shown on the auth visual panel (login and sign-up). */
export const AUTH_FEATURES: AuthFeature[] = [
  {
    icon: Sparkles,
    title: "Matches ranked for you",
    description: "See how well each scholarship and internship fits your profile.",
  },
  {
    icon: MessageSquareText,
    title: "AI guidance on your essays",
    description: "Get clear feedback and answers while you prepare.",
  },
  {
    icon: CalendarClock,
    title: "Never miss a deadline",
    description: "Track every application and get reminders before it's due.",
  },
];
