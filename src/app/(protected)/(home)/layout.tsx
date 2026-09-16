import { Header } from "@/feature/layout/components/header";
import { Sidebar } from "@/feature/layout/components/sidebar";
import { ProfileProvider } from "@/feature/profile/context/ProfileContext";
import type { ReactNode } from "react";


export default function HomeLayout({ children }: { children: ReactNode }) {
  return (
    <ProfileProvider>
      <div className="flex flex-col px-4 md:px-6 py-4 pb-24 md:pb-6 min-h-screen md:h-screen">
        <div className="flex flex-col flex-1 md:min-h-0 gap-6 mx-auto w-full max-w-380">
          <Header />
          <div className="flex flex-1 md:min-h-0 gap-6">
            <Sidebar />
            <div className="flex-1 md:overflow-y-auto min-w-0 p-4 md:p-6 scrollbar-minimal">
              {children}
            </div>
          </div>
        </div>
      </div>
    </ProfileProvider>
  );
}

