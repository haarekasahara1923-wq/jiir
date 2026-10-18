import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Sans_Devanagari } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/Toaster";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Analytics } from "@/components/shared/Analytics";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
});

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-noto-devanagari",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "JIIR — Journal of Interdisciplinary Innovation & Research",
    template: "%s | JIIR",
  },
  description:
    "Journal of Interdisciplinary Innovation & Research (JIIR) — Advancing Knowledge Across Disciplines. A peer-reviewed academic journal publishing original research in management, education, hospitality, science, and technology.",
  keywords: [
    "interdisciplinary research",
    "peer-reviewed journal",
    "management",
    "education",
    "science",
    "technology",
    "JIIR",
    "academic journal",
    "research publication",
    "India",
  ],
  authors: [{ name: "JIIR Editorial Office" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "JIIR — Journal of Interdisciplinary Innovation & Research",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfairDisplay.variable} ${notoSansDevanagari.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="jiir-theme"
        >
          <SessionProvider>
            <QueryProvider>
              {/* Skip to content for accessibility */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-[100] bg-navy-600 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Skip to content
              </a>
              {children}
              <Toaster />
            </QueryProvider>
          </SessionProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
