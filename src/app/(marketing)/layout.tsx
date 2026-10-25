import { Almarai, Inter } from "next/font/google";
import type { ReactNode } from "react";

// Loaded here, not in the root layout, so app pages don't download the landing font.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

// The landing's Arabic headings and hero text (text-landing-display/h2/h3). 700 serves their 600.
const almarai = Almarai({
  variable: "--font-arabic-heading",
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

// Language and direction come from the root layout, like the rest of the app.
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <div className={`${inter.variable} ${almarai.variable} flex flex-col flex-1`}>{children}</div>;
}
