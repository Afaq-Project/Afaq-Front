import type { ReactNode } from "react";
import { BottomTabBar } from "./bottom-tab-bar";
import type { ShellVariant } from "./shell-config";
import { TopBar } from "./top-bar";

/**
 * Global layout for signed-in pages: skip link, sticky top bar, the page in a 1440px column,
 * and the mobile tab bar. The page scrolls normally; on mobile, main is padded so the tab
 * bar never covers it.
 */
export function AppShell({ variant, children }: { variant: ShellVariant; children: ReactNode }) {
  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:top-2 focus:left-2 focus:z-50 focus:fixed bg-white shadow-sm px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 font-medium text-primary-800 text-small"
      >
        Skip to content
      </a>

      <TopBar variant={variant} />

      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 px-4 md:px-6 xl:px-8 pt-6 lg:pt-8 pb-[calc(4rem+env(safe-area-inset-bottom)+1.5rem)] md:pb-6 focus:outline-none"
      >
        <div className="mx-auto w-full max-w-360">{children}</div>
      </main>

      <BottomTabBar variant={variant} />
    </div>
  );
}
