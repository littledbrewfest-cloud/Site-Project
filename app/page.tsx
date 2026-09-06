import React from "react";
import { getSafePublishedPosts } from "@/lib/db-helper";
import { getActiveCategories } from "@/lib/settings";
import BlogExplorer from "@/components/BlogExplorer";
import { TrendingUp, Cpu, ShieldCheck } from "lucide-react";

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
      {/* Hero Banner with Modern Mesh Gradient */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white p-8 sm:p-14 lg:p-20 shadow-2xl border border-slate-800/80">
        {/* Animated Background Glows */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl space-y-8">
          {/* Live Status Pill */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md shadow-inner">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wide">Autonomous Intelligence Engine Active</span>
            <span className="text-white/30">•</span>
            <span className="text-slate-300 font-normal">Gemini 1.5 Powered</span>
          </div>

          {/* Hero Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
              Insights from the <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Frontier of Knowledge.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-xl leading-relaxed max-w-2xl font-normal">
              An intelligent, round-the-clock media publication delivering curated deep dives on artificial intelligence, future tech, wealth architecture, and human performance.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-white/10 text-xs sm:text-sm">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Daily Freshness</p>
                <p className="text-slate-400 text-xs">Continuous Publishing</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Gemini Synthesis</p>
                <p className="text-slate-400 text-xs">Structured Research</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-white">Clean Architecture</p>
                <p className="text-slate-400 text-xs">Sub-Second Load Times</p>
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
