import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getSafePublishedPosts } from "@/lib/db-helper";
import { getActiveCategories } from "@/lib/settings";
import { categoryToSlug } from "@/lib/constants";
import BlogExplorer from "@/components/BlogExplorer";
import { Crosshair, ShieldCheck, Gamepad2, Sparkles, ArrowRight, Zap, Flame, Trophy } from "lucide-react";

export const revalidate = 60; // ISR revalidate every 60s

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    getSafePublishedPosts(),
    getActiveCategories(),
  ]);

  // Serialize dates for Client Component
  const serializedPosts = posts.map((p) => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    content: p.content,
    coverImageUrl: p.coverImageUrl,
    category: p.category,
    tags: p.tags,
    publishedAt: p.publishedAt ? (typeof p.publishedAt === "string" ? p.publishedAt : p.publishedAt.toISOString()) : null,
    createdAt: typeof p.createdAt === "string" ? p.createdAt : p.createdAt.toISOString(),
  }));

  return (
    <div className="space-y-16">
      {/* Dynamic Hero Showcase Section */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-[#070b14] text-white p-6 sm:p-10 lg:p-14 shadow-2xl border border-amber-500/20">
        {/* Background Game Poster with Low Opacity & Cinematic Blending */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80"
            alt="ARC Raiders Surface Combat"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-15 sm:opacity-20 scale-105"
          />
          {/* Gradient Masks for smooth text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070b14] via-[#070b14]/90 to-[#070b14]/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-transparent to-transparent" />
          {/* Ambient Glowing Orbs */}
          <div className="absolute top-0 right-1/4 -mt-20 w-96 h-96 bg-amber-500/15 rounded-full blur-[110px]" />
          <div className="absolute bottom-0 left-10 -mb-20 w-96 h-96 bg-orange-600/15 rounded-full blur-[110px]" />
        </div>

        {/* 2-Column Split Hero */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Branding, Title, Action Links */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            {/* Live Tactical Status Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-inner">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="tracking-widest uppercase font-mono font-bold text-[11px] sm:text-xs">
                ARC Raiders Intel Network
              </span>
              <span className="text-white/30">•</span>
              <span className="text-slate-300 font-normal hidden sm:inline">2026 Edition</span>
            </div>

            {/* Main Brand Headline */}
            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-extrabold font-mono tracking-widest uppercase text-amber-400 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-amber-400" />
                <span>The Premier Database &amp; Community Guides</span>
              </p>
              
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[1.05]">
                ARC RAIDERS <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-500 bg-clip-text text-transparent">
                  DATABASE &amp; GUIDES
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl font-normal pt-1">
                Your #1 resource for <strong className="text-white font-semibold">ARC Raiders</strong> on PlayStation 5, PC, and Xbox Series X|S. In-depth weapon tier lists, extraction blueprints, machine boss strategies, and breaking news.
              </p>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/category/${categoryToSlug("Weapons & Loadouts")}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-105 transition-all"
              >
                <Flame className="w-4 h-4" />
                <span>Explore Weapon Meta</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href={`/category/${categoryToSlug("Guides & Walkthroughs")}`}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold text-xs sm:text-sm border border-slate-700 backdrop-blur-sm transition-all"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>Boss Fight Guides</span>
              </Link>

              <Link
                href={`/category/${categoryToSlug("PS5 & Console Gaming")}`}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-medium text-xs sm:text-sm border border-slate-800 transition-all hidden sm:inline-flex"
              >
                <Gamepad2 className="w-4 h-4 text-blue-400" />
                <span>PS5 Hub</span>
              </Link>
            </div>

            {/* Platform Badges Row */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 text-xs">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <Gamepad2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-[11px] sm:text-xs">PS5 4K</p>
                  <p className="text-slate-400 text-[10px]">DualSense Haptics</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <Zap className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-[11px] sm:text-xs">PC Steam / Epic</p>
                  <p className="text-slate-400 text-[10px]">Unreal Engine 5</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold text-white text-[11px] sm:text-xs">PvPvE Extraction</p>
                  <p className="text-slate-400 text-[10px]">Embark Studios</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Featured ARC Raiders Game Poster & Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] w-full rounded-[2rem] overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-500/10 group">
              {/* Poster Image */}
              <Image
                src="https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85"
                alt="ARC Raiders Official Key Art"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 450px"
                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              
              {/* Vignette and Glowing Cyber Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070b14] via-black/30 to-black/20" />
              <div className="absolute inset-0 border-2 border-amber-500/20 rounded-[2rem] pointer-events-none" />

              {/* Floating Top Badge */}
              <div className="absolute top-4 left-4 z-10 flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs font-mono font-bold">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>FEATURED INTEL BRIEFING</span>
              </div>

              {/* Floating Bottom Card */}
              <div className="absolute bottom-4 left-4 right-4 z-10 p-4 sm:p-5 rounded-2xl bg-slate-950/85 backdrop-blur-xl border border-slate-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                    Surface Recon Active
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    thearc-raiders.com
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-black uppercase text-white leading-snug">
                  Embark Studios High-Stakes PvPvE Extraction
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                  Complete breakdown of weapon damage multipliers, Titan machine weakspots, and solo extraction survival routes.
                </p>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                    <Sparkles className="w-3.5 h-3.5" />
                    1000+ Keyword Guides
                  </span>
                  <span className="text-amber-400 font-semibold font-mono">PS5 • PC • Xbox</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Blog Explorer */}
      <BlogExplorer initialPosts={serializedPosts} categories={categories} />
    </div>
  );
}
