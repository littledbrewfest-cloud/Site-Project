import React from "react";
import { getSafePublishedPosts } from "@/lib/db-helper";
import { getActiveCategories } from "@/lib/settings";
import BlogExplorer from "@/components/BlogExplorer";
import { Crosshair, ShieldCheck, Gamepad2 } from "lucide-react";

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
      {/* Hero Banner with Sci-Fi Extraction Aesthetic */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 text-white p-8 sm:p-14 lg:p-20 shadow-2xl border border-amber-500/20">
        {/* Animated Background Glows */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-orange-600/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-8">
          {/* Live Tactical Intel Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-inner">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span className="tracking-widest uppercase font-mono font-bold">Speranza Defense Grid Active</span>
            <span className="text-white/30">•</span>
            <span className="text-slate-300 font-normal">thearc-raiders.com</span>
          </div>

          {/* Hero Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight uppercase leading-[1.08]">
              Survive the Surface. <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-rose-400 bg-clip-text text-transparent">
                Defeat the Machines.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-xl leading-relaxed max-w-2xl font-normal">
              The premier database, loadout guides, extraction maps, and breaking news for <strong className="text-white font-semibold">ARC Raiders</strong> on PlayStation 5, PC, and Xbox Series X|S.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs sm:text-sm">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">PS5 DualSense</p>
                <p className="text-slate-400 text-xs">4K Haptic Immersion</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400">
                <Crosshair className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">PvPvE Extraction</p>
                <p className="text-slate-400 text-xs">High-Stakes Survival</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Unreal Engine 5</p>
                <p className="text-slate-400 text-xs">Embark Studios</p>
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
