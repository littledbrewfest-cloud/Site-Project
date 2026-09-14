import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getSafePublishedPosts } from "@/lib/db-helper";
import { getActiveCategories } from "@/lib/settings";
import { categoryToSlug, slugToCategory } from "@/lib/constants";
import PostCard from "@/components/PostCard";
import CategoryBadge from "@/components/CategoryBadge";
import NewsletterCard from "@/components/NewsletterCard";
import { BookOpen, Layers, ChevronRight } from "lucide-react";
import { getSiteUrl } from "@/lib/site-url";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const allCategories = await getActiveCategories();
  const matchedCategory = slugToCategory(params.category, allCategories);
  const siteUrl = getSiteUrl();
  const categorySlug = categoryToSlug(matchedCategory);

  return {
    title: {
      absolute: `${matchedCategory} Guides & Database | ARC Raiders`,
    },
    description: `Comprehensive tactical guides, meta loadouts, and survival strategies for ${matchedCategory} in ARC Raiders on PS5, PC, and Xbox Series X|S.`,
    alternates: {
      canonical: `${siteUrl}/category/${categorySlug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const allCategories = await getActiveCategories();
  const matchedCategory = slugToCategory(params.category, allCategories);

  // Query posts matching this category safely
  const allPublished = await getSafePublishedPosts();
  const posts = allPublished.filter(
    (p) => p.category.toLowerCase() === matchedCategory.toLowerCase()
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
        <span className="text-slate-500 dark:text-slate-400">
          Database Sectors
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
        <span className="text-amber-600 dark:text-amber-400 font-bold">
          {matchedCategory}
        </span>
      </nav>

      {/* Category Hero Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 text-white p-8 sm:p-12 lg:p-14 shadow-2xl border border-amber-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2.5">
            <CategoryBadge category={matchedCategory} isLink={false} />
            <span className="text-xs font-semibold text-amber-300 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 backdrop-blur-sm font-mono">
              {posts.length} {posts.length === 1 ? "Intel Record" : "Intel Records"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            {matchedCategory}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Surface reconnaissance, equipment blueprints, combat mechanics, and verified field intel for {matchedCategory.toLowerCase()} in Embark Studios&apos; high-stakes extraction shooter.
          </p>

          {/* Quick Category Jump Pills */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1 font-mono uppercase text-[11px]">
              <Layers className="w-3.5 h-3.5 text-amber-400" />
              Sectors:
            </span>
            {allCategories
              .filter((c) => c.toLowerCase() !== matchedCategory.toLowerCase())
              .map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${categoryToSlug(cat)}`}
                  className="px-3.5 py-1.5 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-full font-semibold transition-colors whitespace-nowrap backdrop-blur-sm border border-slate-700"
                >
                  {cat}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-8 space-y-4 shadow-md dark:shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            No Intel In This Sector Yet
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
            Surface reconnaissance operatives are compiling data for {matchedCategory}. Check back soon for the next Speranza dispatch.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-amber-500/20 transition-all"
          >
            Explore All Intel Records
          </Link>
        </div>
      )}

      {/* Sector Strategic Overview & Tactical Lore (High Word Count & SEO Value) */}
      <section className="bg-white dark:bg-[#0c1222] p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight flex items-center gap-2">
            <span className="w-2 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full inline-block" />
            <span>Sector Intel Briefing: {matchedCategory}</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1">
            Essential tactical background, combat mechanics, and surface survival protocols for Speranza Raiders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              Tactical Objective &amp; Progression Focus
            </h3>
            <p>
              In ARC Raiders, mastering the {matchedCategory.toLowerCase()} sector requires balancing aggressive extraction mechanics with careful resource preservation. Whether scavenging for critical quest items in top-tier machine complexes or optimizing weapon DPS multipliers, understanding how surface systems interact is vital for long-term progression.
            </p>
            <p>
              All dossiers published under this sector are peer-reviewed by our editorial team and cross-referenced with official patch notes from Embark Studios to guarantee maximum factual accuracy for PlayStation 5, PC Steam, and Xbox Series X|S players.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-base sm:text-lg">
              Key Survival Directives &amp; Squad Protocols
            </h3>
            <ul className="space-y-2.5 list-disc list-inside text-slate-600 dark:text-slate-300">
              <li><strong>Threat Mitigation:</strong> Prioritize acoustic stealth and sensor dampeners when navigating through high-density ARC Titan patrol corridors.</li>
              <li><strong>Extract Timing:</strong> Call extractions during secondary machine cycles to minimize enemy squad ambushes at drop zones.</li>
              <li><strong>Resource Routing:</strong> Store essential crafting components in secured stash containers before pushing into hazardous wasteland ruins.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterCard />
    </div>
  );
}
