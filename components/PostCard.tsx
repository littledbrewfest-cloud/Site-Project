import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, ArrowRight, Crosshair, Zap } from "lucide-react";
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
    readTime?: number;
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
  const readTime = post.readTime
    ? post.readTime
    : post.content
    ? Math.max(1, Math.ceil(post.content.split(/\s+/).length / 200))
    : 4;

  const imageUrl = post.coverImageUrl || DEFAULT_FALLBACK_IMAGE;

  if (featured) {
    return (
      <article className="group relative grid grid-cols-1 lg:grid-cols-12 gap-0 bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-amber-500/20 hover:border-amber-500/50 rounded-3xl overflow-hidden shadow-lg dark:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500">
        <div className="lg:col-span-7 relative min-h-[320px] sm:min-h-[420px] w-full overflow-hidden bg-slate-900">
          <Image
            src={imageUrl}
            alt={post.title}
            fill
            quality={80}
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none" />
          
          <div className="absolute top-5 left-5 z-10">
            <CategoryBadge category={post.category} />
          </div>

          <div className="absolute bottom-5 left-5 right-5 z-10 flex items-center gap-3 text-xs text-white font-medium">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
              <Calendar className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
              <Clock className="w-3.5 h-3.5 text-orange-400" aria-hidden="true" />
              <span>{readTime} min read</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between bg-slate-50/80 dark:bg-gradient-to-br dark:from-[#0c1222] dark:via-[#090e1a] dark:to-[#060a12] border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-slate-800/80">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 font-mono">
              <Zap className="w-3.5 h-3.5 animate-pulse text-amber-500" aria-hidden="true" />
              <span>Priority Intel Report</span>
            </div>

            <Link href={`/${post.slug}`} className="block group/title" aria-label={`Read featured guide: ${post.title}`}>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white group-hover/title:text-amber-700 dark:group-hover/title:text-amber-400 transition-colors line-clamp-3 leading-tight">
                {post.title}
              </h2>
            </Link>

            <p className="text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed line-clamp-4 font-normal">
              {post.excerpt}
            </p>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-600 via-orange-600 to-rose-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-amber-500/20">
                <Crosshair className="w-4 h-4" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">Speranza Vanguard</p>
                <p className="text-[10px] text-slate-600 dark:text-slate-400">Tactical Database</p>
              </div>
            </div>

            <Link
              href={`/${post.slug}`}
              aria-label={`Access guide: ${post.title}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-extrabold shadow-lg shadow-amber-500/20 group/btn transition-all cursor-pointer"
            >
              <span>Access Guide</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col bg-white dark:bg-[#0c1222]/90 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-amber-500/10 transition-all duration-300">
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-900">
        <Image
          src={imageUrl}
          alt={post.title}
          fill
          quality={80}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 pointer-events-none" />
        
        <div className="absolute top-3.5 left-3.5 z-10">
          <CategoryBadge category={post.category} size="sm" />
        </div>

        <div className="absolute bottom-3 right-3 z-10">
          <span className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[11px] font-semibold flex items-center gap-1.5 border border-white/10">
            <Clock className="w-3 h-3 text-amber-400" aria-hidden="true" />
            {readTime}m read
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
            <Calendar className="w-3.5 h-3.5 text-amber-600 dark:text-amber-500" aria-hidden="true" />
            <span>{formattedDate}</span>
          </div>

          <Link href={`/${post.slug}`} className="block group/title" aria-label={`Read guide: ${post.title}`}>
            <h3 className="font-bold text-lg leading-snug text-slate-900 dark:text-white group-hover/title:text-amber-700 dark:group-hover/title:text-amber-400 transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1">
            <Crosshair className="w-3 h-3 text-amber-600 dark:text-amber-500" aria-hidden="true" />
            <span>Field Dossier</span>
          </span>
          <Link
            href={`/${post.slug}`}
            aria-label={`Read guide: ${post.title}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 group/link cursor-pointer"
          >
            <span>Read Guide</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
