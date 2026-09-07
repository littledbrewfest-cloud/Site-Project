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
import ReadingProgressBar from "@/components/ReadingProgressBar";
import ArticleActions from "@/components/ArticleActions";
import TableOfContents from "@/components/TableOfContents";
import NewsletterCard from "@/components/NewsletterCard";
import { Calendar, Clock, Tag, Sparkles, ChevronRight, CheckCircle2 } from "lucide-react";
import { DEFAULT_FALLBACK_IMAGE, categoryToSlug } from "@/lib/constants";
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
      authors: [{ name: "The ARC Raiders Editorial Staff" }],
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
      title: "Tactical Intel Article | The ARC Raiders Hub",
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
  const postFullUrl = `${siteUrl}/blog/${post.slug}`;

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
      name: "The ARC Raiders Editorial Staff",
    },
    publisher: {
      "@type": "Organization",
      name: "The ARC Raiders Hub",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postFullUrl,
    },
    articleSection: post.category,
    keywords: post.tags,
  };

  return (
    <>
      {/* Scroll Reading Progress Bar */}
      <ReadingProgressBar />

      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <Link
            href={`/category/${categoryToSlug(post.category)}`}
            className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            {post.category}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
          <span className="text-slate-800 dark:text-slate-300 truncate max-w-xs sm:max-w-md">
            {post.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="space-y-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <CategoryBadge category={post.category} />
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <Calendar className="w-4 h-4 text-amber-500" />
              <time dateTime={new Date(post.createdAt).toISOString()}>{formattedDate}</time>
            </div>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              <Clock className="w-4 h-4 text-orange-500 dark:text-orange-400" />
              <span>{readTime} min read ({wordCount} words)</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] uppercase">
            {post.title}
          </h1>

          <p className="text-lg sm:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
            {post.excerpt}
          </p>

          {/* Author Badge */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-orange-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-amber-500/20">
              ARC
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  ARC Raiders Editorial Team
                </span>
                <CheckCircle2 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Senior Gaming Editors &amp; Verified PvPvE Meta Analysts
              </p>
            </div>
          </div>
        </header>

        {/* Featured Cover Image */}
        <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden shadow-xl dark:shadow-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Image
            src={coverUrl}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1100px"
            className="object-cover"
          />
        </div>

        {/* 2-Column Grid: Main Content + Sticky Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Article Content */}
          <div className="lg:col-span-8 space-y-10">
            {/* Top Share Widget */}
            <ArticleActions title={post.title} url={postFullUrl} />

            {/* Markdown Body with auto IDs on Headings for Table of Contents & Responsive Tables */}
            <article className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed sm:leading-[1.85] text-slate-800 dark:text-slate-200">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => {
                    const text = String(children);
                    const id = text
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, "")
                      .replace(/\s+/g, "-");
                    return (
                      <h2 id={id} className="scroll-mt-24 text-2xl sm:text-3xl font-black text-amber-700 dark:text-amber-400 mt-12 mb-5 pb-3 border-b border-slate-200 dark:border-slate-800/80 flex items-center gap-2">
                        <span className="w-1.5 h-6 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full inline-block" />
                        <span>{children}</span>
                      </h2>
                    );
                  },
                  h3: ({ children }) => {
                    const text = String(children);
                    const id = text
                      .toLowerCase()
                      .replace(/[^\w\s-]/g, "")
                      .replace(/\s+/g, "-");
                    return (
                      <h3 id={id} className="scroll-mt-24 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-8 mb-3">
                        {children}
                      </h3>
                    );
                  },
                  table: ({ children }) => (
                    <div className="table-wrapper my-8 overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl bg-white dark:bg-slate-950/60">
                      <table className="w-full text-left border-collapse">{children}</table>
                    </div>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </article>

            {/* Tags Section */}
            {tagsList.length > 0 && (
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  Related ARC Raiders Topics
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tagsList.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-slate-100 dark:bg-slate-900/90 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors border border-slate-200 dark:border-slate-800"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Share Widget */}
            <div className="pt-4">
              <ArticleActions title={post.title} url={postFullUrl} />
            </div>

            {/* Newsletter CTA */}
            <NewsletterCard />
          </div>

          {/* Sticky Sidebar */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Table of Contents */}
            <TableOfContents content={post.content || ""} />

            {/* Editorial Team Spotlight */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-600 to-rose-600 text-white flex items-center justify-center font-bold text-base shadow-md shadow-amber-500/25">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    ARC Raiders Editorial Staff
                  </h4>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold font-mono">
                    Official Guides &amp; News Team
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Researched, written, and fact-checked by our dedicated gaming writers covering ARC Raiders weapon balance, boss guides, extraction tactics, and performance on PS5, PC, and Xbox.
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium font-mono">
                <span>Review: Passed</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">● Updated 2026</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="pt-16 border-t border-slate-200 dark:border-slate-800 space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                  Continue Reading in {post.category}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Tactical field guides and related intelligence
                </p>
              </div>

              <Link
                href={`/category/${categoryToSlug(post.category)}`}
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:underline px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 transition-colors"
              >
                View Category →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
