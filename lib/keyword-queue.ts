import fs from "fs";
import path from "path";
import prisma from "./prisma";

export interface QueuedKeyword {
  id: string;
  keyword: string;
  difficulty: number;
  volume: number;
  category: string;
  status: "pending" | "published";
}

const KEYWORDS_FILE = path.join(process.cwd(), "data", "keywords.json");

/**
 * Loads all keywords from the queue file.
 */
export function getAllQueuedKeywords(): QueuedKeyword[] {
  try {
    if (fs.existsSync(KEYWORDS_FILE)) {
      const data = fs.readFileSync(KEYWORDS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("Failed to load keywords.json:", err);
  }
  return [];
}

/**
 * Gets the next high-priority pending keyword (Lowest KD first, highest volume first)
 * that has not yet been published on the site.
 */
export async function getNextKeywordToPublish(): Promise<QueuedKeyword | null> {
  const allKeywords = getAllQueuedKeywords();
  if (allKeywords.length === 0) return null;

  // Fetch all existing published post titles and slugs from DB
  const existingPosts = await prisma.post.findMany({
    select: { title: true, slug: true },
  });

  const existingTitles = existingPosts.map((p) => p.title.toLowerCase());
  const existingSlugs = existingPosts.map((p) => p.slug.toLowerCase());

  // Find first keyword that isn't already covered
  for (const item of allKeywords) {
    const kwLower = item.keyword.toLowerCase();
    const isPublished =
      existingTitles.some((t) => t.includes(kwLower) || kwLower.includes(t)) ||
      existingSlugs.some((s) => s.includes(kwLower.replace(/\s+/g, "-")));

    if (!isPublished) {
      return item;
    }
  }

  // Fallback to the first item if all match
  return allKeywords[0] || null;
}
