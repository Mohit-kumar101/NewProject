import type { Metadata } from "next";
import Script from "next/script";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import {
  DEFAULT_OG_IMAGE,
  META_DESCRIPTION_MAX,
  clampMetaText,
} from "@/lib/pageMetadata";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
  preload: true,
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: true,
});

const rootDescription = clampMetaText(
  "Free PDF, HEIC, video, and data converters plus finance and crypto calculators. No subscription, no watermark — files stay in your browser.",
  META_DESCRIPTION_MAX
);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "CalculioHub — Free Calculators & Converters",
    template: `%s | ${SITE_NAME}`,
  },
  description: rootDescription,
  keywords: [
    "free file converter",
    "free PDF converter",
    "HEIC to JPG",
    "MP4 to MP3",
    "online calculator",
    "free calculator",
    "CloudConvert alternative",
    "Smallpdf alternative",
    "CalculioHub",
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "CalculioHub — Free Calculators & Converters",
    description: rootDescription,
    url: SITE_URL,
    locale: "en_US",
    images: [{ ...DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "CalculioHub — Free Calculators & Converters",
    description: rootDescription,
    images: [DEFAULT_OG_IMAGE.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon-48.png",
    apple: [{ url: "/favicon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${body.variable} h-full`}>
      <body className="flex min-h-full flex-col antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
        <Script
          id="adsense-loader"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9330679459013753"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
