import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { LandingPage } from "@/src/feature/home/components/LandingPage";
import { landingContentFor } from "@/src/feature/home/content";

export async function generateMetadata(): Promise<Metadata> {
  const { meta } = landingContentFor(await getLocale());
  return {
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
}

export default function HomePage() {
  return <LandingPage />;
}
