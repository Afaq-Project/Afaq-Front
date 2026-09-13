export type SignupMethod = "Email" | "Google" | "LinkedIn";
export type SubscriptionTier = "Free" | "Premium";

export interface AiUsage {
  essayReviewsUsed: number;
  chatMessagesUsed: number;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  signupMethod: SignupMethod;
  tier: SubscriptionTier;
  profileCompletionPct: number;
  signupDate: string;
  lastActiveDate: string;
  educationLevel: string;
  fieldOfStudy: string;
  nationality: string;
  applicationCount: number;
  aiUsage: AiUsage;
}
