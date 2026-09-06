import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getSafePublishedPosts } from "@/lib/db-helper";
import { getActiveCategories } from "@/lib/settings";
import PostCard from "@/components/PostCard";
import CategoryBadge from "@/components/CategoryBadge";
import { ArrowLeft, BookOpen } from "lucide-react";

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
    title: `${formattedCategory} Articles & Insights`,
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
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Categories
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <CategoryBadge category={matchedCategory} isLink={false} />
              <span className="text-xs font-semibold text-slate-400">
                {posts.length} {posts.length === 1 ? "article" : "articles"}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {matchedCategory}
            </h1>
          </div>

          {/* Other Categories Links */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {allCategories
              .filter((c) => c.toLowerCase() !== matchedCategory.toLowerCase())
              .slice(0, 4)
              .map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${encodeURIComponent(cat.toLowerCase())}`}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full font-medium hover:bg-slate-200 dark:hover:bg-slate-700 whitespace-nowrap"
                >
                  {cat}
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 mx-auto flex items-center justify-center">
            <BookOpen className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            No articles in this category yet
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Our autonomous AI agent will publish content in {matchedCategory} during the next scheduled cycle.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-md shadow-blue-500/20"
          >
            Explore All Articles
          </Link>
        </div>
      )}
    </div>
  );
}
