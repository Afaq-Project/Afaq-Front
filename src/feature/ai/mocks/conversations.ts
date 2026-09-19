import type { Conversation, CreditUsage } from "../types/chat";

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    title: "Young Leaders Scholarship 2024",
    timeLabel: "Now",
    messages: [
      {
        id: "conv-1-m1",
        role: "assistant",
        text: 'Welcome! I\'m here to help you apply for the "Young Leaders Scholarship 2024". I\'ve reviewed your profile, and your qualifications look excellent for this program.',
        timestamp: "10:30 AM",
      },
      {
        id: "conv-1-m2",
        role: "user",
        text: "Thank you. Can you help me draft my Statement of Purpose? I want to focus on my experience in environmental volunteering.",
        timestamp: "10:32 AM",
      },
      {
        id: "conv-1-m3",
        role: "assistant",
        text: "Certainly! Environmental experience is a major strength for this scholarship. Let's start by dividing the statement into three main parts. Which part would you like to start with?",
        timestamp: "10:33 AM",
        suggestions: [
          "Introduction and Passion",
          "Explaining Volunteer Experience",
          "Future Goals",
        ],
      },
    ],
  },
  {
    id: "conv-2",
    title: "Inquiry about language requirements",
    timeLabel: "Yesterday",
    messages: [
      {
        id: "conv-2-m1",
        role: "assistant",
        text: "Hi! Ask me anything about language requirements for the scholarships and programs you're tracking.",
        timestamp: "Yesterday",
      },
      {
        id: "conv-2-m2",
        role: "user",
        text: "Does the Qatar Grant require an IELTS score?",
        timestamp: "Yesterday",
      },
      {
        id: "conv-2-m3",
        role: "assistant",
        text: "Most Qatar Grant tracks ask for an IELTS score of 6.5 or higher, though a few departments accept TOEFL iBT 90+ instead. I'd double-check the specific program page before submitting.",
        timestamp: "Yesterday",
      },
    ],
  },
  {
    id: "conv-3",
    title: "Academic CV formatting",
    timeLabel: "March 15",
    messages: [
      {
        id: "conv-3-m1",
        role: "assistant",
        text: "Hi! Want help formatting your academic CV? Share what section you're working on and I'll suggest improvements.",
        timestamp: "Mar 15",
      },
      {
        id: "conv-3-m2",
        role: "user",
        text: "How long should an academic CV be for a graduate scholarship application?",
        timestamp: "Mar 15",
      },
      {
        id: "conv-3-m3",
        role: "assistant",
        text: "For most graduate scholarship applications, 2–3 pages is the sweet spot — enough room for publications and research experience without padding.",
        timestamp: "Mar 15",
      },
    ],
  },
];

export const CREDIT_USAGE: CreditUsage = { used: 5, limit: 20 };
