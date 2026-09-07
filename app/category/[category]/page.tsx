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

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export const revalidate = 60;

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const allCategories = await getActiveCategories();
  const matchedCategory = slugToCategory(params.category, allCategories);

  return {
    title: `${matchedCategory} Guides, Meta & News | The ARC Raiders Hub`,
    description: `Browse tactical guides, loadout meta, patch notes, and news in ${matchedCategory} for ARC Raiders on PS5, PC, and Xbox.`,
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
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/" className="hover:text-amber-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-slate-400">
          Database Sectors
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="text-amber-400 font-bold">
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
            Surface reconnaissance, equipment blueprints, combat mechanics, and verified intel for {matchedCategory.toLowerCase()}.
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
        <div className="text-center py-20 bg-slate-900/90 border border-slate-800 rounded-[2rem] p-8 space-y-4 shadow-xl">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/30 mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            No Intel In This Sector Yet
          </h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
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

      {/* Newsletter */}
      <NewsletterCard />
    </div>
  );
}
