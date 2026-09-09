import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getMetadataBase, getSiteUrl } from "@/lib/site-url";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#070b14",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  manifest: "/manifest.webmanifest",
  title: {
    default: "The ARC Raiders Hub — Guides, News & Database (PS5, PC, Xbox)",
    template: "%s | The ARC Raiders Hub",
  },
  description:
    "The ultimate community database, guides, and news hub for ARC Raiders by Embark Studios. In-depth weapon tier lists, Speranza colony mechanics, Titan boss fight strategies, and PS5/PC performance guides.",
  keywords: [
    "ARC Raiders",
    "ARC Raiders PS5",
    "ARC Raiders Release Date",
    "Embark Studios",
    "ARC Raiders Gameplay",
    "Extraction Shooter",
    "Speranza Colony",
    "ARC Raiders Weapons",
    "ARC Raiders PC Requirements",
    "PlayStation 5 Gaming",
    "THE FINALS",
  ],
  authors: [{ name: "ARC Raiders Editorial Team" }],
  creator: "The ARC Raiders Hub",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "The ARC Raiders Hub",
    title: "The ARC Raiders Hub — Guides, News & Database (PS5, PC, Xbox)",
    description:
      "The premier community database, news, and guides for ARC Raiders by Embark Studios. In-depth loadout guides, extraction routes, and PS5/PC optimization.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "The ARC Raiders Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The ARC Raiders Hub — Guides, News & Database",
    description:
      "The premier community database, news, and guides for ARC Raiders on PS5, PC, and Xbox.",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/icon.svg"],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
      "text/plain": "/llms.txt",
    },
  },
  verification: {
    google: "BrTIRXxCklNpGRA9SgpsaQzuQWOsF0WBuRZPEKeoOr8",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteUrl = getSiteUrl();

  const websiteSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "The ARC Raiders Hub",
        description:
          "The premier community database, guides, and news hub for ARC Raiders by Embark Studios on PS5, PC, and Xbox Series X|S.",
        publisher: {
          "@type": "Organization",
          "@id": `${siteUrl}/#organization`,
          name: "The ARC Raiders Hub",
          url: siteUrl,
          logo: {
            "@type": "ImageObject",
            url: `${siteUrl}/icon.svg`,
          },
        },
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "The ARC Raiders Hub",
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        sameAs: [
          "https://twitter.com/ARC_Raiders_Hub",
          "https://github.com/littledbrewfest-cloud/Site-Project",
        ],
      },
    ],
  };

  return (
    <html lang="en" className="scroll-smooth antialiased">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="llms-txt" href="/llms.txt" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-[#070b14] dark:text-slate-100 bg-mesh-pattern selection:bg-amber-500 selection:text-black transition-colors duration-200`}>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
