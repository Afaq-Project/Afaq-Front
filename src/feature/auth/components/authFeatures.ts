import { CalendarClock, MessageSquareText, Sparkles, type LucideIcon } from "lucide-react";

export interface AuthFeature {
  icon: LucideIcon;
  /** Its title and description are auth.features.<key>Title and <key>Description. */
  key: "matches" | "essays" | "deadlines";
}

/** Feature trio shown on the auth visual panel (login and sign-up). */
export const AUTH_FEATURES: AuthFeature[] = [
  { icon: Sparkles, key: "matches" },
  { icon: MessageSquareText, key: "essays" },
  { icon: CalendarClock, key: "deadlines" },
];
