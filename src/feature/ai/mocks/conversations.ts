import { FREE_LIMITS } from "@/src/feature/billing/config/plans";
import { firstOfNextMonth, isoDateFromToday } from "@/src/shared/lib/deadline";
import type { Conversation, CreditUsage } from "../types/chat";

/** ISO date-time `days` from today at hh:mm (local). */
function at(days: number, time: string) {
  return `${isoDateFromToday(days)}T${time}:00`;
}

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "Statement of purpose draft",
    timeLabel: "Now",
    opportunityId: "o3",
    updatedAt: isoDateFromToday(0),
    messages: [
      {
        id: "conv-1-m1",
        role: "assistant",
        text: "I can help with your application for **Young Leaders Scholarship**. Based on your profile, you meet 3 of the 4 listed requirements, and I couldn't verify the language requirement, so check the official page for that one.",
        timestamp: "10:30 AM",
        at: at(0, "10:30"),
      },
      {
        id: "conv-1-m2",
        role: "user",
        text: "Thank you. Can you help me draft my statement of purpose? I want to focus on my experience in environmental volunteering.",
        timestamp: "10:32 AM",
        at: at(0, "10:32"),
      },
      {
        id: "conv-1-m3",
        role: "assistant",
        text: "Environmental volunteering fits this scholarship's focus on social impact. A common structure is:\n\n1. **Introduction**: the moment that got you involved\n2. **Experience**: what you did and one measurable result\n3. **Goals**: how the scholarship helps you go further\n\nWhich part would you like to start with?",
        timestamp: "10:33 AM",
        at: at(0, "10:33"),
        suggestions: ["Introduction and motivation", "Explaining my volunteer experience", "Future goals"],
      },
    ],
  },
  {
    id: "conv-2",
    title: "Language requirements",
    timeLabel: "Yesterday",
    opportunityId: "o1",
    updatedAt: isoDateFromToday(-1),
    messages: [
      {
        id: "conv-2-m1",
        role: "assistant",
        text: "Ask me anything about the language requirements for this scholarship.",
        timestamp: "2:05 PM",
        at: at(-1, "14:05"),
      },
      {
        id: "conv-2-m2",
        role: "user",
        text: "Does this scholarship require an IELTS score?",
        timestamp: "2:06 PM",
        at: at(-1, "14:06"),
      },
      {
        id: "conv-2-m3",
        role: "assistant",
        text: "The listing doesn't name a specific test. Programs like this often ask for IELTS 6.5 or TOEFL iBT 90, but that varies, so check the official page before you book a test.",
        timestamp: "2:07 PM",
        at: at(-1, "14:07"),
      },
    ],
  },
  {
    id: "conv-3",
    title: "Academic CV formatting",
    timeLabel: "March 15",
    updatedAt: isoDateFromToday(-24),
    messages: [
      {
        id: "conv-3-m1",
        role: "assistant",
        text: "Want help formatting your academic CV? Tell me which section you're working on.",
        timestamp: "10:00 AM",
        at: at(-24, "10:00"),
      },
      {
        id: "conv-3-m2",
        role: "user",
        text: "How long should an academic CV be for a graduate scholarship application?",
        timestamp: "11:12 AM",
        at: at(-24, "11:12"),
      },
      {
        id: "conv-3-m3",
        role: "assistant",
        text: "For most graduate scholarship applications, 2–3 pages works: enough room for research and publications without padding.",
        timestamp: "11:13 AM",
        at: at(-24, "11:13"),
      },
    ],
  },
];

export const CREDIT_USAGE: CreditUsage = { used: 5, limit: FREE_LIMITS.chatMessages, resetsOn: firstOfNextMonth() };
