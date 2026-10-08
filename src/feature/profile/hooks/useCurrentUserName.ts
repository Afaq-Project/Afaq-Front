"use client";

import { useAuth } from "@/src/shared/lib/auth/auth-context";
import { getInitials } from "@/src/shared/lib/initials";
import { fullName } from "../services/format";
import { useProfileQuery } from "./useProfileQuery";

/**
 * The signed-in user's name, shared by the app shell, dashboard and profile page so they
 * never disagree. The profile wins because it's refetched after edits; the auth user is the
 * fallback while it loads. Admins have no profile, so it isn't fetched for them.
 */
export function useCurrentUserName() {
  const { user, isAdmin } = useAuth();
  const { data: profile } = useProfileQuery({ enabled: !isAdmin });

  const name =
    fullName(profile?.firstName, profile?.lastName) ||
    fullName(user?.firstName, user?.lastName);

  return {
    name,
    firstName: profile?.firstName || user?.firstName || "",
    initials: getInitials(name),
    email: profile?.email ?? user?.email ?? "",
  };
}
