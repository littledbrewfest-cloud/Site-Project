import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import CategoryBadge from "./CategoryBadge";
import { DEFAULT_FALLBACK_IMAGE } from "@/lib/constants";

interface PostCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    coverImageUrl?: string | null;
    category: string;
    publishedAt?: Date | string | null;
    createdAt?: Date | string;
    content?: string;
  };
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  const dateToFormat = post.publishedAt || post.createdAt;
  const formattedDate = dateToFormat
    ? new Date(dateToFormat).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently published";

  // Calculate estimated reading time
  const wordCount = post.content ? post.content.split(/\s+/).length : 600;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const imageUrl = post.coverImageUrl || DEFAULT_FALLBACK_IMAGE;

  if (featured) {
    return (
      <article className="group relative grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300">
        <div className="lg:col-span-7 relative min-h-[300px] sm:min-h-[400px] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
          
          <div className="absolute top-5 left-5 z-10">
            <CategoryBadge category={post.category} />
          </div>

          <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center gap-3 text-xs text-white/90 font-medium">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-950/50">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Cover Story</span>
            </div>

            <Link href={`/blog/${post.slug}`} className="block group/title">
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors line-clamp-3 leading-tight">
                {post.title}
              </h2>
            </Link>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-4">
              {post.excerpt}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                AI
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">Nova Engine</p>
                <p className="text-[10px] text-slate-400">Autonomous Author</p>
              </div>
            </div>

            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 group/btn transition-all"
            >
              <span>Read Story</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-all duration-300">
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute top-3.5 left-3.5 z-10">
          <CategoryBadge category={post.category} size="sm" />
        </div>

        <div className="absolute bottom-3 right-3 z-10">
          <span className="px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-md text-white text-[11px] font-medium flex items-center gap-1 border border-white/10">
            <Clock className="w-3 h-3 text-blue-400" />
            {readTime}m read
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </div>

          <Link href={`/blog/${post.slug}`} className="block group/title">
            <h3 className="font-bold text-lg leading-snug text-slate-900 dark:text-white group-hover/title:text-blue-600 dark:group-hover/title:text-blue-400 transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-medium">By NovaBlog AI</span>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group/link"
          >
            <span>Read Article</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
