import { NextResponse } from "next/server";
import { getSafePublishedPosts } from "@/lib/db-helper";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSiteUrl();
  const posts = await getSafePublishedPosts();

  const articlesBlock = posts
    .map((post) => {
      const cleanContent = (post.content || "").replace(/^(#{1,6}\s+)\d+[\.\)]\s+/gm, "$1");
      return `---
Title: ${post.title}
URL: ${siteUrl}/${post.slug}
Category: ${post.category}
Tags: ${post.tags || ""}
Published: ${post.publishedAt || post.createdAt}

${cleanContent}
---`;
    })
    .join("\n\n");

  const body = `# The ARC Raiders Hub - Complete LLM Context Knowledge Base
Domain: ${siteUrl}
Description: Comprehensive knowledge base of ARC Raiders gameplay mechanics, weapon loadout tier lists, Speranza colony maps, and boss strategies.

${articlesBlock}
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
