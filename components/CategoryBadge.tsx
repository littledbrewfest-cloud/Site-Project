import React from "react";
import Link from "next/link";
import { CATEGORY_COLORS } from "@/lib/constants";

interface CategoryBadgeProps {
  category: string;
  isLink?: boolean;
  className?: string;
}

export default function CategoryBadge({
  category,
  isLink = true,
  className = "",
}: CategoryBadgeProps) {
  const color = CATEGORY_COLORS[category] || {
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
  };

  const badgeContent = (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border transition-colors ${color.bg} ${color.text} ${color.border} ${
        isLink ? "hover:opacity-85" : ""
      } ${className}`}
    >
      {category}
    </span>
  );

  if (isLink) {
    return (
      <Link href={`/category/${encodeURIComponent(category.toLowerCase())}`}>
        {badgeContent}
      </Link>
    );
  }

  return badgeContent;
}
