"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Save,
  Eye,
  Edit3,
  CheckCircle,
  AlertCircle,
  FilePlus,
} from "lucide-react";
import { DEFAULT_FALLBACK_IMAGE } from "@/lib/constants";

interface NewPostClientProps {
  categories: string[];
}

export default function NewPostClient({ categories }: NewPostClientProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImageUrl: DEFAULT_FALLBACK_IMAGE,
    category: categories[0] || "ARC Raiders News",
    tags: "ARC Raiders, Guide, PS5, PC",
    status: "published",
  });

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setMessage({ type: "error", text: "Please fill in the title and content." });
      return;
    }

    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setMessage({ type: "success", text: "Article created and published successfully!" });
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1200);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create article." });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create article.";
      setMessage({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8 px-4 sm:px-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-amber-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full font-mono font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
            Manual Article Creator
          </span>
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black uppercase text-white flex items-center gap-2.5">
          <FilePlus className="w-7 h-7 text-amber-400" />
          <span>Write / Publish Client Article</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Publish a manual post or sponsored client guide directly to the live website.
        </p>
      </div>

      {/* Notification Message */}
      {message && (
        <div
          className={`p-4 rounded-2xl flex items-center gap-3 border text-sm font-semibold ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
              : "bg-rose-500/10 text-rose-300 border-rose-500/30"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
              Article Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., ARC Raiders Best Solo Loadouts & Survival Guide"
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
              Excerpt / Meta Description
            </label>
            <textarea
              rows={2}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              placeholder="A brief 1-2 sentence summary for Google search and social cards..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* 2-Column: Category + Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                Category / Sector *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                Publication Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="published">Published (Live Immediately)</option>
                <option value="draft">Draft (Saved in Dashboard)</option>
              </select>
            </div>
          </div>

          {/* 2-Column: Cover Image + Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                Cover Image URL
              </label>
              <input
                type="url"
                value={formData.coverImageUrl}
                onChange={(e) => setFormData({ ...formData, coverImageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 font-mono">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="ARC Raiders, Weapons, PS5, Tips"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Content Section with Tabs */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Article Body (Markdown Format) *
            </label>

            <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("edit")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "edit"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Write</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === "preview"
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Preview</span>
              </button>
            </div>
          </div>

          {activeTab === "edit" ? (
            <textarea
              rows={18}
              required
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your article in Markdown here... Use # for headings, - for bullets, and | for tables."
              className="w-full px-4 py-4 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-600 font-mono text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          ) : (
            <div className="prose prose-invert max-w-none p-6 rounded-xl bg-slate-950 border border-slate-800 min-h-[400px]">
              {formData.content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {formData.content}
                </ReactMarkdown>
              ) : (
                <p className="text-slate-600 italic">Preview will appear here once you write content.</p>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            href="/admin"
            className="px-6 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Publishing..." : "Publish Article Now"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
