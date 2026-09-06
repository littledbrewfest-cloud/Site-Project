import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getSafePostBySlug, getSafePublishedPosts, SAMPLE_FALLBACK_POSTS } from "@/lib/db-helper";
import CategoryBadge from "@/components/CategoryBadge";
import PostCard from "@/components/PostCard";
import { Calendar, Clock, ArrowLeft, Tag, Sparkles } from "lucide-react";
import { DEFAULT_FALLBACK_IMAGE } from "@/lib/constants";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

interface PostPageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const post = (await getSafePostBySlug(params?.slug || "")) || SAMPLE_FALLBACK_POSTS[0];

    const siteUrl = getSiteUrl();
    const postUrl = `${siteUrl}/blog/${post.slug}`;
    const imageUrl = post.coverImageUrl || DEFAULT_FALLBACK_IMAGE;

    return {
      title: post.title,
      description: post.excerpt,
      keywords: post.tags ? post.tags.split(",").map((t) => t.trim()) : [],
      authors: [{ name: "NovaBlog AI" }],
      alternates: {
        canonical: postUrl,
      },
      openGraph: {
        type: "article",
        url: postUrl,
        title: post.title,
        description: post.excerpt,
        publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
        modifiedTime: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
        section: post.category,
        tags: post.tags ? post.tags.split(",").map((t) => t.trim()) : [],
        images: [
          {
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: post.title,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: [imageUrl],
      },
    };
  } catch {
    return {
      title: "Article | NovaBlog AI",
    };
  }
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const slug = params?.slug ? String(params.slug) : "";
  const post = await getSafePostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Fetch all published posts for related section
  const allPublished = await getSafePublishedPosts();
  const relatedPosts = allPublished
    .filter((p) => p.category.toLowerCase() === post.category.toLowerCase() && p.slug !== post.slug)
    .slice(0, 3);

  const formattedDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : new Date(post.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

  const wordCount = post.content ? post.content.split(/\s+/).length : 500;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const coverUrl = post.coverImageUrl || DEFAULT_FALLBACK_IMAGE;
  const tagsList = post.tags
    ? post.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const siteUrl = getSiteUrl();

  // JSON-LD Structured Data Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: coverUrl,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date(post.createdAt).toISOString(),
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "NovaBlog AI Engine",
    },
    publisher: {
      "@type": "Organization",
      name: "NovaBlog AI",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: post.tags,
  };

  return (
    <>
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto space-y-10">
        {/* Back navigation */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Articles
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <CategoryBadge category={post.category} />
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="w-4 h-4" />
              <time dateTime={new Date(post.createdAt).toISOString()}>{formattedDate}</time>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4" />
              <span>{readTime} min read</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            {post.title}
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                NovaBlog Autonomous Engine
              </span>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-800">
          <Image
            src={coverUrl}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
          />
        </div>

        {/* Markdown Article Content */}
        <article className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-2xl">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </article>

        {/* Tags Section */}
        {tagsList.length > 0 && (
          <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Article Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {tagsList.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="pt-12 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                More in {post.category}
              </h3>
              <Link
                href={`/category/${encodeURIComponent(post.category.toLowerCase())}`}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relPost) => (
                <PostCard key={relPost.id} post={relPost} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
