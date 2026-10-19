import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { Toaster } from "@/components/ui/Toaster";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { Analytics } from "@/components/shared/Analytics";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0B2570",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "JIIR Journal",
  },
  title: {
    default: "JIIR — Journal of Interdisciplinary Innovation & Research",
    template: "%s | JIIR",
  },
  description:
    "Journal of Interdisciplinary Innovation & Research (JIIR) — Educate · Innovate · Collaborate. A premier international peer-reviewed academic journal publishing innovative research across management, education, science, technology, and hospitality.",
  keywords: [
    "interdisciplinary research",
    "peer-reviewed journal",
    "international journal",
    "management",
    "education",
    "science",
    "technology",
    "hospitality",
    "JIIR",
    "academic journal",
    "research publication",
  ],
  authors: [{ name: "JIIR Editorial Secretariat" }],
  icons: {
    icon: "/brand/logo.png",
    shortcut: "/brand/favicon.ico",
    apple: "/brand/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "JIIR — Journal of Interdisciplinary Innovation & Research",
    images: [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "JIIR — Journal of Interdisciplinary Innovation & Research",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/og-image.png"],
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
    <html lang="en" suppressHydrationWarning className={`${poppins.variable} light`}>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
        >
          <SessionProvider>
            <QueryProvider>
              {/* Accessibility Skip Link */}
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
