import { ManagedUser } from "../types/user";
import { FREE_TIER_AI_LIMITS } from "../types/status";
import { UserFilterState } from "../types/filters";

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatEssayReviewsUsage(user: ManagedUser): string {
  if (user.tier === "Premium") return "Unlimited";
  return `${user.aiUsage.essayReviewsUsed}/${FREE_TIER_AI_LIMITS.essayReviews}`;
}

export function formatChatMessagesUsage(user: ManagedUser): string {
  if (user.tier === "Premium") return "Unlimited";
  return `${user.aiUsage.chatMessagesUsed}/${FREE_TIER_AI_LIMITS.chatMessages}`;
}

export function filterUsers(users: ManagedUser[], filters: UserFilterState): ManagedUser[] {
  const search = filters.search.trim().toLowerCase();

  return users.filter((user) => {
    const matchesSearch =
      search.length === 0 ||
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search);

    const matchesTier = filters.tier === "all" || user.tier === filters.tier;

    const matchesSignupMethod =
      filters.signupMethod === "all" || user.signupMethod === filters.signupMethod;

    return matchesSearch && matchesTier && matchesSignupMethod;
  });
}

export function getUserById(users: ManagedUser[], id: string): ManagedUser | undefined {
  return users.find((user) => user.id === id);
}
