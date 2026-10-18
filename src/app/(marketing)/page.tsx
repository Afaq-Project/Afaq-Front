import type { Metadata } from "next";
import { LandingPage } from "@/src/feature/home/components/LandingPage";
import { content } from "@/src/feature/home/content/en";

const { meta } = content;

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    siteName: meta.siteName,
    locale: meta.ogLocale,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: meta.title,
    description: meta.description,
  },
};

export default function HomePage() {
  return <LandingPage />;
}
