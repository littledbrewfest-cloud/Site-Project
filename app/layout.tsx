import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { getMetadataBase } from "@/lib/site-url";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
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
  return (
    <html lang="en" className="scroll-smooth antialiased">
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
