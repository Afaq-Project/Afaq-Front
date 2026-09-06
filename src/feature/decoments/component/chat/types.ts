export type ChatSender = "bot" | "user";

export type ChatMessage = {
    id: string;
    sender: ChatSender;
    text: string;
};

export type EligibilityNotice = {
    title: string;
    message: string;
    websiteUrl?: string;
};

export type ScholarshipChat = {
    id: string;
    scholarshipName: string;
    messages: ChatMessage[];
    eligibilityNotice?: EligibilityNotice;
};