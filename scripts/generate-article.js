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
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  ],
  'PS5 & Console Gaming': [
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526509867162-5b0c0d1b4b33?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560253023-3ec5d502959f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1580234811497-9df7fd2f357e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
  ],
  'Guides & Walkthroughs': [
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
  ],
  'Weapons & Loadouts': [
    'https://images.unsplash.com/photo-1595590424283-b8f17842773f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542751110-97427bbecf20?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
  ],
  'Extraction Shooters': [
    'https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1519638399535-1b036603ac77?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
  ],
  'PC Specs & Performance': [
    'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=80',
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
  // 1. Check in same category for never-before-used image
  const categoryImages = FALLBACK_IMAGES[category] || [];
  const availableCat = categoryImages.filter(img => !usedImages.has(img));
  if (availableCat.length > 0) {
    const pick = availableCat[Math.floor(Math.random() * availableCat.length)];
    usedImages.add(pick);
    return pick;
  }

  // 2. Check across all categories for never-before-used image
  const allImages = Object.values(FALLBACK_IMAGES).flat();
  const availableGlobal = allImages.filter(img => !usedImages.has(img));
  if (availableGlobal.length > 0) {
    const pick = availableGlobal[Math.floor(Math.random() * availableGlobal.length)];
    usedImages.add(pick);
    return pick;
  }

  // 3. Guaranteed Unique Tokenized fallback if all curated images are exhausted
  const randomBase = allImages[Math.floor(Math.random() * allImages.length)];
  const uniqueUrl = `${randomBase}&seed=${Date.now()}_${Math.floor(Math.random() * 10000)}`;
  usedImages.add(uniqueUrl);
  return uniqueUrl;
}

const CANDIDATE_MODELS = [
  'gemini-3.8-flash',
  'gemini-3.1-pro-preview',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite',
  'gemini-3.1-flash-lite',
  'gemini-flash-latest',
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

const TOPIC_ANCHOR_MAP = [
  {
    slug: 'arc-raiders-best-weapons-gadgets-loadout-guide',
    regex: /\b(best weapons|weapon tier list|meta loadouts?|tactical loadouts?|combat loadout|weapons? and gadgets?|survival loadout|weapon systems?|armory gear|weapons?)\b/i,
  },
  {
    slug: 'speranza-colony-arc-raiders-extraction-contracts-guide',
    regex: /\b(Speranza Colony|vendors? in the Underground|Underground workbench|extraction contracts?|traders in Speranza|Speranza|the Underground|subterranean megacity)\b/i,
  },
  {
    slug: 'what-we-left-behind-arc-raiders-ultimate-scavenging-guide',
    regex: /\b(What We Left Behind|remnants of pre-collapse civilization|pre-collapse relics?|scavenging routes?|scavenge for remnants|Old World relics?|scavenged surface components)\b/i,
  },
  {
    slug: 'where-to-find-sentinel-firing-core-in-arc-raiders-farm-guide',
    regex: /\b(Sentinel Firing Cores?|Sentinel Apex|heavy Sentinels?|ARC Sentinels?|Sentinel units?|mechanized ARC invaders|ARC machines?)\b/i,
  },
  {
    slug: 'where-to-find-mushrooms-in-arc-raiders-ultimate-farming-guide',
    regex: /\b(find mushrooms|mushroom farming|farming mushrooms|medicinal mushrooms?|mushrooms?)\b/i,
  },
  {
    slug: 'where-to-find-olives-in-arc-raiders-ultimate-loot-guide',
    regex: /\b(find olives|canned olives|olive spawns?|farming olives|Canned Olives|olives?)\b/i,
  },
  {
    slug: 'arc-raiders-titan-boss-fight-weakpoints-loot-guide',
    regex: /\b(Titan boss|Titan boss fight|Titan weakpoints?|ARC Titan|Titan encounters?|Titans?)\b/i,
  },
  {
    slug: 'arc-raiders-pc-settings-unreal-engine-5-fps-guide',
    regex: /\b(Unreal Engine 5|optimal PC settings|max FPS settings|graphics settings|PC performance|PC settings)\b/i,
  },
  {
    slug: 'arc-raiders-ps5-gameplay-release-date-guide',
    regex: /\b(PS5 gameplay|PlayStation 5|PS5 release|console mechanics|PS5 version|PS5)\b/i,
  },
  {
    slug: 'is-arc-raiders-crossplay-cross-platform-guide',
    regex: /\b(crossplay|cross-platform|cross-progression|cross platform|multiplatform matchmaking)\b/i,
  },
];

function cleanHeadingNumbers(markdown) {
  if (!markdown) return '';
  return markdown.replace(/^(#{1,6}\s+)\d+[\.\)]\s+/gm, '$1');
}

function autoInterlinkContent(content, currentSlug) {
  if (!content) return '';
  let processed = cleanHeadingNumbers(content);
  processed = processed.replace(/\]\(\/blog\//g, '](/');

  const usedSlugs = new Set([currentSlug]);
  let linkCount = 0;
  const maxLinks = 4;

  const lines = processed.split('\n');
  const resultLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const isHeading = /^#{1,6}\s+/.test(line);
    const isTable = /^\|/.test(line);
    const isCodeFence = /^```/.test(line);

    if (linkCount < maxLinks && !isHeading && !isTable && !isCodeFence && line.trim().length > 30) {
      for (const item of TOPIC_ANCHOR_MAP) {
        if (linkCount >= maxLinks) break;
        if (usedSlugs.has(item.slug)) continue;

        const match = line.match(item.regex);
        if (match && match.index !== undefined) {
          const before = line.slice(0, match.index);
          const after = line.slice(match.index + match[0].length);

          const openBrackets = (before.match(/\[/g) || []).length;
          const closeBrackets = (before.match(/\]/g) || []).length;
          const openParen = (before.match(/\(/g) || []).length;
          const closeParen = (before.match(/\)/g) || []).length;

          if (openBrackets === closeBrackets && openParen === closeParen) {
            const matchedText = match[0];
            line = `${before}[${matchedText}](/${item.slug})${after}`;
            usedSlugs.add(item.slug);
            linkCount++;
            break;
          }
        }
      }
    }
    resultLines.push(line);
  }

  return resultLines.join('\n');
}

const STOP_WORDS = new Set([
  'in', 'the', 'a', 'an', 'for', 'to', 'of', 'and', 'on', 'at', 'with', 'is', 'are', 'was', 'were',
  'how', 'what', 'where', 'why', 'when', 'who', 'which', 'guide', 'ultimate', 'best', '2026',
  'arc', 'raider', 'raiders', 'find', 'location', 'locations', 'farming', 'farm', 'complete', 'tactical',
  'routes', 'walkthrough', 'news', 'update', 'tips', 'tricks', 'top', 'gaming', 'edition', 'ps5', 'pc', 'xbox',
  'get', 'all', 'everything', 'you', 'need', 'know', 'about'
]);

function stemWord(w) {
  return w.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/(?:ing|es|s|ed|er|est)$/, '');
}

function extractCoreTokens(str) {
  const words = str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  return words.map(stemWord).filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

function isTopicCovered(keywordOrTitle, existingPosts) {
  const kwTokens = extractCoreTokens(keywordOrTitle);
  if (kwTokens.length === 0) return false;

  for (const post of existingPosts) {
    const postTokens = new Set([
      ...extractCoreTokens(post.title || ''),
      ...extractCoreTokens(post.slug || '')
    ]);

    const matchedCount = kwTokens.filter(t => postTokens.has(t)).length;
    const ratio = matchedCount / kwTokens.length;

    if (kwTokens.length === 1 && matchedCount === 1) return true;
    if (kwTokens.length === 2 && matchedCount >= 2) return true;
    if (kwTokens.length >= 3 && ratio >= 0.60) return true;
  }
  return false;
}

async function generateSingleArticle(apiKey, keywordItem, usedImages, existingPosts) {
  console.log(`\n🎯 Generating article for Keyword: "${keywordItem.keyword}" (Category: ${keywordItem.category})`);

  const genAI = new GoogleGenerativeAI(apiKey);
  const coveredTopicsList = existingPosts.map(p => `"${p.title}"`).slice(0, 15).join(', ');

  const prompt = `You are the senior editor and lead gaming strategist for "The ARC Raiders Hub" (thearc-raiders.com) — the premier tactical database for Embark Studios' extraction shooter, ARC Raiders.

Write a MASTERCLASS, DEFINITIVE, IN-DEPTH 1200–1800 WORD GAMING GUIDE targeting the search query:
"${keywordItem.keyword}" (Category: "${keywordItem.category}").

CRITICAL ANTI-DUPLICATION RULE:
- Our database ALREADY HAS guides covering: [${coveredTopicsList}].
- You MUST NOT write about or re-hash any of those already covered topics (e.g. if Mushrooms, Olives, Sentinel Firing Core, or Crossplay already exist, do NOT write about them).
- Focus 100% uniquely on: "${keywordItem.keyword}".

CRITICAL TITLE VARIETY & ANTI-CLICHÉ RULES:
- NEVER use repetitive formulaic titles like "Where to Find [X] in ARC Raiders: Farm Guide" or "Where to Find [X] in ARC Raiders: Complete Guide".
- Craft an AUTHENTIC, HUMAN, HIGH-CLICK-THROUGH GAMING HEADLINE in the style of IGN, PC Gamer, Eurogamer, or Dexerto.
- Title length MUST be strictly between 45 and 60 characters for optimal Google SERP display (no cutoffs).
- Rotate and vary title styles based on the topic:
  * Tactical Farming Hook: "ARC Raiders [Topic]: Best Farm Spots & Drop Rates"
  * Natural Search Question: "Where Do [Topic] Spawn in ARC Raiders? Route Guide"
  * Blueprint & Stats Guide: "ARC Raiders [Topic] Breakdown: Stats, Spawns & Tips"
  * Combat & Boss Manual: "How to Defeat [Topic] in ARC Raiders: Weakpoints & Loadouts"
  * Meta & Tier Ranking: "Best [Topic] in ARC Raiders: Meta Tier List & Loadouts"
  * System & Settings: "ARC Raiders [Topic]: Settings, FPS Boost & Config"
- NEVER include numbers (like "1.", "2.", "3.") in any headings or titles. Use clean, professional editorial heading titles.

CRITICAL REQUIREMENTS:
- Minimum 1200 to 1800 words.
- In-depth tactical advice, map callouts, weapon stats, loot spawn probabilities, comparison tables, and FAQs.
- Markdown structure:
  # Catchy SEO Title targeting ${keywordItem.keyword} (45-60 chars)
  > Quick Takeaways / At-A-Glance: (Callout box answering the query directly)
  ## Complete Overview & Search Intent
  ## Deep Dive Mechanics & Technical Specs
  ## Comprehensive Data Comparison Table
  ## Step-by-Step Tactical Walkthrough
  ## Map Locations & Threat Mitigation
  ## Pro Survival Tips & Stash Strategy
  ## Frequently Asked Questions (FAQ) - at least 4 Q&As
  ## Final Verdict & Raider Checklist

Return strictly as JSON:
{
  "title": "Title (45-60 chars)",
  "category": "${keywordItem.category}",
  "excerpt": "Compelling 140-160 char summary",
  "tags": ["ARC Raiders", "${keywordItem.category}", "Gaming Guide", "PS5", "PC Gaming"],
  "content": "Full markdown content..."
}`;

  const parsed = await generateWithModelFallback(genAI, prompt);

  // Uniqueness check
  if (isTopicCovered(parsed.title, existingPosts)) {
    console.warn(`Generated title "${parsed.title}" collides with existing topics. Skipping.`);
    throw new Error(`Duplicate topic collision for "${parsed.title}"`);
  }

  let baseSlug = slugify(parsed.title || keywordItem.keyword);
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  const coverImageUrl = await getUniqueImage(keywordItem.category, keywordItem.keyword, usedImages);
  const interlinkedContent = autoInterlinkContent(parsed.content, slug);

  const newPost = await prisma.post.create({
    data: {
      title: parsed.title.trim(),
      slug,
      content: interlinkedContent.trim(),
      excerpt: (parsed.excerpt || parsed.content.slice(0, 150)).trim(),
      coverImageUrl,
      category: parsed.category || keywordItem.category,
      tags: Array.isArray(parsed.tags) ? parsed.tags.join(', ') : (parsed.tags || ''),
      status: 'published',
      publishedAt: new Date(),
    }
  });

  console.log(`✅ Successfully Published: "${newPost.title}"`);
  console.log(`   Slug: /${newPost.slug}`);
  console.log(`   Cover: ${newPost.coverImageUrl}`);
  return newPost;
}

const https = require('https');

async function pingSearchEngines(slugs) {
  if (!slugs || slugs.length === 0) return;
  console.log(`📡 Pinging Google & IndexNow for ${slugs.length} new article(s)...`);
  try {
    const sitemapUrl = 'https://www.thearc-raiders.com/sitemap.xml';
    https.get(`https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`, () => {}).on('error', () => {});

    const host = 'www.thearc-raiders.com';
    const key = 'thearcraiders2026indexnow';
    const urlList = slugs.map(s => `https://${host}/${s}`);
    const postData = JSON.stringify({
      host,
      key,
      keyLocation: `https://${host}/${key}.txt`,
      urlList
    });

    const req = https.request({
      hostname: 'api.indexnow.org',
      path: '/IndexNow',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    });
    req.on('error', (e) => console.log('IndexNow ping notice:', e.message));
    req.write(postData);
    req.end();
  } catch (err) {
    console.log('Ping notice:', err.message);
  }
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
    select: { title: true, slug: true, coverImageUrl: true, category: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  const usedImages = new Set(existingPosts.map(p => p.coverImageUrl).filter(Boolean));

  let generated = 0;
  const newSlugs = [];

  while (generated < count) {
    // Determine recent categories to avoid duplicate consecutive categories
    const recentCategories = existingPosts.slice(0, 2).map(p => p.category);

    // 1. First pass: Pick pending keyword from a DIFFERENT category than recent posts
    let candidate = keywords.find(k => k.status !== 'published' && !recentCategories.includes(k.category) && !isTopicCovered(k.keyword, existingPosts));

    // 2. Fallback: Any pending, non-covered keyword
    if (!candidate) {
      candidate = keywords.find(k => k.status !== 'published' && !isTopicCovered(k.keyword, existingPosts));
    }

    if (!candidate) {
      console.log('No more unique pending keywords available in queue.');
      break;
    }

    try {
      const post = await generateSingleArticle(apiKey, candidate, usedImages, existingPosts);
      candidate.status = 'published';
      newSlugs.push(post.slug);
      existingPosts.unshift({
        title: post.title,
        slug: post.slug,
        coverImageUrl: post.coverImageUrl,
        category: post.category,
        createdAt: new Date()
      });
      generated++;
    } catch (err) {
      console.error('Failed to generate for keyword:', candidate.keyword, err.message);
      // Mark candidate temporarily or skip to avoid infinite loop
      candidate.status = 'error';
    }
  }

  // Restore any temporary error status back to pending if needed
  keywords.forEach(k => { if (k.status === 'error') k.status = 'pending'; });

  fs.writeFileSync(KEYWORDS_FILE, JSON.stringify(keywords, null, 2));
  console.log(`\n🎉 Total Articles Published in this run: ${generated}`);

  if (newSlugs.length > 0) {
    await pingSearchEngines(newSlugs);
  }

  process.exit(0);
}

main();

