import { AppShell } from "@/src/feature/layout/components/app-shell";
import { RoleGuard } from "@/src/shared/lib/auth/RoleGuard";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard requireAdmin>
      <AppShell variant="admin">{children}</AppShell>
    </RoleGuard>
  );
}
