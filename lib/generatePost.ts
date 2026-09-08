import { GoogleGenerativeAI } from "@google/generative-ai";
import { Post } from "@prisma/client";
import prisma from "./prisma";
import { getTopicImage } from "./unsplash";
import { createUniqueSlug } from "./slugify";
import { getNextKeywordToPublish } from "./keyword-queue";
import { autoInterlinkContent } from "./interlinker";

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

    const prompt = `You are the chief editor and master gaming strategist for "The ARC Raiders Hub" (thearc-raiders.com) — the definitive global database and tactical guide platform for Embark Studios' extraction shooter, ARC Raiders.

Your mission is to write a MASTERCLASS, DEFINITIVE, IN-DEPTH 1200–1800 WORD GAMING GUIDE specifically targeting the high-priority search query:
"${targetKeyword}" (Category: "${targetCategory}").

CRITICAL LENGTH & QUALITY REQUIREMENT:
- The article MUST BE AT LEAST 1200 TO 1800 WORDS.
- Do NOT write brief surface-level summaries. Every section must have deep, granular analysis, exact stats, gameplay mechanics, map callouts, tactical advice, and actionable strategies.
- Answer the search query's direct intent in the very first 2 paragraphs for Google Featured Snippets and AI Overviews.

STRUCTURE & MARKDOWN FORMATTING (MANDATORY SECTIONS):

# [Target Keyword Catchy SEO Title (50-65 chars)]

> **Quick Takeaways / At-A-Glance:** (A high-impact 3-4 bullet callout box directly answering "${targetKeyword}" for quick reader scanning and Google AI overviews).

## Complete Overview & Search Intent Breakdown
- Explain in depth what "${targetKeyword}" means in the context of ARC Raiders.
- Provide comprehensive background context (Speranza colony, surface wasteland, Embark Studios mechanics, PvPvE extraction stakes).
- Address any common player misconceptions or recent game updates.

## Deep Dive Mechanics & Technical / Gameplay Specifications
- Detailed technical breakdown (e.g. crossplay matchmaking rules, invite systems, input-based lobbies, platform parity, quest requirements, spawn probabilities, crafting formulas).
- Cover PS5, Xbox Series X|S, and PC Steam/Epic differences where applicable.

## Comprehensive Comparison Table / Tactical Data Matrix
- A full, multi-column Markdown comparison table with at least 4-6 rows detailing stats, requirements, platform features, drop locations, or weapon loadouts.
- Example table formatting:
| Feature / Item / Platform | Status / Location | Key Mechanics & Details | Tactical Priority |
| :--- | :--- | :--- | :--- |
| ... | ... | ... | ... |

## Step-by-Step Tactical Walkthrough / In-Game Strategy
- Provide an exact numbered tactical checklist (Step 1, Step 2, Step 3, Step 4, Step 5) showing players how to execute or locate what they searched for.
- Solo Raider vs Squad strategies: How to approach this objective safely when avoiding or fighting rival player squads.

## Map Locations, Loot Farming & Enemy Threat Mitigation
- Pinpoint specific surface map sectors (Buried City, Dam complex, Industrial Warehouses, Spaceport vaults, Speranza outskirts).
- Detailed tactics against ARC robotic threats (Titans, Sentinels, Leapers, Shredders, Drones) encountered during this activity.

## Pro Survival Tips & Stash Value Optimization
- 5 bulleted pro tips with bold headers for maximum readability and player survival rate.
- Risk management: When to extract vs when to push deeper into high-tier loot zones.

## Troubleshooting, Known Issues & Frequently Asked Questions (FAQ)
- Answer 4-5 distinct, frequently searched related questions in conversational, schema-ready format:
### Q1: [Question 1]?
[Detailed 2-3 sentence answer]
### Q2: [Question 2]?
[Detailed 2-3 sentence answer]
### Q3: [Question 3]?
[Detailed 2-3 sentence answer]
### Q4: [Question 4]?
[Detailed 2-3 sentence answer]

## Final Verdict & Raider Checklist
- Concluding takeaway reinforcing player mastery and long-term progression.

Return the response STRICTLY as valid JSON matching this schema:
{
  "title": "Exact Compelling Title (50-65 chars) Targeting ${targetKeyword}",
  "category": "${targetCategory}",
  "excerpt": "A concise and engaging summary between 140 and 160 characters designed for Google meta descriptions.",
  "tags": ["ARC Raiders", "Gaming Guide", "${targetCategory}", "PS5", "PC Gaming", "Xbox"],
  "imageKeywords": "sci-fi robot combat wasteland extraction shooter",
  "content": "Full markdown article content here with all headings, tables, bullet points, and at least 1200+ words..."
}`;

    const candidateModels = [
      "gemini-3.5-flash",
      "gemini-3.5-flash-lite",
      "gemini-3.1-flash-lite",
      "gemini-flash-latest",
      "gemini-3.8-flash",
      "gemini-3.6-flash"
    ];

    let parsed: GeneratedArticle | null = null;
    let lastError: unknown = null;

    for (const modelName of candidateModels) {
      for (let attempt = 1; attempt <= 2; attempt++) {
        try {
          const model = genAI.getGenerativeModel({
            model: modelName,
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.75,
            },
          });

          const result = await model.generateContent(prompt);
          const responseText = result.response.text();
          if (!responseText) continue;

          try {
            parsed = JSON.parse(responseText);
          } catch {
            const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (jsonMatch && jsonMatch[1]) {
              try {
                parsed = JSON.parse(jsonMatch[1]);
              } catch {}
            }
            if (!parsed) {
              const start = responseText.indexOf('{');
              const end = responseText.lastIndexOf('}');
              if (start !== -1 && end !== -1 && end > start) {
                const slice = responseText.slice(start, end + 1);
                try {
                  parsed = JSON.parse(slice);
                } catch {
                  const sanitized = slice
                    .replace(/(?<!\\)\n/g, '\\n')
                    .replace(/(?<!\\)\r/g, '\\r')
                    .replace(/(?<!\\)\t/g, '\\t');
                  parsed = JSON.parse(sanitized);
                }
              }
            }
          }

          if (parsed && parsed.title && parsed.content) {
            break;
          }
        } catch (err) {
          lastError = err;
          if (attempt < 2) {
            await new Promise((r) => setTimeout(r, 1500));
          }
        }
      }
      if (parsed && parsed.title && parsed.content) {
        break;
      }
    }

    if (!parsed || !parsed.title || !parsed.content) {
      throw lastError || new Error("Failed to generate article content with available models.");
    }

    // Fetch relevant cover image
    const searchQuery = parsed.imageKeywords || `futuristic robot gaming ${targetKeyword}`;
    const coverImageUrl = await getTopicImage(searchQuery, parsed.category || targetCategory);

    // Generate unique slug
    const slug = await createUniqueSlug(parsed.title);

    // Format tags
    const tagsString = Array.isArray(parsed.tags) ? parsed.tags.join(", ") : (parsed.tags || "");

    // Interlink content
    const interlinkedContent = autoInterlinkContent(parsed.content, slug);

    // Save to SQLite database
    const newPost = await prisma.post.create({
      data: {
        title: parsed.title.trim(),
        slug,
        content: interlinkedContent.trim(),
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
