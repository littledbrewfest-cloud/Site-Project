import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, CheckCircle2, RefreshCw, Sparkles, BookOpen, AlertCircle } from "lucide-react";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Editorial Policy & Fact-Checking Standards — The ARC Raiders Hub",
  description:
    "Read our comprehensive editorial guidelines, fact-checking methodology, playtest verification standards, and transparent AI-assisted research policy.",
  alternates: {
    canonical: `${getSiteUrl()}/editorial-policy`,
  },
};

export default function EditorialPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Integrity &amp; Transparency Standards</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          Editorial &amp; Fact-Checking Policy
        </h1>
        <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
          At The ARC Raiders Hub, our primary commitment is accuracy, clarity, and genuine tactical value for extraction shooter players.
        </p>
      </div>

      {/* Guidelines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Verification &amp; Playtesting</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            All weapon stats, spawn rates, and tactical routes undergo testing across live alpha/beta builds, patch notes, and empirical game data before publication.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
            <RefreshCw className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Continuous Updates</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            As Embark Studios adjusts weapon balance, drop chances, or server mechanics, our editorial team immediately revises existing guides with updated timestamps.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">3. Transparent AI &amp; Human Editorial</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            We utilize advanced language models for data synthesis, keyword clustering, and structure formatting. Every guide is curated, factualized, and reviewed by senior gaming writers.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">4. No Sponsored Bias</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            Our rankings and weapon tier lists are strictly merit-based. We do not accept payment to rank specific weapons, gear setups, or hardware configurations higher.
          </p>
        </div>
      </div>

      {/* Corrections Policy */}
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm">
          <AlertCircle className="w-5 h-5" />
          <span>Corrections &amp; Feedback Policy</span>
        </div>
        <h3 className="text-xl font-black text-slate-900 dark:text-white">
          Found an error or outdated drop rate?
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          If an Embark Studios hotfix changed a spawn rate, blueprint cost, or weapon recoil pattern, please alert our desk. We investigate community reports and issue corrections promptly with an editorial note.
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            Submit a correction via our Contact Desk →
          </Link>
        </div>
      </div>
    </div>
  );
}
