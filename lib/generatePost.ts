import { GoogleGenerativeAI } from "@google/generative-ai";
import { Post } from "@prisma/client";
import prisma from "./prisma";
import { getActiveCategories } from "./settings";
import { getTopicImage } from "./unsplash";
import { createUniqueSlug } from "./slugify";

export interface GeneratedArticle {
  title: string;
  category: string;
  excerpt: string;
  tags: string[];
  content: string;
  imageKeywords: string;
}

/**
 * Selects the next category using a round-robin rotation based on the most recent posts.
 */
async function selectNextCategory(): Promise<string> {
  const categories = await getActiveCategories();
  if (categories.length === 0) return "Technology";

  // Check the last few published posts to pick the least recently used category
  const recentPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: categories.length,
    select: { category: true },
  });

  const recentCategories = recentPosts.map((p) => p.category);

  // Find a category that wasn't used in recent posts
  for (const cat of categories) {
    if (!recentCategories.includes(cat)) {
      return cat;
    }
  }

  // If all categories were used, pick the one least recently used (the one furthest back or random)
  const lastUsed = recentCategories[0];
  const remaining = categories.filter((c) => c !== lastUsed);
  return remaining.length > 0
    ? remaining[Math.floor(Math.random() * remaining.length)]
    : categories[0];
}

/**
 * Generates an SEO-optimized, engaging blog post using Google Gemini API.
 */
export async function generateBlogPost(customCategory?: string): Promise<{
  success: boolean;
  post?: Post;
  error?: string;
}> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return {
      success: false,
      error: "GEMINI_API_KEY is not configured in environment variables.",
    };
  }

  try {
    const category = customCategory || (await selectNextCategory());
    const genAI = new GoogleGenerativeAI(apiKey);

    // Use gemini-1.5-flash for fast responses and free tier compatibility
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    const prompt = `You are an expert content creator, journalist, and SEO specialist.
Write a comprehensive, engaging, well-researched, and original blog post in the category: "${category}".

Topic guidelines:
- Choose a fresh, highly relevant, and fascinating topic within "${category}".
- Write a captivating, click-worthy SEO title (50-65 characters).
- Write a concise meta description / excerpt (140-160 characters).
- Choose 3 to 5 relevant tags (single words or short phrases).
- Provide 2-3 search keywords for finding a high-quality cover photo.
- Write a detailed, insightful, and well-structured 800–1200 word article in clean Markdown.
- The article body must use proper Markdown formatting: # Main Title, ## Section Headings, ### Subheadings, bullet points, numbered lists, blockquotes, and bold text for emphasis.
- Ensure the tone is authoritative yet accessible, engaging, and modern.

Return the response STRICTLY as valid JSON matching this schema:
{
  "title": "Compelling Blog Title Here",
  "category": "${category}",
  "excerpt": "A concise and engaging summary of the article between 140 and 160 characters.",
  "tags": ["Tag1", "Tag2", "Tag3", "Tag4"],
  "imageKeywords": "two or three keywords describing ideal cover image",
  "content": "Full markdown content of the 800-1200 word article here..."
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    if (!responseText) {
      throw new Error("Empty response received from Gemini API.");
    }

    let parsed: GeneratedArticle;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // Fallback: extract json between markdown backticks if present
      const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (jsonMatch && jsonMatch[1]) {
        parsed = JSON.parse(jsonMatch[1]);
      } else {
        throw new Error("Failed to parse Gemini response as JSON: " + responseText.slice(0, 200));
      }
    }

    if (!parsed.title || !parsed.content) {
      throw new Error("Generated content is missing required fields (title or content).");
    }

    // Fetch relevant cover image (Unsplash API or curated fallback)
    const searchQuery = parsed.imageKeywords || `${parsed.category} ${parsed.tags?.[0] || ""}`;
    const coverImageUrl = await getTopicImage(searchQuery, parsed.category || category);

    // Generate unique slug
    const slug = await createUniqueSlug(parsed.title);

    // Format tags as comma-separated string
    const tagsString = Array.isArray(parsed.tags) ? parsed.tags.join(", ") : (parsed.tags || "");

    // Save to SQLite database
    const newPost = await prisma.post.create({
      data: {
        title: parsed.title.trim(),
        slug,
        content: parsed.content.trim(),
        excerpt: (parsed.excerpt || parsed.content.slice(0, 150)).trim(),
        coverImageUrl,
        category: parsed.category || category,
        tags: tagsString,
        status: "published",
        publishedAt: new Date(),
      },
    });

    return {
      success: true,
      post: newPost,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "An unexpected error occurred during content generation.";
    console.error("Error generating blog post:", err);
    return {
      success: false,
      error: msg,
    };
  }
}
