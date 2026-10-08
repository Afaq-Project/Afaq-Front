import { AppShell } from "@/src/feature/layout/components/app-shell";
import { RoleGuard } from "@/src/shared/lib/auth/RoleGuard";
import type { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard requireAdmin={false} redirectTo="/admin/dashboard">
      <AppShell variant="user">{children}</AppShell>
    </RoleGuard>
  );
}
