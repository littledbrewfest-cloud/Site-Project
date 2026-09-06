import { GoogleGenerativeAI } from "@google/generative-ai";
import { Post } from "@prisma/client";
import prisma from "./prisma";
import { getTopicImage } from "./unsplash";
import { createUniqueSlug } from "./slugify";
import { getNextKeywordToPublish } from "./keyword-queue";

export interface GeneratedArticle {
  title: string;
  category: string;
  excerpt: string;
  tags: string[];
  imageKeywords: string;
  content: string;
}

/**
 * Generates an SEO-optimized, engaging, 100% unique blog post using Google Gemini API.
 * Pulls from the prioritized low-competition keyword queue automatically.
 */
export async function generateBlogPost(customKeywordOrCategory?: string): Promise<{
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
    let targetKeyword = "";
    let targetCategory = "ARC Raiders News";

    if (customKeywordOrCategory) {
      targetKeyword = customKeywordOrCategory;
      targetCategory = "ARC Raiders News";
    } else {
      // Pick next prioritized keyword from the 1000-keyword queue (KD: 0 first!)
      const nextItem = await getNextKeywordToPublish();
      if (nextItem) {
        targetKeyword = nextItem.keyword;
        targetCategory = nextItem.category;
      } else {
        targetKeyword = "ARC Raiders Gameplay Mechanics";
        targetCategory = "Guides & Walkthroughs";
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.75,
      },
    });

    const prompt = `You are the lead gaming journalist and database editor for "The ARC Raiders Hub" (thearc-raiders.com).

Your mission is to write a comprehensive, 100% original, in-depth 1000–1500 word gaming guide specifically targeting the search query:
"${targetKeyword}" (Category: "${targetCategory}").

CONTENT & SEO GUIDELINES:
1. Target Keyword Focus: Answer the gamer's exact intent for "${targetKeyword}" in the very first 2 paragraphs.
2. Structure & Detail:
   - Catchy, SEO-optimized title (50-65 chars) incorporating "${targetKeyword}".
   - Concise meta description / excerpt (140-160 chars).
   - Detailed sections with Markdown formatting: # Main Title, ## Major Headings, ### Subheadings, bullet points, tactical comparison tables, and highlighted blockquotes.
   - Specific locations (e.g. Speranza colony, Buried City, Dam complex, Spaceport vaults), exact loot mechanics, crafting requirements, and enemy counters (Titans, Sentinels, Leapers, Shredders).
   - "Pro Survival Tips" section with actionable advice for Solo and Squad players.
   - FAQ section answering 3 common related questions.
3. Tone: Authoritative, exciting, modern, and deeply knowledgeable about extraction shooters. Do not use repetitive fluff.

Return the response STRICTLY as valid JSON matching this schema:
{
  "title": "Exact Compelling Title Targeting ${targetKeyword}",
  "category": "${targetCategory}",
  "excerpt": "A concise and engaging summary between 140 and 160 characters.",
  "tags": ["ARC Raiders", "Gaming", "Guide", "PS5", "Embark Studios"],
  "imageKeywords": "sci-fi robot combat extraction shooter",
  "content": "Full markdown article content here (1000-1500 words)..."
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
    const searchQuery = parsed.imageKeywords || `futuristic robot gaming ${targetKeyword}`;
    const coverImageUrl = await getTopicImage(searchQuery, parsed.category || targetCategory);

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
        category: parsed.category || targetCategory,
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
