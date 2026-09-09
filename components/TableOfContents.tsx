"use client";

import React, { useMemo } from "react";
import { ListOrdered } from "lucide-react";

interface TOCProps {
  content: string;
}

interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ content }: TOCProps) {
  const headings = useMemo(() => {
    if (!content) return [];
    const lines = content.split("\n");
    const items: HeadingItem[] = [];

    lines.forEach((line) => {
      const match = line.match(/^(#{2,3})\s+(.*)$/);
      if (match) {
        const level = match[1].length;
        const rawText = match[2]
          .replace(/[*_~`]/g, "")
          .replace(/\[(.*?)\]\(.*?\)/g, "$1")
          .replace(/^\d+[\.\)]\s*/, "")
          .trim();

        if (rawText) {
          const id = rawText
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");

          items.push({ id, text: rawText, level });
        }
      }
    });

    return items;
  }, [content]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Find element by heading text content if id wasn't added by markdown renderer
      const headers = Array.from(document.querySelectorAll("h2, h3"));
      const found = headers.find(
        (h) => h.textContent?.toLowerCase().includes(id.replace(/-/g, " "))
      );
      if (found) {
        found.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg space-y-3 backdrop-blur-md">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
        <ListOrdered className="w-4 h-4 text-amber-400" />
        <span>Tactical Intel Index</span>
      </div>

      <nav className="space-y-1.5 text-xs sm:text-sm" aria-label="Table of Contents">
        {headings.map((item, idx) => (
          <button
            key={idx}
            onClick={() => scrollToHeading(item.id)}
            aria-label={`Jump to section: ${item.text}`}
            className={`block text-left w-full truncate py-1 text-slate-300 hover:text-amber-400 hover:translate-x-1 transition-all cursor-pointer ${
              item.level === 3 ? "pl-4 text-xs text-slate-400" : "font-semibold"
            }`}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
