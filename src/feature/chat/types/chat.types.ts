export type ChatRole = "assistant" | "user";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
}

export interface EligibilityAlert {
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
}

export interface ChatContext {
  scholarshipName: string;
  disclaimer: string;
}
