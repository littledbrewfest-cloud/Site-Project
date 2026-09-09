import React from "react";
import Link from "next/link";
import { Crosshair, Rss, Globe, Shield, ArrowUpRight, Cpu, Layers } from "lucide-react";
import { DEFAULT_CATEGORIES, categoryToSlug } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-600 to-rose-600 text-white shadow-md shadow-amber-500/20">
                <Crosshair className="w-5 h-5" aria-hidden="true" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white tracking-wider uppercase">
                The ARC Raiders <span className="text-amber-700 dark:text-amber-400 font-mono text-xs px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">HUB</span>
              </span>
            </div>
            
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed max-w-sm">
              The premier unofficial community database, loadout builder, and news intelligence hub for ARC Raiders by Embark Studios. Covering PS5, PC, and Xbox Series X|S.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View RSS 2.0 Feed in new tab"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-900 text-amber-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
              >
                <Rss className="w-3.5 h-3.5" aria-hidden="true" />
                RSS 2.0 Feed
              </Link>
              <Link
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View XML Sitemap in new tab"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
              >
                <Globe className="w-3.5 h-3.5" aria-hidden="true" />
                XML Sitemap
              </Link>
              <Link
                href="/llms.txt"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View LLM Knowledge Base Manifest"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800"
              >
                LLMs.txt
              </Link>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" aria-hidden="true" />
              <span>Database Sections</span>
            </h3>
            <ul className="space-y-2.5 text-sm">
              {DEFAULT_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/category/${categoryToSlug(category)}`}
                    className="text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 transition-colors flex items-center justify-between group"
                  >
                    <span>{category}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-amber-500" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-orange-500 dark:text-orange-400" aria-hidden="true" />
              <span>Platforms &amp; Specs</span>
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href={`/category/${categoryToSlug("PS5 & Console Gaming")}`} className="text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  PlayStation 5 Hub
                </Link>
              </li>
              <li>
                <Link href={`/category/${categoryToSlug("PC Specs & Performance")}`} className="text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  PC System Requirements
                </Link>
              </li>
              <li>
                <Link href={`/category/${categoryToSlug("Weapons & Loadouts")}`} className="text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  Weapons &amp; Armory
                </Link>
              </li>
              <li>
                <Link href="/robots.txt" target="_blank" rel="noopener noreferrer" className="text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                  Robots Index
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Badges */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" aria-hidden="true" />
              <span>Engine Intel</span>
            </h3>
            <div className="flex flex-col gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-slate-200">Unreal Engine 5</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">Lumen, Nanite &amp; Chaos Physics</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800">
                <span className="font-semibold text-slate-900 dark:text-slate-200">Embark Studios</span>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">PvPvE Extraction Survival</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 dark:text-slate-400">
          <p>© {new Date().getFullYear()} The ARC Raiders Hub (thearc-raiders.com). Fan community &amp; media portal.</p>
          <p className="mt-2 sm:mt-0">ARC Raiders is a registered trademark of Embark Studios AB.</p>
        </div>
      </div>
    </footer>
  );
}
