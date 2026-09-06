import { FALLBACK_IMAGES, DEFAULT_FALLBACK_IMAGE } from "./constants";

/**
 * Fetches a relevant photo from Unsplash API based on topic / category / keywords,
 * with graceful fallback to curated category images.
 */
export async function getTopicImage(query: string, category: string): Promise<string> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY?.trim();

  if (accessKey) {
    try {
      const sanitizedQuery = encodeURIComponent(query.replace(/[^\w\s]/gi, " ").trim().slice(0, 50));
      const url = `https://api.unsplash.com/search/photos?page=1&per_page=1&orientation=landscape&query=${sanitizedQuery}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
          "Accept-Version": "v1",
        },
        // Cache for 10 minutes
        next: { revalidate: 600 },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const rawUrl = data.results[0].urls?.regular || data.results[0].urls?.full;
          if (rawUrl) {
            return rawUrl;
          }
        }
      }
    } catch (err) {
      console.warn("Unsplash API fetch failed, falling back to curated image:", err);
    }
  }

  // Fallback: pick a high-quality curated image for this category
  const categoryList = FALLBACK_IMAGES[category] || [];
  if (categoryList.length > 0) {
    const randomIndex = Math.floor(Math.random() * categoryList.length);
    return categoryList[randomIndex];
  }

  return DEFAULT_FALLBACK_IMAGE;
}
