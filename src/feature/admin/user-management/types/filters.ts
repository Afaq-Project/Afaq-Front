import type { SignupMethod, SubscriptionTier } from "./user";

export const FILTERABLE_TIERS: SubscriptionTier[] = ["Free", "Premium"];
export const FILTERABLE_SIGNUP_METHODS: SignupMethod[] = ["Email", "Google", "LinkedIn"];

export interface UserFilterState {
  search: string;
  tier: SubscriptionTier | "all";
  signupMethod: SignupMethod | "all";
}

export const DEFAULT_USER_FILTERS: UserFilterState = {
  search: "",
  tier: "all",
  signupMethod: "all",
};
