import { Header } from "@/src/feature/layout/components/header";
import { Sidebar } from "@/src/feature/layout/components/sidebar";
import { ProfileProvider } from "@/src/feature/profile/context/ProfileContext";
import type { ReactNode } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <ProfileProvider>
      <div className="px-4 md:px-6 py-4 pb-24 md:pb-6 min-h-screen">
        <div className="flex flex-col gap-6 mx-auto max-w-380">
          <Header />
          <div className="flex gap-6 h-full">
            <Sidebar />
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </div>
    </ProfileProvider>
  );
}

