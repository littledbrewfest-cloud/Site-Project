"use client";

import React, { useState, useMemo, useRef } from "react";
import { ChevronLeft, ChevronRight, Layers } from "lucide-react";
import PostCard from "./PostCard";

interface CategoryPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  readTime?: number;
  coverImageUrl: string | null;
  category: string;
  tags?: string | null;
  publishedAt: string | Date | null;
  createdAt: string | Date;
}

interface CategoryPostsGridProps {
  posts: CategoryPost[];
  categoryName: string;
}

const POSTS_PER_PAGE = 12;

export default function CategoryPostsGrid({ posts, categoryName }: CategoryPostsGridProps) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const gridTopRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const paginatedPosts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * POSTS_PER_PAGE;
    return posts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  }, [posts, safeCurrentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (gridTopRef.current) {
      gridTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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

  const startItem = posts.length > 0 ? (safeCurrentPage - 1) * POSTS_PER_PAGE + 1 : 0;
  const endItem = Math.min(safeCurrentPage * POSTS_PER_PAGE, posts.length);

  return (
    <div ref={gridTopRef} className="space-y-8 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-500" />
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            {categoryName} Dossiers
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
            Showing {startItem}–{endItem} of {posts.length}
          </span>
          <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
            Page {safeCurrentPage} of {totalPages}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paginatedPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {totalPages > 1 && (
        <nav
          aria-label={`${categoryName} Pagination`}
          className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Displaying <span className="font-bold text-slate-800 dark:text-slate-200">{paginatedPosts.length}</span> dossiers on Page <span className="font-bold text-amber-600 dark:text-amber-400">{safeCurrentPage}</span> of {totalPages}
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
    </div>
  );
}
