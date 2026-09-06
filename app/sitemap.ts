import { MetadataRoute } from "next";
import { getSafePublishedPosts } from "@/lib/db-helper";
import { getActiveCategories } from "@/lib/settings";
import { getSiteUrl } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();

  // Fetch all published posts safely
  const posts = await getSafePublishedPosts();
  const categories = await getActiveCategories();

  const postUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const categoryUrls: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${siteUrl}/category/${encodeURIComponent(cat.toLowerCase())}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.6,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    ...categoryUrls,
    ...postUrls,
  ];
}
