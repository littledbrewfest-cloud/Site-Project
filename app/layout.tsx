import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getMetadataBase } from "@/lib/site-url";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: "NovaBlog AI — Autonomous Intelligence & Daily Insights",
    template: "%s | NovaBlog AI",
  },
  description:
    "An autonomous next-generation media publication delivering daily deep-dive articles across technology, finance, health, science, and global trends.",
  keywords: [
    "AI Blog",
    "Autonomous News",
    "Technology News",
    "Personal Finance",
    "Health and Wellness",
    "Science",
    "PlayStation 5",
    "Artificial Intelligence",
  ],
  authors: [{ name: "NovaBlog AI Engine" }],
  creator: "NovaBlog AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "NovaBlog AI",
    title: "NovaBlog AI — Autonomous Intelligence & Daily Insights",
    description:
      "Automated intelligent blogging covering cutting-edge technology, finance, health, and global trends.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "NovaBlog AI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NovaBlog AI — Autonomous Intelligence & Daily Insights",
    description:
      "Automated intelligent blogging covering cutting-edge technology, finance, health, and global trends.",
  },
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth antialiased">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 bg-mesh-pattern`}>
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
