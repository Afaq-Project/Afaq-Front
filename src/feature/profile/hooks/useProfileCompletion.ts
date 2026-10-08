"use client";

import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { useProfileQuery } from "./useProfileQuery";

/**
 * Profile completion %, shared by the profile header and the dashboard so they always agree:
 * the profile's own value, falling back to the one on the auth user while it loads.
 */
export function useProfileCompletion() {
  const { user } = useAuth();
  const { data: profile } = useProfileQuery();
  return profile?.completionPct ?? user?.userProfile?.completionPct ?? 0;
}
