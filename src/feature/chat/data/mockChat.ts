import { ChatContext, ChatMessage, EligibilityAlert } from "@/feature/chat/types/chat.types";

export const mockChatContext: ChatContext = {
  scholarshipName: "Global Merit Scholarship",
  disclaimer: "AI guidance does not guarantee application outcomes",
};

export const mockChatMessages: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    text: "Hello! I'm here to help you with your application for the Global Merit Scholarship. What would you like to know?",
  },
  {
    id: "m2",
    role: "user",
    text: "Can you check if my current GPA meets the requirements?",
  },
  {
    id: "m3",
    role: "assistant",
    text: "The standard requirement for this scholarship is a minimum GPA of 3.5 on a 4.0 scale.",
  },
  {
    id: "m4",
    role: "user",
    text: "I have a 3.4 but I'm president of the debate club. Does that count for anything?",
  },
];

export const mockEligibilityAlert: EligibilityAlert = {
  title: "Eligibility Verification Limited",
  description:
    "I cannot definitively verify if extracurricular activities can waive the hard GPA requirement. This type of exception is handled on a case-by-case basis by the admissions committee.",
  linkLabel: "Visit official website",
  linkHref: "https://example.org/global-merit-scholarship",
};
