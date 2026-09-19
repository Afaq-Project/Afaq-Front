export interface UsageMetric {
  id: string;
  label: string;
  used: number;
  limit: number;
}

export interface PlanFeature {
  label: string;
  included: boolean;
  highlight?: boolean;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: PlanFeature[];
  isCurrent?: boolean;
  isPopular?: boolean;
}

export type BillingCycle = "monthly" | "annual";
