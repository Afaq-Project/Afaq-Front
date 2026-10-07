import type { ReactNode } from "react";
import AuthBackground from "@/src/feature/auth/components/AuthBackground";

/**
 * Shared shell for /login and /register. Living in the route-group layout keeps the
 * background mounted when switching between the two pages.
 * overflow-x-clip guards against horizontal scroll from any decorative layer.
 */
export default function AuthRouteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="isolate relative flex flex-col md:justify-center md:items-center bg-neutral-50 md:p-8 short:py-4 min-h-dvh overflow-x-clip">
      <AuthBackground />
      {children}
    </div>
  );
}
