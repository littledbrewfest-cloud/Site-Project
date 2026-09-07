import React from "react";
import Link from "next/link";
import { CATEGORY_COLORS, categoryToSlug } from "@/lib/constants";

interface CategoryBadgeProps {
  category: string;
  isLink?: boolean;
  className?: string;
  size?: "sm" | "md";
}

export default function CategoryBadge({
  category,
  isLink = true,
  className = "",
  size = "md",
}: CategoryBadgeProps) {
  const color = CATEGORY_COLORS[category] || {
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  };

  const sizeClasses =
    size === "sm"
      ? "px-2 py-0.5 text-[11px]"
      : "px-3 py-1 text-xs";

  const badgeContent = (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border backdrop-blur-md transition-all duration-200 shadow-sm ${color.bg} ${color.text} ${color.border} ${
        isLink ? "hover:scale-105 hover:shadow-md cursor-pointer" : ""
      } ${sizeClasses} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse" />
      {category}
    </span>
  );

  if (isLink) {
    return (
      <Link href={`/category/${categoryToSlug(category)}`}>
        {badgeContent}
      </Link>
    );
  }

  return badgeContent;
}
