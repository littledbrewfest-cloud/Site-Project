"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  LogOut,
  Layers,
  FileText,
  CheckCircle,
  FileQuestion,
  Settings,
  RefreshCw,
  Search,
  Zap,
} from "lucide-react";
import CategoryBadge from "@/components/CategoryBadge";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string;
  status: string;
  createdAt: string;
  publishedAt: string | null;
}

interface AdminDashboardClientProps {
  initialPosts: Post[];
  initialCategories: string[];
}

export default function AdminDashboardClient({
  initialPosts,
  initialCategories,
}: AdminDashboardClientProps) {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [newCategory, setNewCategory] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generationCategory, setGenerationCategory] = useState<string>("");
  const [generationLog, setGenerationLog] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Logout handler
  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  // Generate Post Now handler
  const handleGeneratePost = async () => {
    setGenerating(true);
    setGenerationLog("⚡ Initializing Google Gemini Flash AI Engine...");

    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: generationCategory || undefined }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setGenerationLog(`🎉 Successfully synthesized and published: "${data.post.title}" (${data.post.category})`);
        // Refresh posts list
        const updatedPostsRes = await fetch("/api/admin/posts");
        const updatedPostsData = await updatedPostsRes.json();
        if (updatedPostsData.posts) {
          setPosts(
            updatedPostsData.posts.map((p: Post) => ({
              ...p,
              createdAt: p.createdAt,
              publishedAt: p.publishedAt,
            }))
          );
        }
      } else {
        setGenerationLog(`❌ Generation error: ${data.error || "Failed to generate post."}`);
      }
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "An error occurred";
      setGenerationLog(`❌ Network error: ${errMsg}`);
    } finally {
      setGenerating(false);
    }
  };

  // Toggle draft / published status
  const handleToggleStatus = async (post: Post) => {
    const nextStatus = post.status === "published" ? "draft" : "published";
    setActionLoadingId(post.id);

    try {
      const res = await fetch("/api/admin/posts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: post.id, status: nextStatus }),
      });

      if (res.ok) {
        setPosts((prev) =>
          prev.map((p) => (p.id === post.id ? { ...p, status: nextStatus } : p))
        );
      }
    } catch (err) {
      console.error("Failed to toggle status:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete post handler
  const handleDeletePost = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete post:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Category management handlers
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newCategory.trim();
    if (!clean || categories.includes(clean)) return;

    const updated = [...categories, clean];
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories: updated }),
    });

    if (res.ok) {
      setCategories(updated);
      setNewCategory("");
    }
  };

  const handleRemoveCategory = async (catToRemove: string) => {
    if (categories.length <= 1) {
      alert("You must retain at least one category.");
      return;
    }

    const updated = categories.filter((c) => c !== catToRemove);
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categories: updated }),
    });

    if (res.ok) {
      setCategories(updated);
    }
  };

  // Filtered posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPublished = posts.filter((p) => p.status === "published").length;
  const totalDrafts = posts.filter((p) => p.status === "draft").length;

  return (
    <div className="space-y-12">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold mb-2">
            <Zap className="w-3.5 h-3.5" />
            Control Center Active
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Trigger on-demand AI content generation, manage publications, and tune topic rotation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 shadow-sm transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 shadow-inner">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Articles</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{posts.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 shadow-inner">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Published</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalPublished}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 shadow-inner">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Drafts</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalDrafts}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 shadow-inner">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Topics</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{categories.length}</p>
          </div>
        </div>
      </div>

      {/* Action Banner: Generate New Post Now */}
      <div className="p-6 sm:p-10 rounded-[2.5rem] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Direct AI Generator
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Instant Article Synthesizer</h2>
            <p className="text-blue-100 text-sm max-w-xl">
              Trigger Google Gemini Flash to write and publish a 1000+ word, SEO-structured article with high-res Unsplash imagery instantly.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={generationCategory}
              onChange={(e) => setGenerationCategory(e.target.value)}
              className="px-4 py-3 rounded-2xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white font-medium"
            >
              <option value="" className="text-slate-900">
                Auto-Rotate Topics
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="text-slate-900">
                  {cat}
                </option>
              ))}
            </select>

            <button
              onClick={handleGeneratePost}
              disabled={generating}
              className="px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-extrabold rounded-2xl text-sm shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 hover:scale-105 active:scale-95"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>Generate Article Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {generationLog && (
          <div className="p-4 rounded-2xl bg-black/30 text-xs font-mono backdrop-blur-md border border-white/10 leading-relaxed">
            {generationLog}
          </div>
        )}
      </div>

      {/* Posts Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800/80 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Publication Stream
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Showing {filteredPosts.length} of {posts.length} total articles
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter articles..."
                className="pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-56"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published Only</option>
              <option value="draft">Drafts Only</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-6 sm:-mx-8">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-xs font-bold uppercase tracking-wider border-y border-slate-200/80 dark:border-slate-800/80">
              <tr>
                <th className="py-4 px-6 sm:px-8">Article Title</th>
                <th className="py-4 px-4">Topic</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4">Published</th>
                <th className="py-4 px-6 sm:px-8 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 sm:px-8 max-w-sm sm:max-w-md">
                    <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                      {post.title}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5 line-clamp-1">
                      /blog/{post.slug}
                    </p>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <CategoryBadge category={post.category} isLink={false} size="sm" />
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(post)}
                      disabled={actionLoadingId === post.id}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                        post.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800 hover:bg-amber-100"
                      }`}
                      title="Click to toggle status"
                    >
                      {post.status === "published" ? "● Published" : "○ Draft"}
                    </button>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  <td className="py-4 px-6 sm:px-8 text-right whitespace-nowrap space-x-2">
                    {post.status === "published" && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 inline-block transition-colors"
                        title="View live post"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}

                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 inline-block transition-colors"
                      title="Edit article"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDeletePost(post.id, post.title)}
                      disabled={actionLoadingId === post.id}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 inline-block disabled:opacity-50 transition-colors"
                      title="Delete article"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredPosts.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                    No articles found matching the current search filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Category Management Settings Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-2.5 text-slate-900 dark:text-white">
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Topic Rotation & Categories</h2>
            <p className="text-xs text-slate-400">
              The AI content engine automatically rotates through these categories.
            </p>
          </div>
        </div>

        {/* Existing Categories Badges */}
        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <div
              key={cat}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm"
            >
              <span>{cat}</span>
              <button
                onClick={() => handleRemoveCategory(cat)}
                className="text-slate-400 hover:text-rose-600 transition-colors text-sm font-extrabold"
                title={`Remove ${cat}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleAddCategory} className="flex gap-3 max-w-md">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add new topic (e.g. Gaming & Esports)"
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-blue-500/20 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Add Topic
          </button>
        </form>
      </div>
    </div>
  );
}
