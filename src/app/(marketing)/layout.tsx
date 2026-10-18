import { Inter } from "next/font/google";
import type { ReactNode } from "react";

// Loaded here, not in the root layout, so app pages don't download the landing font.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <div className={`${inter.variable} flex flex-col flex-1`}>{children}</div>;
}
