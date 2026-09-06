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
  imageKeywords: string;
  content: string;
}

/**
 * Selects the next category using a round-robin rotation based on the most recent posts.
 */
async function selectNextCategory(): Promise<string> {
  const categories = await getActiveCategories();
  if (categories.length === 0) return "ARC Raiders News";

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

  // If all categories were used, pick the one least recently used
  const lastUsed = recentCategories[0];
  const remaining = categories.filter((c) => c !== lastUsed);
  return remaining.length > 0
    ? remaining[Math.floor(Math.random() * remaining.length)]
    : categories[0];
}

/**
 * Generates an SEO-optimized, engaging blog post using Google Gemini API tailored for thearc-raiders.com.
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

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    const prompt = `You are the lead gaming journalist and database strategist for "The ARC Raiders Hub" (thearc-raiders.com), the premier publication for ARC Raiders (by Embark Studios) and the next-generation extraction shooter genre.

Write a high-ranking, 900–1400 word in-depth article in the category: "${category}".

Niche Domain Context:
- Main Focus: ARC Raiders (Embark Studios, Speranza underground colony, PvPvE extraction mechanics, robotic ARC Titans, weapons, gadgets, playtests, 2025 release).
- Platforms: PlayStation 5 (DualSense haptics, Tempest 3D audio, 4K/60fps), PC (Unreal Engine 5, Nanite, Lumen, DLSS/FSR), and Xbox Series X|S.
- Broader Category Synergy: Extraction shooters, competitive tactics, weapon meta, and Unreal Engine 5 gaming optimization.

Topic guidelines:
- Choose an ultra-relevant, intriguing, high-search-intent gaming topic within "${category}".
- Write a punchy, SEO-optimized title (50-65 characters) that gamers search for on Google.
- Write a captivating meta description / excerpt (140-160 characters).
- Choose 4 to 6 relevant tags (e.g. ARC Raiders, PS5, Embark Studios, Weapons, Guide, Extraction Shooter).
- Provide 2-3 search keywords for finding a striking sci-fi/gaming cover image.
- Structure the article thoroughly with Markdown: # Main Title, ## Major Sections, ### Tactical Subheadings, bulleted pro-tips, comparison tables, and highlighted blockquotes.
- Ensure the tone is authoritative, exciting, tactical, and deeply knowledgeable about extraction shooter game design.

Return the response STRICTLY as valid JSON matching this schema:
{
  "title": "Compelling Article Title Here",
  "category": "${category}",
  "excerpt": "A concise and engaging summary of the article between 140 and 160 characters.",
  "tags": ["ARC Raiders", "PS5", "Embark Studios", "Gaming"],
  "imageKeywords": "futuristic robot combat sci-fi soldier",
  "content": "Full markdown content of the 900-1400 word article here..."
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

    // Fetch relevant cover image
    const searchQuery = parsed.imageKeywords || `sci-fi gaming robot ${parsed.tags?.[0] || ""}`;
    const coverImageUrl = await getTopicImage(searchQuery, parsed.category || category);

    // Generate unique slug
    const slug = await createUniqueSlug(parsed.title);

    // Format tags
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
