"use client";

import { useEffect, type ReactNode } from "react";
import { notFound, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/src/shared/lib/auth/auth-context";

function LoadingScreen() {
  return (
    <div className="flex flex-col justify-center items-center gap-3 min-h-screen">
      <Loader2 size={28} strokeWidth={1.75} className="text-primary-400 animate-spin" />
      <p className="font-medium text-neutral-600 text-sm">Loading...</p>
    </div>
  );
}

/**
 * Gates a route group by role. Sits below `(protected)/layout.tsx`, which
 * has already confirmed the user is authenticated by the time this renders.
 *
 * Pass `redirectTo` to send a disallowed user somewhere else in the app
 * (e.g. an admin wandering into student routes). Omit it to render a plain
 * 404 instead - used for admin routes, so a non-admin poking at the URL
 * gets no signal the route even exists, rather than a "you can't view this"
 * tell or a redirect that confirms it.
 */
export function RoleGuard({
  requireAdmin,
  redirectTo,
  children,
}: {
  requireAdmin: boolean;
  redirectTo?: string;
  children: ReactNode;
}) {
  const { isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const allowed = isAdmin === requireAdmin;

  useEffect(() => {
    if (!isLoading && !allowed && redirectTo) {
      router.replace(redirectTo);
    }
  }, [isLoading, allowed, redirectTo, router]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!allowed) {
    if (!redirectTo) {
      notFound();
    }
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
