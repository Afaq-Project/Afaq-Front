export interface DashboardUserMetrics {
  total: number;
  free: number;
  premium: number;
}

export interface LiveOpportunityMetrics {
  scholarships: number;
  internships: number;
}

export interface AiUsageMetrics {
  totalEssayReviews: number;
  totalChatMessages: number;
  freeEssayReviews: number;
  premiumEssayReviews: number;
  freeChatMessages: number;
  premiumChatMessages: number;
}

export interface SubscriptionMetrics {
  activePremiumSubscribers: number;
  failedPaymentDowngradesThisMonth: number;
}

export interface DashboardMetrics {
  users: DashboardUserMetrics;
  pendingApprovalCount: number;
  liveOpportunities: LiveOpportunityMetrics;
  aiUsage: AiUsageMetrics;
  subscriptions: SubscriptionMetrics;
}
