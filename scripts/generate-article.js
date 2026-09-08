require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { PrismaClient } = require('@prisma/client');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();
const KEYWORDS_FILE = path.join(__dirname, '..', 'data', 'keywords.json');

const FALLBACK_IMAGES = {
  'ARC Raiders News': [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?auto=format&fit=crop&w=1200&q=80',
  ],
  'PS5 & Console Gaming': [
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=1200&q=80',
  ],
  'Guides & Walkthroughs': [
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1552824722-ddab1374e622?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80',
  ],
  'Weapons & Loadouts': [
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
  ],
  'Extraction Shooters': [
    'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
  ],
  'PC Specs & Performance': [
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80',
  ],
};

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function getUniqueImage(category, query, usedImages) {
  const categoryImages = FALLBACK_IMAGES[category] || [];
  const availableCat = categoryImages.filter(img => !usedImages.has(img));
  if (availableCat.length > 0) {
    const pick = availableCat[Math.floor(Math.random() * availableCat.length)];
    usedImages.add(pick);
    return pick;
  }
  const allImages = Object.values(FALLBACK_IMAGES).flat();
  const availableGlobal = allImages.filter(img => !usedImages.has(img));
  if (availableGlobal.length > 0) {
    const pick = availableGlobal[Math.floor(Math.random() * availableGlobal.length)];
    usedImages.add(pick);
    return pick;
  }
  return allImages[Math.floor(Math.random() * allImages.length)];
}

const CANDIDATE_MODELS = [
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
  'gemini-3.8-flash',
  'gemini-3.6-flash'
];

function cleanAndParseJSON(rawText) {
  try {
    return JSON.parse(rawText);
  } catch {}

  let text = rawText.trim();
  const fenceMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (fenceMatch && fenceMatch[1]) {
    text = fenceMatch[1].trim();
    try {
      return JSON.parse(text);
    } catch {}
  }

  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start !== -1 && end !== -1 && end > start) {
    const slice = text.slice(start, end + 1);
    try {
      return JSON.parse(slice);
    } catch {}
    try {
      const sanitized = slice
        .replace(/(?<!\\)\n/g, '\\n')
        .replace(/(?<!\\)\r/g, '\\r')
        .replace(/(?<!\\)\t/g, '\\t');
      return JSON.parse(sanitized);
    } catch {}
  }

  throw new Error('Unable to parse JSON from AI response: ' + rawText.slice(0, 150));
}

async function generateWithModelFallback(genAI, prompt) {
  let lastError = null;
  for (const modelName of CANDIDATE_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text && text.trim()) {
          return cleanAndParseJSON(text);
        }
      } catch (err) {
        lastError = err;
        console.warn(`[Model: ${modelName}, Attempt ${attempt}] Warning: ${err.message || err.status}`);
        if (attempt < 2) {
          await new Promise(r => setTimeout(r, 1500));
        }
      }
    }
  }
  throw lastError || new Error('All candidate models failed.');
}

async function generateSingleArticle(apiKey, keywordItem, usedImages) {
  console.log(`\n🎯 Generating article for Keyword: "${keywordItem.keyword}" (Category: ${keywordItem.category})`);

  const genAI = new GoogleGenerativeAI(apiKey);

  const prompt = `You are the senior editor and lead gaming strategist for "The ARC Raiders Hub" (thearc-raiders.com) — the premier tactical database for Embark Studios' extraction shooter, ARC Raiders.

Write a MASTERCLASS, DEFINITIVE, IN-DEPTH 1200–1800 WORD GAMING GUIDE targeting the search query:
"${keywordItem.keyword}" (Category: "${keywordItem.category}").

CRITICAL REQUIREMENTS:
- Minimum 1200 to 1800 words.
- In-depth tactical advice, map callouts, weapon stats, loot spawn probabilities, comparison tables, and FAQs.
- Markdown structure:
  # Catchy SEO Title targeting ${keywordItem.keyword}
  > Quick Takeaways / At-A-Glance: (Callout box answering the query directly)
  ## 1. Complete Overview & Search Intent
  ## 2. Deep Dive Mechanics & Technical Specs
  ## 3. Comprehensive Data Comparison Table
  ## 4. Step-by-Step Practical Walkthrough
  ## 5. Map Locations & Threat Mitigation
  ## 6. Pro Survival Tips & Stash Strategy
  ## 7. Frequently Asked Questions (FAQ) - at least 4 Q&As
  ## 8. Final Verdict & Raider Checklist

Return strictly as JSON:
{
  "title": "Title (50-65 chars)",
  "category": "${keywordItem.category}",
  "excerpt": "Compelling 140-160 char summary",
  "tags": ["ARC Raiders", "${keywordItem.category}", "Gaming Guide", "PS5", "PC Gaming"],
  "content": "Full markdown content..."
}`;

  const parsed = await generateWithModelFallback(genAI, prompt);

  let baseSlug = slugify(parsed.title || keywordItem.keyword);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const coverImageUrl = await getUniqueImage(keywordItem.category, keywordItem.keyword, usedImages);

  const newPost = await prisma.post.create({
    data: {
      title: parsed.title.trim(),
      slug,
      content: parsed.content.trim(),
      excerpt: (parsed.excerpt || parsed.content.slice(0, 150)).trim(),
      coverImageUrl,
      category: parsed.category || keywordItem.category,
      tags: Array.isArray(parsed.tags) ? parsed.tags.join(', ') : (parsed.tags || ''),
      status: 'published',
      publishedAt: new Date(),
    }
  });

  console.log(`✅ Successfully Published: "${newPost.title}"`);
  console.log(`   Slug: /blog/${newPost.slug}`);
  console.log(`   Cover: ${newPost.coverImageUrl}`);
  return newPost;
}

async function main() {
  const apiKey = (process.env.GEMINI_API_KEY || process.env.GEMINI_KEY)?.trim();
  if (!apiKey) {
    console.error('❌ ERROR: GEMINI_API_KEY is missing in .env or environment variables.');
    console.error('💡 Please add your free GEMINI_API_KEY to .env or GitHub Secrets to enable automatic publishing.');
    process.exit(1);
  }

  const countArg = process.argv.find(a => a.startsWith('--count='));
  const count = countArg ? parseInt(countArg.split('=')[1], 10) : 1;

  if (!fs.existsSync(KEYWORDS_FILE)) {
    console.error('❌ data/keywords.json not found.');
    process.exit(1);
  }

  const keywords = JSON.parse(fs.readFileSync(KEYWORDS_FILE, 'utf-8'));
  const existingPosts = await prisma.post.findMany({
    select: { title: true, slug: true, coverImageUrl: true }
  });

  const usedImages = new Set(existingPosts.map(p => p.coverImageUrl).filter(Boolean));
  const existingTitles = existingPosts.map(p => p.title.toLowerCase());
  const existingSlugs = existingPosts.map(p => p.slug.toLowerCase());

  let generated = 0;
  for (const item of keywords) {
    if (generated >= count) break;
    const kwLower = item.keyword.toLowerCase();
    const isAlreadyPublished =
      existingTitles.some(t => t.includes(kwLower) || kwLower.includes(t)) ||
      existingSlugs.some(s => s.includes(kwLower.replace(/\s+/g, '-')));

    if (!isAlreadyPublished) {
      try {
        await generateSingleArticle(apiKey, item, usedImages);
        item.status = 'published';
        generated++;
      } catch (err) {
        console.error('Failed to generate for keyword:', item.keyword, err);
      }
    }
  }

  fs.writeFileSync(KEYWORDS_FILE, JSON.stringify(keywords, null, 2));
  console.log(`\n🎉 Total Articles Published in this run: ${generated}`);
  process.exit(0);
}

main();
