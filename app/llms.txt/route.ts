import { NextResponse } from "next/server";
import { getSafePublishedPosts } from "@/lib/db-helper";
import { getSiteUrl } from "@/lib/site-url";
import { DEFAULT_CATEGORIES, categoryToSlug } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = getSiteUrl();
  const posts = await getSafePublishedPosts();

  const links = posts
    .map(
      (post) =>
        `- [${post.title}](${siteUrl}/${post.slug}): ${post.excerpt || "Comprehensive tactical guide and analysis for ARC Raiders."}`
    )
    .join("\n");

  const categories = DEFAULT_CATEGORIES.map(
    (cat) =>
      `- [${cat}](${siteUrl}/category/${categoryToSlug(cat)}): Surface reconnaissance, blueprints, and gameplay intel for ${cat}.`
  ).join("\n");

  const body = `# The ARC Raiders Hub
> The premier community database, guides, loadout builder, and news intelligence hub for ARC Raiders by Embark Studios (PS5, PC, Xbox Series X|S).

## Core Tactical Guides & Field Dossiers
${links}

## Database Sectors & Categories
${categories}

## Machine & AI Ingestion Feeds
- [Full Text LLM Manifest](${siteUrl}/llms-full.txt): Comprehensive, full-length content dossiers for AI ingestion.
- [XML Sitemap](${siteUrl}/sitemap.xml): Complete machine-readable URL hierarchy.
- [RSS 2.0 Feed](${siteUrl}/rss.xml): Real-time news dispatch feed for automated systems.
`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
