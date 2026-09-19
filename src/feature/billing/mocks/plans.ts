import type { Plan } from "../types/billing";

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    isCurrent: true,
    features: [
      { label: "20 AI Messages / month", included: true },
      { label: "3 Document Reviews", included: true },
      { label: "Advanced Analytics", included: false },
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 19,
    isPopular: true,
    features: [
      { label: "Unlimited AI Messages", included: true, highlight: true },
      { label: "Unlimited Document Reviews", included: true },
      { label: "Priority Concierge Support", included: true },
      { label: "Advanced Data Visuals", included: true },
    ],
  },
];
