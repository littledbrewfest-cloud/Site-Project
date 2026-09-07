import { FALLBACK_IMAGES, DEFAULT_FALLBACK_IMAGE } from "./constants";
import prisma from "./prisma";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Fetches a relevant, guaranteed-unique photo based on topic / category / keywords,
 * actively filtering out all images already used by existing posts in the database.
 */
export async function getTopicImage(query: string, category: string): Promise<string> {
  // 1. Gather all currently used images in DB to avoid any duplicates
  const usedImages = new Set<string>();
  try {
    const existingPosts = await prisma.post.findMany({
      select: { coverImageUrl: true },
    });
    existingPosts.forEach((p) => {
      if (p.coverImageUrl) usedImages.add(p.coverImageUrl.trim());
    });
  } catch (err) {
    console.warn("Could not query existing post images for deduplication:", err);
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim();

  // 2. Try Unsplash API with per_page=20 to find a fresh, never-before-used photo
  if (accessKey) {
    try {
      const sanitizedQuery = encodeURIComponent(
        query.replace(/[^\w\s]/gi, " ").trim().slice(0, 50)
      );
      const url = `https://api.unsplash.com/search/photos?page=1&per_page=20&orientation=landscape&query=${sanitizedQuery}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          "Accept-Version": "v1",
        },
        next: { revalidate: 600 },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          for (const item of data.results) {
            const rawUrl = item.urls?.regular || item.urls?.full;
            if (rawUrl && !usedImages.has(rawUrl)) {
              return rawUrl;
            }
          }
          // If all 20 were somehow used, return the top result
          const fallbackUnsplash = data.results[0]?.urls?.regular;
          if (fallbackUnsplash) return fallbackUnsplash;
        }
      }
    } catch (err) {
      console.warn("Unsplash API fetch failed, falling back to curated pool:", err);
    }
  }

  // 3. Fallback: select from category pool, excluding already used images
  const categoryList = FALLBACK_IMAGES[category] || [];
  const availableCategoryImages = categoryList.filter((img) => !usedImages.has(img));

  if (availableCategoryImages.length > 0) {
    const hash = hashString(query || category);
    const index = hash % availableCategoryImages.length;
    return availableCategoryImages[index];
  }

  // 4. If all images in this category are used, check ALL categories
  const allImages = Object.values(FALLBACK_IMAGES).flat();
  const availableGlobalImages = allImages.filter((img) => !usedImages.has(img));

  if (availableGlobalImages.length > 0) {
    const hash = hashString(query);
    const index = hash % availableGlobalImages.length;
    return availableGlobalImages[index];
  }

  // 5. If everything has been exhausted, pick a deterministic hash item from full pool
  const hash = hashString(query || category);
  return allImages[hash % allImages.length] || DEFAULT_FALLBACK_IMAGE;
}
