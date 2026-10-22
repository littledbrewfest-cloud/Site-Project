"use client";

import React, { useState, useMemo, useRef } from "react";
import { Search, Filter, BookOpen, Layers, SlidersHorizontal, Crosshair, ChevronLeft, ChevronRight } from "lucide-react";
import PostCard from "./PostCard";
import NewsletterCard from "./NewsletterCard";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  readTime: number;
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

const POSTS_PER_PAGE = 12;

export default function BlogExplorer({ initialPosts, categories }: BlogExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"newest" | "readTime">("newest");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const archiveTopRef = useRef<HTMLDivElement>(null);

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
      return [...list].sort((a, b) => (b.readTime || 4) - (a.readTime || 4));
    }

    return list;
  }, [initialPosts, searchQuery, selectedCategory, sortBy]);

  const featuredPost = filteredPosts.length > 0 ? filteredPosts[0] : null;
  const standardPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  const totalPages = Math.max(1, Math.ceil(standardPosts.length / POSTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedStandardPosts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * POSTS_PER_PAGE;
    return standardPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [standardPosts, safeCurrentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (archiveTopRef.current) {
      archiveTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Generate visible page numbers with ellipsis for mobile & desktop
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (safeCurrentPage > 3) pages.push("...");
      const start = Math.max(2, safeCurrentPage - 1);
      const end = Math.min(totalPages - 1, safeCurrentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (safeCurrentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  const startItem = standardPosts.length > 0 ? (safeCurrentPage - 1) * POSTS_PER_PAGE + 1 : 0;
  const endItem = Math.min(safeCurrentPage * POSTS_PER_PAGE, standardPosts.length);

  return (
    <div ref={archiveTopRef} className="space-y-12 scroll-mt-24">
      {/* Search and Category Filter Bar */}
      <div className="bg-white dark:bg-[#0c1222] p-5 sm:p-7 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1">
            <label htmlFor="guide-search-input" className="sr-only">
              Search ARC Raiders guides, weapons, maps, quests
            </label>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-600 dark:text-amber-500" aria-hidden="true" />
            <input
              id="guide-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search across all ARC Raiders guides, weapons, spawn maps, quests..."
              aria-label="Search across all ARC Raiders guides, weapons, spawn maps, quests"
              className="w-full pl-11 pr-10 py-3 bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all text-sm font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setCurrentPage(1);
                }}
                aria-label="Clear search query"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
              <label htmlFor="guide-sort-select" className="text-slate-700 dark:text-slate-300 font-medium">
                Order:
              </label>
              <select
                id="guide-sort-select"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as "newest" | "readTime");
                  setCurrentPage(1);
                }}
                aria-label="Sort articles by order"
                className="bg-transparent text-slate-900 dark:text-white font-bold focus:outline-none cursor-pointer"
              >
                <option value="newest" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Latest Dispatches</option>
                <option value="readTime" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Long-Form Masterclasses</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs sm:text-sm pt-1">
          <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300 pl-1 mr-1 text-xs uppercase tracking-wider font-mono">
            <Filter className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" aria-hidden="true" />
            Sectors:
          </span>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setCurrentPage(1);
            }}
            aria-label={`Show all intel categories (${initialPosts.length} total articles)`}
            className={`px-4 py-2 rounded-2xl font-bold transition-all whitespace-nowrap text-xs cursor-pointer ${
              selectedCategory === "All"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/25 scale-105 font-extrabold"
                : "bg-slate-100 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
            }`}
          >
            All Intel ({initialPosts.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              aria-label={`Filter by category ${cat}`}
              className={`px-4 py-2 rounded-2xl font-semibold transition-all whitespace-nowrap text-xs cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/25 scale-105 font-extrabold"
                  : "bg-slate-100 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* No Results State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-20 bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 space-y-4 shadow-md dark:shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 mx-auto flex items-center justify-center border border-amber-500/20">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No surface intel discovered
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            We couldn&apos;t find any guides matching &quot;{searchQuery}&quot;. Try exploring other categories or clearing your search filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setCurrentPage(1);
            }}
            className="mt-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-xs font-extrabold hover:from-amber-400 hover:to-orange-500 shadow-md shadow-amber-500/20"
          >
            Reset all filters
          </button>
        </div>
      )}

      {/* Featured Story (Shown on Page 1) */}
      {featuredPost && safeCurrentPage === 1 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-mono font-black text-amber-600 dark:text-amber-400">
              <Crosshair className="w-4 h-4 animate-spin text-amber-500" />
              <span>{selectedCategory === "All" && !searchQuery ? "Flagship Surface Guide" : "Top Matching Intel"}</span>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verified by Editorial Staff</span>
          </div>
          <PostCard post={featuredPost} featured={true} />
        </section>
      )}

      {/* Standard Post Grid with 12-per-page Pagination */}
      {standardPosts.length > 0 && (
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-500" />
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
                {selectedCategory === "All" ? "Wasteland Tactical Archives" : `${selectedCategory} Dossiers`}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Showing {startItem}–{endItem} of {standardPosts.length}
              </span>
              <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                Page {safeCurrentPage} of {totalPages}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginatedStandardPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <nav
              aria-label="Articles Pagination"
              className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                Displaying <span className="font-bold text-slate-800 dark:text-slate-200">{paginatedStandardPosts.length}</span> tactical dossiers on Page <span className="font-bold text-amber-600 dark:text-amber-400">{safeCurrentPage}</span> of {totalPages}
              </p>

              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                <button
                  onClick={() => handlePageChange(safeCurrentPage - 1)}
                  disabled={safeCurrentPage <= 1}
                  aria-label="Previous Page"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 py-1 text-xs font-bold text-slate-400 dark:text-slate-600 select-none"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      aria-label={`Go to page ${page}`}
                      aria-current={safeCurrentPage === page ? "page" : undefined}
                      className={`min-w-[36px] h-9 px-2.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                        safeCurrentPage === page
                          ? "bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md shadow-amber-500/25 scale-105"
                          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(safeCurrentPage + 1)}
                  disabled={safeCurrentPage >= totalPages}
                  aria-label="Next Page"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-400 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-sm"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </nav>
          )}
        </section>
      )}

      {/* Embedded Newsletter / Digest Section */}
      <NewsletterCard />
    </div>
  );
}
