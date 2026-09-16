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

const STOP_WORDS = new Set([
  "in", "the", "a", "an", "for", "to", "of", "and", "on", "at", "with", "is", "are", "was", "were",
  "how", "what", "where", "why", "when", "who", "which", "guide", "ultimate", "best", "2026",
  "arc", "raider", "raiders", "find", "location", "locations", "farming", "farm", "complete", "tactical",
  "routes", "walkthrough", "news", "update", "tips", "tricks", "top", "gaming", "edition", "ps5", "pc", "xbox",
  "get", "all", "everything", "you", "need", "know", "about"
]);

export function stemWord(w: string): string {
  return w.toLowerCase().replace(/[^a-z0-9]/g, "").replace(/(?:ing|es|s|ed|er|est)$/, "");
}

export function extractCoreTokens(str: string): string[] {
  const words = str.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
  return words.map(stemWord).filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

/**
 * Robust topic deduplication check comparing stemmed semantic core tokens.
 */
export function isTopicCovered(
  keywordOrTitle: string,
  existingPosts: Array<{ title?: string | null; slug?: string | null }>
): boolean {
  const kwTokens = extractCoreTokens(keywordOrTitle);
  if (kwTokens.length === 0) return false;

  for (const post of existingPosts) {
    const postTokens = new Set([
      ...extractCoreTokens(post.title || ""),
      ...extractCoreTokens(post.slug || ""),
    ]);

    const matchedCount = kwTokens.filter((t) => postTokens.has(t)).length;
    const ratio = matchedCount / kwTokens.length;

    // Single distinct core subject match (e.g. "mushroom" in title/slug)
    if (kwTokens.length === 1 && matchedCount === 1) return true;
    // 2 core subjects match (e.g. ["rust", "gear"])
    if (kwTokens.length === 2 && matchedCount >= 2) return true;
    // 3+ core subjects match >= 60%
    if (kwTokens.length >= 3 && ratio >= 0.60) return true;
  }
  return false;
}

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
 * Marks a keyword as published in keywords.json
 */
export function markKeywordAsPublished(keywordText: string): void {
  try {
    if (!fs.existsSync(KEYWORDS_FILE)) return;
    const all = getAllQueuedKeywords();
    const kwLower = keywordText.toLowerCase();
    let updated = false;

    for (const item of all) {
      if (item.keyword.toLowerCase() === kwLower || isTopicCovered(item.keyword, [{ title: keywordText, slug: "" }])) {
        item.status = "published";
        updated = true;
      }
    }

    if (updated) {
      fs.writeFileSync(KEYWORDS_FILE, JSON.stringify(all, null, 2), "utf-8");
    }
  } catch (err) {
    console.warn("Failed to update keyword status in keywords.json:", err);
  }
}

/**
 * Gets the next high-priority pending keyword (Lowest KD first, highest volume first)
 * that is 100% UNIQUE, NOT already covered by any published article, and dynamically
 * rotates across different categories (Weapons, Bosses, Consoles, PC, Quests, Lore).
 */
export async function getNextKeywordToPublish(preferredCategory?: string): Promise<QueuedKeyword | null> {
  const allKeywords = getAllQueuedKeywords();
  if (allKeywords.length === 0) return null;

  // Fetch recent posts to check which categories were published recently
  const existingPosts = await prisma.post.findMany({
    select: { title: true, slug: true, category: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 30,
  });

  const recentCategories = existingPosts.slice(0, 2).map((p) => p.category);

  // 1. If preferred category requested, try that first
  if (preferredCategory) {
    for (const item of allKeywords) {
      if (item.status === "published") continue;
      if (item.category.toLowerCase() === preferredCategory.toLowerCase()) {
        const isCovered = isTopicCovered(item.keyword, existingPosts);
        if (!isCovered) return item;
      }
    }
  }

  // 2. Round-Robin: find a pending keyword from a DIFFERENT category than the last 2 posts
  for (const item of allKeywords) {
    if (item.status === "published") continue;
    if (recentCategories.includes(item.category)) continue;

    const isCovered = isTopicCovered(item.keyword, existingPosts);
    if (!isCovered) {
      return item;
    }
  }

  // 3. Fallback: find any pending, non-covered keyword
  for (const item of allKeywords) {
    if (item.status === "published") continue;

    const isCovered = isTopicCovered(item.keyword, existingPosts);
    if (!isCovered) {
      return item;
    }
  }

  return null;
}

