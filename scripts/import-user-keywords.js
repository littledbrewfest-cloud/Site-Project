const fs = require('fs');
const path = require('path');
const { inferCategory } = require('./parse-keywords');

const csvPath = 'C:/Users/Lapzone.pk/.gemini/antigravity/brain/aab5a8a1-fe71-411b-ba18-f426e92a95b6/.user_uploaded/media_1788702915243.csv';

if (!fs.existsSync(csvPath)) {
  console.error('CSV file not found at:', csvPath);
  process.exit(1);
}

const rawContent = fs.readFileSync(csvPath, 'utf8');
const cleaned = rawContent.replace(/\0/g, '');
const lines = cleaned.split(/\r?\n/).filter(Boolean);

const keywords = [];
const seenKeywords = new Set();

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  const parts = line.split('\t').map(p => p.replace(/^"+|"+$/g, '').trim());
  if (parts.length >= 5) {
    const rank = parseInt(parts[0], 10) || i;
    const keyword = parts[1];
    const difficulty = parseInt(parts[3], 10) || 0;
    const volume = parseInt(parts[4], 10) || 0;
    const parentKeyword = parts[7] || keyword;

    if (keyword && !seenKeywords.has(keyword.toLowerCase())) {
      seenKeywords.add(keyword.toLowerCase());
      keywords.push({
        id: `kw-${rank}`,
        keyword: keyword,
        difficulty: difficulty,
        volume: volume,
        parentKeyword: parentKeyword,
        category: inferCategory(keyword),
        status: 'pending'
      });
    }
  }
}

// Sort: Lowest Difficulty first, then Highest Volume first
keywords.sort((a, b) => {
  if (a.difficulty !== b.difficulty) {
    return a.difficulty - b.difficulty;
  }
  return b.volume - a.volume;
});

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

fs.writeFileSync(
  path.join(dataDir, 'keywords.json'),
  JSON.stringify(keywords, null, 2),
  'utf-8'
);

const kd0 = keywords.filter(k => k.difficulty === 0);
const kd1_5 = keywords.filter(k => k.difficulty >= 1 && k.difficulty <= 5);
const kd6_15 = keywords.filter(k => k.difficulty >= 6 && k.difficulty <= 15);
const kd16plus = keywords.filter(k => k.difficulty > 15);

console.log('=== KEYWORD IMPORT SUMMARY ===');
console.log('Total unique keywords loaded:', keywords.length);
console.log('KD = 0 (Immediate Low-Hanging Fruit):', kd0.length);
console.log('KD 1 - 5 (Easy Ranking Targets):', kd1_5.length);
console.log('KD 6 - 15 (Medium Competition):', kd6_15.length);
console.log('KD > 15 (Long-term Authority):', kd16plus.length);
console.log('==============================');
