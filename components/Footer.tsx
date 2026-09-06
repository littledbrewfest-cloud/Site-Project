import React from "react";
import Link from "next/link";
import { Sparkles, Rss, Globe } from "lucide-react";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-slate-900 dark:text-white">
                NovaBlog AI
              </span>
            </div>
            <p className="text-sm max-w-sm leading-relaxed">
              An intelligent, autonomous blogging platform delivering in-depth, fresh perspectives
              on technology, finance, health, lifestyle, and global trends daily.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/rss.xml"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-600 hover:border-amber-400 transition-colors"
              >
                <Rss className="w-3.5 h-3.5" />
                RSS 2.0 Feed
              </Link>
              <Link
                href="/sitemap.xml"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-blue-400 transition-colors"
              >
                <Globe className="w-3.5 h-3.5" />
                Sitemap
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Categories
            </h3>
            <ul className="space-y-2 text-sm">
              {DEFAULT_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/category/${encodeURIComponent(category.toLowerCase())}`}
                    className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links & Meta */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Platform
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Latest Articles
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Admin Dashboard
                </Link>
              </li>
              <li>
                <Link href="/robots.txt" target="_blank" className="hover:text-blue-600 dark:hover:text-blue-400">
                  Robots Directive
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NovaBlog AI. Automatically curated and published.</p>
          <p className="mt-2 sm:mt-0">Built with Next.js 14, Tailwind CSS, Prisma & Google Gemini AI</p>
        </div>
      </div>
    </footer>
  );
}
