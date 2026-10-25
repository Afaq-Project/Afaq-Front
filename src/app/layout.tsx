import type { Metadata, Viewport } from "next";
import { Cairo, IBM_Plex_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";
import { LOCALE_DIR } from "@/src/i18n/config";
import "./globals.css";
import { Providers } from "./providers";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// The Arabic font (variable weight). With Latin too: in Arabic it comes first in the font stack
// (see globals.css), so it draws the odd Latin word as well.
const cairo = Cairo({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  title: "Afaq - Discover your future",
  description: "AI-powered opportunity discovery platform",
};

// Lets the mobile tab bar pad itself with env(safe-area-inset-bottom).
export const viewport: Viewport = {
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The saved language sets lang and dir on the server, so the first paint is already right.
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={LOCALE_DIR[locale]}
      className={`${ibmPlexSans.variable} ${cairo.variable} h-full antialiased`}
    >
      <body className="flex flex-col min-h-full">
        <NextIntlClientProvider>
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
