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
    setGenerationLog("Connecting to Gemini AI Engine and selecting topic...");

    try {
      const res = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: generationCategory || undefined }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setGenerationLog(`✅ Successfully created: "${data.post.title}" (${data.post.category})`);
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
    <div className="space-y-10">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500">
            Control automated post generation, manage publications, and configure topics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Articles</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{posts.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Published</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalPublished}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Drafts</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{totalDrafts}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Active Topics</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">{categories.length}</p>
          </div>
        </div>
      </div>

      {/* Action Banner: Generate New Post Now */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Direct AI Generator
            </div>
            <h2 className="text-2xl font-bold">Generate New Post Now</h2>
            <p className="text-blue-100 text-sm max-w-xl">
              Trigger the Gemini AI engine immediately. It will choose the next category automatically or you can select a specific topic below.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={generationCategory}
              onChange={(e) => setGenerationCategory(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="" className="text-slate-900">
                Auto-Rotate Categories
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
              className="px-6 py-2.5 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {generating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Post
                </>
              )}
            </button>
          </div>
        </div>

        {generationLog && (
          <div className="mt-4 p-3.5 rounded-xl bg-black/25 text-xs font-mono backdrop-blur-md border border-white/10">
            {generationLog}
          </div>
        )}
      </div>

      {/* Posts Management Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Article Management ({filteredPosts.length})
          </h2>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-48"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-y border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3.5 px-6">Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Created</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-6 max-w-sm sm:max-w-md">
                    <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">
                      {post.title}
                    </p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5 line-clamp-1">
                      /blog/{post.slug}
                    </p>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <CategoryBadge category={post.category} isLink={false} />
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(post)}
                      disabled={actionLoadingId === post.id}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border transition-all ${
                        post.status === "published"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                      }`}
                      title="Click to toggle status"
                    >
                      {post.status === "published" ? "● Published" : "○ Draft"}
                    </button>
                  </td>

                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>

                  <td className="py-4 px-6 text-right whitespace-nowrap space-x-2">
                    {post.status === "published" && (
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-blue-600 inline-block"
                        title="View live post"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}

                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 inline-block"
                      title="Edit article"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => handleDeletePost(post.id, post.title)}
                      disabled={actionLoadingId === post.id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 inline-block disabled:opacity-50"
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
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white">
          <Settings className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold">Topic Rotation & Categories</h2>
        </div>
        <p className="text-sm text-slate-500">
          The autonomous AI content engine cycles through these categories. You can add new topic domains or remove existing ones.
        </p>

        {/* Existing Categories Badges with Remove */}
        <div className="flex flex-wrap gap-2.5">
          {categories.map((cat) => (
            <div
              key={cat}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-200"
            >
              <span>{cat}</span>
              <button
                onClick={() => handleRemoveCategory(cat)}
                className="text-slate-400 hover:text-rose-600 transition-colors"
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
            placeholder="New Category Name (e.g. Artificial Intelligence)"
            className="flex-1 px-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
