"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState, type ReactNode } from "react";
import { AuthProvider } from "@/src/shared/lib/auth/auth-context";
import { Toaster } from "@/src/shared/ui/Toaster";

// Each API call takes ~2s, so React Query's default of 3 retries with backoff can keep a
// spinner up for well over 10s. Retry once, and never for client errors (4xx) — those
// won't succeed on a second try.
function shouldRetry(failureCount: number, error: unknown) {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  if (status && status >= 400 && status < 500) return false;
  return failureCount < 1;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { retry: shouldRetry } } }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
