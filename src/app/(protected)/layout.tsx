"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/src/shared/lib/auth/auth-context";
import type { ReactNode } from "react";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex flex-col justify-center items-center gap-3 min-h-screen">
        <Loader2
          size={28}
          strokeWidth={1.75}
          className="text-primary-400 animate-spin"
        />
        <p className="font-medium text-neutral-600 text-sm">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
