"use client";

import React, { useState } from "react";
import { Share2, Check, Copy, MessageCircle, Bookmark, Heart } from "lucide-react";

interface ArticleActionsProps {
  title: string;
  url: string;
}

export default function ArticleActions({ title, url }: ArticleActionsProps) {
  const [copied, setCopied] = useState(false);
  const [likes, setLikes] = useState(24);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(url || window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handleLike = () => {
    if (!liked) {
      setLikes((prev) => prev + 1);
      setLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setLiked(false);
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareTwitter = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const shareWhatsApp = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-4 px-5 rounded-2xl bg-slate-900/90 border border-slate-800 backdrop-blur-sm shadow-md">
      {/* Reactions / Likes */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleLike}
          aria-label="Like this tactical guide"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
            liked
              ? "bg-rose-950/40 text-rose-400 border-rose-900/60 shadow-sm"
              : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-rose-400/50 hover:text-rose-400"
          }`}
          title="Like this tactical guide"
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? "fill-rose-500 text-rose-500" : ""}`} aria-hidden="true" />
          <span>{likes}</span>
        </button>

        <button
          onClick={() => setBookmarked(!bookmarked)}
          aria-label="Bookmark this tactical guide"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all duration-200 cursor-pointer ${
            bookmarked
              ? "bg-amber-950/40 text-amber-400 border-amber-900/60 shadow-sm"
              : "bg-slate-800/80 text-slate-300 border-slate-700 hover:border-amber-400/50 hover:text-amber-400"
          }`}
          title="Bookmark intel"
        >
          <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? "fill-amber-500 text-amber-500" : ""}`} aria-hidden="true" />
          <span>{bookmarked ? "Saved" : "Save"}</span>
        </button>
      </div>

      {/* Share Actions */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-400 mr-1 flex items-center gap-1 hidden sm:inline-flex">
          <Share2 className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
          Share:
        </span>

        {/* X / Twitter */}
        <a
          href={shareTwitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X (formerly Twitter)"
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-sky-400 hover:border-sky-500/50 transition-colors shadow-sm"
          title="Share on X (Twitter)"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </a>

        {/* LinkedIn */}
        <a
          href={shareLinkedIn}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-blue-400 hover:border-blue-500/50 transition-colors shadow-sm"
          title="Share on LinkedIn"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
          </svg>
        </a>

        {/* WhatsApp */}
        <a
          href={shareWhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors shadow-sm"
          title="Share on WhatsApp"
        >
          <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
        </a>

        {/* Copy Link */}
        <button
          onClick={handleCopy}
          aria-label="Copy article link to clipboard"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            copied
              ? "bg-amber-500 text-slate-950 font-bold border-amber-500 shadow-sm shadow-amber-500/30"
              : "bg-slate-800/80 text-slate-200 border-slate-700 hover:bg-slate-700 hover:text-white"
          }`}
          title="Copy article link"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
