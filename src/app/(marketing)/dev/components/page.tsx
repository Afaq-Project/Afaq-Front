import type { Metadata } from "next";
import { ComponentGallery } from "@/src/feature/home/components/dev/ComponentGallery";
import { LandingRoot } from "@/src/feature/home/components/LandingRoot";

// Internal review page for the landing building blocks. Not linked anywhere, not indexed.
export const metadata: Metadata = {
  title: "Landing components",
  robots: { index: false, follow: false },
};

export default function DevComponentsPage() {
  return (
    <LandingRoot>
      <ComponentGallery />
    </LandingRoot>
  );
}
