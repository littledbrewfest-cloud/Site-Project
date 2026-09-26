import { getSiteUrl } from "./site-url";

export interface FAQItem {
  question: string;
  answer: string;
}

export function extractFaqsFromMarkdown(markdown: string): FAQItem[] {
  if (!markdown) return [];
  const faqs: FAQItem[] = [];

  const faqSectionMatch = markdown.match(/##\s*Frequently Asked Questions[\s\S]*?(?=\n##\s*|$)/i);
  if (!faqSectionMatch) return [];

  const faqText = faqSectionMatch[0];
  const qMatches = [...faqText.matchAll(/###\s*(?:Q\d*[:.]?\s*)?(.*?)\n([\s\S]*?)(?=\n###|\n##|$)/gi)];

  for (const match of qMatches) {
    const rawQ = match[1] || "";
    const rawA = match[2] || "";

    const question = rawQ.replace(/^\d+[\.\)]\s*/, "").trim();
    const answer = rawA
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`#]/g, "")
      .trim();

    if (question && answer) {
      faqs.push({ question, answer });
    }
  }

  return faqs;
}

export function buildArticleSchemas(post: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags?: string | null;
  coverImageUrl?: string | null;
  createdAt: string | Date;
  publishedAt?: string | Date | null;
  updatedAt?: string | Date | null;
}) {
  const siteUrl = getSiteUrl();
  const postFullUrl = `${siteUrl}/${post.slug}`;
  const coverUrl = post.coverImageUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80";

  const faqs = extractFaqsFromMarkdown(post.content || "");

  const blogPostingSchema = {
    "@type": "BlogPosting",
    "@id": `${postFullUrl}#article`,
    headline: post.title,
    description: post.excerpt,
    image: [coverUrl],
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date(post.createdAt).toISOString(),
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : new Date().toISOString(),
    inLanguage: "en-US",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postFullUrl,
    },
    author: {
      "@type": "Person",
      name: "The ARC Raiders Editorial Staff",
      url: `${siteUrl}/about`,
      jobTitle: "Senior Extraction Shooter Strategists",
      sameAs: [
        "https://twitter.com/ARC_Raiders_Hub",
        `${siteUrl}/about`,
        `${siteUrl}/editorial-policy`,
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "The ARC Raiders Hub",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/icon.svg`,
      },
    },
    articleSection: post.category,
    keywords: post.tags,
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@id": `${postFullUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: post.category,
        item: `${siteUrl}/category/${post.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postFullUrl,
      },
    ],
  };

  const graph: any[] = [blogPostingSchema, breadcrumbSchema];

  if (faqs.length > 0) {
    const faqSchema = {
      "@type": "FAQPage",
      "@id": `${postFullUrl}#faq`,
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    };
    graph.push(faqSchema);
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}
