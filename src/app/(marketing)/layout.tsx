import { Inter } from "next/font/google";
import type { ReactNode } from "react";

// Loaded here, not in the root layout, so app pages don't download the landing font.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// The landing page is English-only until its own translation pass, so it stays left-to-right
// whatever language the app is set to.
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <div lang="en" dir="ltr" className={`${inter.variable} flex flex-col flex-1`}>
      {children}
    </div>
  );
}
