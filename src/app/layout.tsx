import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_URL } from "@/lib/calculators";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Free Calculators & File Converters`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "The free alternative to paid converters. PDF, HEIC, video, and data tools plus finance and crypto calculators — no subscription, no watermark, files stay in your browser.",
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
    title: `${SITE_NAME} — Free Calculators & File Converters`,
    description:
      "The free alternative to paid converters. PDF, HEIC, video, and data tools plus finance and crypto calculators — no subscription, no watermark.",
    url: SITE_URL,
    locale: "en_US",
    images: [
      {
        url: "/myicon.png",
        width: 1144,
        height: 928,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Free Calculators & File Converters`,
    description:
      "The free alternative to paid converters. PDF, HEIC, video, and data tools plus finance and crypto calculators — no subscription, no watermark.",
    images: ["/myicon.png"],
  },
  robots: {
    index: true,
    follow: true,
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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9330679459013753"
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-full flex-col antialiased">
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
