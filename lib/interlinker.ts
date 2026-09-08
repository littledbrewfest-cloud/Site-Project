export interface PostReference {
  id?: string;
  title: string;
  slug: string;
  category?: string;
  tags?: string;
}

export const TOPIC_ANCHOR_MAP: Array<{ regex: RegExp; slug: string }> = [
  {
    slug: "arc-raiders-best-weapons-gadgets-loadout-guide",
    regex: /\b(best weapons|weapon tier list|meta loadouts?|tactical loadouts?|combat loadout|weapons? and gadgets?|survival loadout|weapon systems?|armory gear|weapons?)\b/i,
  },
  {
    slug: "speranza-colony-arc-raiders-extraction-contracts-guide",
    regex: /\b(Speranza Colony|vendors? in the Underground|Underground workbench|extraction contracts?|traders in Speranza|Speranza|the Underground|subterranean megacity)\b/i,
  },
  {
    slug: "what-we-left-behind-arc-raiders-ultimate-scavenging-guide",
    regex: /\b(What We Left Behind|remnants of pre-collapse civilization|pre-collapse relics?|scavenging routes?|scavenge for remnants|Old World relics?|scavenged surface components)\b/i,
  },
  {
    slug: "where-to-find-sentinel-firing-core-in-arc-raiders-farm-guide",
    regex: /\b(Sentinel Firing Cores?|Sentinel Apex|heavy Sentinels?|ARC Sentinels?|Sentinel units?|mechanized ARC invaders|ARC machines?)\b/i,
  },
  {
    slug: "where-to-find-mushrooms-in-arc-raiders-ultimate-farming-guide",
    regex: /\b(find mushrooms|mushroom farming|farming mushrooms|medicinal mushrooms?|mushrooms?)\b/i,
  },
  {
    slug: "where-to-find-olives-in-arc-raiders-ultimate-loot-guide",
    regex: /\b(find olives|canned olives|olive spawns?|farming olives|Canned Olives|olives?)\b/i,
  },
  {
    slug: "arc-raiders-titan-boss-fight-weakpoints-loot-guide",
    regex: /\b(Titan boss|Titan boss fight|Titan weakpoints?|ARC Titan|Titan encounters?|Titans?)\b/i,
  },
  {
    slug: "arc-raiders-pc-settings-unreal-engine-5-fps-guide",
    regex: /\b(Unreal Engine 5|optimal PC settings|max FPS settings|graphics settings|PC performance|PC settings)\b/i,
  },
  {
    slug: "arc-raiders-ps5-gameplay-release-date-guide",
    regex: /\b(PS5 gameplay|PlayStation 5|PS5 release|console mechanics|PS5 version|PS5)\b/i,
  },
  {
    slug: "is-arc-raiders-crossplay-cross-platform-guide",
    regex: /\b(crossplay|cross-platform|cross-progression|cross platform|multiplatform matchmaking)\b/i,
  },
];

export function cleanHeadingNumbers(markdown: string): string {
  if (!markdown) return "";
  return markdown.replace(/^(#{1,6}\s+)\d+[\.\)]\s+/gm, "$1");
}

export function autoInterlinkContent(
  content: string,
  currentSlug: string
): string {
  if (!content) return "";

  const processed = cleanHeadingNumbers(content);
  const usedSlugs = new Set<string>([currentSlug]);
  let linkCount = 0;
  const maxLinks = 4;

  const lines = processed.split("\n");
  const resultLines: string[] = [];

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

  return resultLines.join("\n");
}