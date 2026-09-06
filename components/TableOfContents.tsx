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
    <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
        <ListOrdered className="w-4 h-4 text-blue-600" />
        <span>Table of Contents</span>
      </div>

      <nav className="space-y-1.5 text-xs sm:text-sm">
        {headings.map((item, idx) => (
          <button
            key={idx}
            onClick={() => scrollToHeading(item.id)}
            className={`block text-left w-full truncate py-1 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:translate-x-1 transition-all ${
              item.level === 3 ? "pl-4 text-xs text-slate-500" : "font-medium"
            }`}
          >
            {item.text}
          </button>
        ))}
      </nav>
    </div>
  );
}
