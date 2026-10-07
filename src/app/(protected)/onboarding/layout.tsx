import type { ReactNode } from "react";
import { OnboardingLayout } from "@/src/feature/onboarding/components/layout/OnboardingLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return <OnboardingLayout>{children}</OnboardingLayout>;
}
