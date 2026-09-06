import { Header } from "@/feature/layout/components/header";
import { Sidebar } from "@/feature/layout/components/sidebar";
import type { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 md:px-6 py-4 pb-24 md:pb-6 min-h-screen">
      <div className="flex flex-col gap-6 mx-auto max-w-380">
        <Header />
        <div className="flex gap-6 h-full">
          <Sidebar />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
