"use client";

import { useEffect } from "react";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { tokenStorage } from "@/src/shared/lib/auth/token-storage";
import { useProfileQuery } from "./useProfileQuery";

/**
 * Profile completion %, shared by the profile header and the dashboard so they always agree:
 * the profile's own value. While it loads, the last value the profile reported, then the one on
 * the auth user (which only updates on sign-in, so it can lag behind profile edits).
 */
export function useProfileCompletion() {
  const { user } = useAuth();
  const { data: profile } = useProfileQuery();
  const userId = user?.id;
  const profilePct = profile?.completionPct;

  useEffect(() => {
    if (userId && profilePct !== undefined) tokenStorage.setCachedCompletion(userId, profilePct);
  }, [userId, profilePct]);

  return (
    profilePct ??
    (userId ? tokenStorage.getCachedCompletion(userId) : null) ??
    user?.userProfile?.completionPct ??
    0
  );
}
