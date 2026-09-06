import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getSafePublishedPosts } from "@/lib/db-helper";
import { getActiveCategories } from "@/lib/settings";
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
  const decodedCategory = decodeURIComponent(params.category);
  const formattedCategory = decodedCategory
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    title: `${formattedCategory} Articles & In-Depth Insights`,
    description: `Browse all curated and automatically published articles in the ${formattedCategory} category on NovaBlog AI.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const decodedCategory = decodeURIComponent(params.category);
  const allCategories = await getActiveCategories();

  // Match case-insensitively with active categories
  const matchedCategory = allCategories.find(
    (c) => c.toLowerCase() === decodedCategory.toLowerCase()
  ) || decodedCategory;

  // Query posts matching this category safely
  const allPublished = await getSafePublishedPosts();
  const posts = allPublished.filter(
    (p) => p.category.toLowerCase() === matchedCategory.toLowerCase()
  );

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
        <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-600 dark:text-slate-300">
          Categories
        </span>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-blue-600 dark:text-blue-400 font-bold">
          {matchedCategory}
        </span>
      </nav>

      {/* Category Hero Banner */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-8 sm:p-12 lg:p-14 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="flex items-center gap-2.5">
            <CategoryBadge category={matchedCategory} isLink={false} />
            <span className="text-xs font-semibold text-blue-200 px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm">
              {posts.length} {posts.length === 1 ? "Story" : "Stories Published"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {matchedCategory}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Curated coverage, automated analyses, and cutting-edge perspectives covering {matchedCategory.toLowerCase()}.
          </p>

          {/* Quick Category Jump Pills */}
          <div className="pt-4 border-t border-white/10 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="text-slate-400 font-semibold mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              Other Topics:
            </span>
            {allCategories
              .filter((c) => c.toLowerCase() !== matchedCategory.toLowerCase())
              .map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${encodeURIComponent(cat.toLowerCase())}`}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-colors whitespace-nowrap backdrop-blur-sm border border-white/10"
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
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-[2rem] p-8 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 mx-auto flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            No articles in this category yet
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Our autonomous AI agent publishes fresh articles daily. Content for {matchedCategory} is queued for the upcoming cycle.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-xs font-bold hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
          >
            Explore All Stories
          </Link>
        </div>
      )}

      {/* Newsletter */}
      <NewsletterCard />
    </div>
  );
}
