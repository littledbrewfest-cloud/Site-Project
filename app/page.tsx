import React from "react";
import { getSafePublishedPosts } from "@/lib/db-helper";
import { getActiveCategories } from "@/lib/settings";
import BlogExplorer from "@/components/BlogExplorer";
import { Sparkles, TrendingUp, Cpu, ShieldCheck } from "lucide-react";

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
    <div className="space-y-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous Intelligence Engine Active</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-none">
            Exploring Tomorrow, <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Written Today.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Welcome to NovaBlog. A curated, continuously updated stream of high-impact articles covering AI innovations, wealth building, peak health, and trending ideas.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Multi-Niche Coverage</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Cpu className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>Gemini Flash Powered</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck className="w-4 h-4 text-purple-400 flex-shrink-0" />
              <span>Daily Auto-Refreshed</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Interactive Blog Explorer with Search & Filter */}
      <BlogExplorer initialPosts={serializedPosts} categories={categories} />
    </div>
  );
}
