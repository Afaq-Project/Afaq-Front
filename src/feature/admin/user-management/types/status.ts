import type { Tone } from "@/src/shared/ui/Badge";
import type { SubscriptionTier } from "./user";

export const TIER_TONE: Record<SubscriptionTier, Tone> = {
  Free: "gray",
  Premium: "green",
};

/** FR-4.6: monthly AI usage caps for the Free tier. Premium is unlimited. */
export const FREE_TIER_AI_LIMITS = {
  essayReviews: 3,
  chatMessages: 20,
};
