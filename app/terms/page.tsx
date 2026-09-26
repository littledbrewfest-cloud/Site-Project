import React from "react";
import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Terms of Service — The ARC Raiders Hub",
  description:
    "Terms of Service and Conditions for using The ARC Raiders Hub fan community website and tactical database.",
  alternates: {
    canonical: `${getSiteUrl()}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 text-slate-800 dark:text-slate-200">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-3.5 h-3.5" />
          <span>User Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
          Last Updated: September 26, 2026
        </p>
      </div>

      <div className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none space-y-6 leading-relaxed">
        <p>
          By accessing and using <strong>The ARC Raiders Hub</strong> (<a href="https://thearc-raiders.com">thearc-raiders.com</a>), you agree to comply with and be bound by the following Terms of Service.
        </p>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4">1. Intellectual Property &amp; Fair Use</h2>
        <p>
          All editorial content, original guides, strategy tables, and tactical analysis created by The ARC Raiders Hub editorial staff are copyrighted material.
        </p>
        <p>
          <em>ARC Raiders</em>, its character models, weapons, audio, and game lore are the intellectual property and registered trademarks of <strong>Embark Studios AB</strong> and Nexon. Our usage of game imagery and references falls under Fair Use for gaming journalism, reviews, and community guide purposes.
        </p>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4">2. Accuracy of Game Data</h2>
        <p>
          Extraction shooters frequently undergo live hotfixes, balance patches, and updates. While we strive to maintain 100% accurate drop rates and weapon stats, game mechanics may change without prior notice. Guides are provided for educational and entertainment purposes.
        </p>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4">3. Prohibited Use</h2>
        <p>
          You may not scrape, mirror, or republish full articles from this website for commercial automated spam networks without written authorization.
        </p>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4">4. Inquiries &amp; Legal Notices</h2>
        <p>
          For legal inquiries, intellectual property notices, or permission requests, please email <strong>legal@thearc-raiders.com</strong>.
        </p>
      </div>
    </div>
  );
}
