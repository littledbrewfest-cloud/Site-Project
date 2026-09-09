"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Crosshair, Menu, X, Rss, ArrowRight, Radio } from "lucide-react";
import { DEFAULT_CATEGORIES, categoryToSlug } from "@/lib/constants";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="The ARC Raiders Hub Home">
            <div className="relative p-2.5 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-rose-600 text-white shadow-lg shadow-amber-500/20 group-hover:scale-105 group-hover:shadow-amber-500/35 transition-all duration-300">
              <Crosshair className="w-5 h-5 animate-[spin_12s_linear_infinite]" aria-hidden="true" />
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-black text-lg sm:text-xl tracking-wider uppercase text-slate-900 dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:via-slate-100 dark:to-amber-300 dark:bg-clip-text">
                  ARC Raiders
                </span>
                <span className="px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-mono text-[10px] font-extrabold uppercase tracking-widest border border-amber-500/30">
                  HUB
                </span>
              </div>
              <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium tracking-wider uppercase hidden sm:inline">
                Community Guides &amp; News
              </span>
            </div>
          </Link>

          {/* Desktop Categories Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary Navigation">
            <Link
              href="/"
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-900 dark:text-slate-200 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              Latest Intel
            </Link>
            {DEFAULT_CATEGORIES.slice(0, 5).map((category) => (
              <Link
                key={category}
                href={`/category/${categoryToSlug(category)}`}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                {category}
              </Link>
            ))}
          </nav>

          {/* Right Action Icons (Theme Toggle + RSS Feed) */}
          <div className="hidden sm:flex items-center gap-3">
            <ThemeToggle />

            <Link
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              title="RSS 2.0 Feed"
              aria-label="Access RSS 2.0 News Feed"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-amber-700 dark:hover:text-amber-400 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-800/80 shadow-sm"
            >
              <Rss className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
              <span>RSS Feed</span>
            </Link>
          </div>

          {/* Mobile menu and theme toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <ThemeToggle />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6 text-slate-800 dark:text-white" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900"
          >
            <span>Home / Latest Intel</span>
            <ArrowRight className="w-4 h-4 text-slate-400" aria-hidden="true" />
          </Link>
          
          <div className="pt-2 pb-1 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Radio className="w-3 h-3 text-amber-500" aria-hidden="true" />
            <span>Tactical Sectors</span>
          </div>

          {DEFAULT_CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/category/${categoryToSlug(category)}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              <span>{category}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" aria-hidden="true" />
            </Link>
          ))}

          <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <Link
              href="/rss.xml"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Subscribe to RSS 2.0 Feed"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              <Rss className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <span>RSS 2.0 Feed</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
