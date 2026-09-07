"use client";

import React, { useState, useMemo } from "react";
import { Search, Filter, BookOpen, Layers, SlidersHorizontal, Crosshair } from "lucide-react";
import PostCard from "./PostCard";
import NewsletterCard from "./NewsletterCard";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string | null;
  category: string;
  tags: string;
  publishedAt: string | null;
  createdAt: string;
}

interface BlogExplorerProps {
  initialPosts: Post[];
  categories: string[];
}

export default function BlogExplorer({ initialPosts, categories }: BlogExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "readTime">("newest");

  const filteredPosts = useMemo(() => {
    const list = initialPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();

      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch =
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "readTime") {
      return [...list].sort((a, b) => {
        const wordsA = (a.content || "").split(/\s+/).length;
        const wordsB = (b.content || "").split(/\s+/).length;
        return wordsB - wordsA;
      });
    }

    return list;
  }, [initialPosts, searchQuery, selectedCategory, sortBy]);

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const standardPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return (
    <div className="space-y-12">
      {/* Search and Category Filter Bar */}
      <div className="bg-[#0c1222] p-5 sm:p-7 rounded-3xl border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all ARC Raiders guides, weapons, spawn maps, quests..."
              className="w-full pl-11 pr-10 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs font-semibold text-slate-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-slate-400">Order:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "newest" | "readTime")}
                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-slate-900 text-white">Latest Dispatches</option>
                <option value="readTime" className="bg-slate-900 text-white">Long-Form Masterclasses</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm pt-1">
          <span className="flex items-center gap-1 font-bold text-slate-400 pl-1 mr-1 text-xs uppercase tracking-wider font-mono">
            <Filter className="w-3.5 h-3.5 text-amber-500" />
            Sectors:
          </span>
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-2xl font-bold transition-all whitespace-nowrap text-xs ${
              selectedCategory === "All"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/25 scale-105 font-extrabold"
                : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800"
            }`}
          >
            All Intel ({initialPosts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-2xl font-semibold transition-all whitespace-nowrap text-xs ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/25 scale-105 font-extrabold"
                  : "bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* No Results State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-20 bg-[#0c1222] border border-slate-800 rounded-3xl p-8 space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center border border-amber-500/20">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white">
            No surface intel discovered
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            We couldn&apos;t find any guides matching &quot;{searchQuery}&quot;. Try exploring other categories or clearing your search filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-xs font-extrabold hover:from-amber-400 hover:to-orange-500 shadow-md shadow-amber-500/20"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* Featured Story */}
      {featuredPost && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-mono font-black text-amber-400">
              <Crosshair className="w-4 h-4 animate-spin text-amber-400" />
              <span>{selectedCategory === "All" && !searchQuery ? "Flagship Surface Guide" : "Top Matching Intel"}</span>
            </div>
            <span className="text-xs text-slate-400 font-medium">Verified by Editorial Staff</span>
          </div>
          <PostCard post={featuredPost} featured={true} />
        </section>
      )}

      {/* Standard Post Grid */}
      {standardPosts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                {selectedCategory === "All" ? "Wasteland Tactical Archives" : `${selectedCategory} Dossiers`}
              </h2>
            </div>
            <span className="text-xs text-amber-400 font-semibold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
              {filteredPosts.length} Dossiers
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {standardPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Embedded Newsletter / Digest Section */}
      <NewsletterCard />
    </div>
  );
}
