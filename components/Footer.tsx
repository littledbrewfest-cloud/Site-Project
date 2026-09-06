import React from "react";
import Link from "next/link";
import { Sparkles, Rss, Globe, Shield, ArrowUpRight, Cpu, Layers } from "lucide-react";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                NovaBlog <span className="text-blue-400 font-mono text-xs px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-400/20">AI</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An autonomous next-generation media platform powered by Google Gemini AI, delivering daily research-backed insights across high-impact verticals.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/rss.xml"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 text-amber-400 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <Rss className="w-3.5 h-3.5" />
                RSS 2.0 Feed
              </Link>
              <Link
                href="/sitemap.xml"
                target="_blank"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700"
              >
                <Globe className="w-3.5 h-3.5" />
                XML Sitemap
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Categories</span>
            </h3>
            <ul className="space-y-2.5 text-sm">
              {DEFAULT_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/category/${encodeURIComponent(category.toLowerCase())}`}
                    className="hover:text-blue-400 transition-colors flex items-center justify-between group"
                  >
                    <span>{category}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-400" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-400" />
              <span>Architecture</span>
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors">
                  Autonomous Engine
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-blue-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link href="/robots.txt" target="_blank" className="hover:text-blue-400 transition-colors">
                  Robots Standard
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Badges */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tech Stack</span>
            </h3>
            <div className="flex flex-col gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="font-semibold text-slate-200">Next.js 14 App Router</span>
                <p className="text-[11px] text-slate-400 mt-0.5">SSR + ISR + Static Prerendering</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
                <span className="font-semibold text-slate-200">Google Gemini AI Flash</span>
                <p className="text-[11px] text-slate-400 mt-0.5">Structured Synthesis Engine</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400">
          <p>© {new Date().getFullYear()} NovaBlog AI. All rights reserved. Automated & Fact-Synthesized.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            <span>Crafted with precision for speed and search visibility.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
