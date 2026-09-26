import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Crosshair, ShieldCheck, Gamepad2, Award, Users, FileCheck, ArrowRight } from "lucide-react";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "About Us — The ARC Raiders Hub Editorial Team & Mission",
  description:
    "Learn about The ARC Raiders Hub: our editorial standards, extraction shooter experts, playtesting methodology, and dedicated coverage of Embark Studios' ARC Raiders.",
  alternates: {
    canonical: `${getSiteUrl()}/about`,
  },
};

export default function AboutPage() {
  const siteUrl = getSiteUrl();

  const aboutSchema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About The ARC Raiders Hub",
    url: `${siteUrl}/about`,
    description:
      "The premier independent tactical database, guides portal, and news hub for ARC Raiders by Embark Studios.",
    publisher: {
      "@type": "Organization",
      name: "The ARC Raiders Hub",
      url: siteUrl,
      logo: `${siteUrl}/icon.svg`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />

      <div className="max-w-4xl mx-auto space-y-12 py-6">
        {/* Header */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Crosshair className="w-3.5 h-3.5" />
            <span>Independent Gaming Media &amp; Strategy Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            About The ARC Raiders Hub
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
            We are a dedicated team of veteran extraction shooter strategists, hardware analysts, and gaming journalists delivering definitive tactical guides, weapon breakdowns, and news for Embark Studios&apos; <span className="font-semibold text-amber-600 dark:text-amber-400">ARC Raiders</span>.
          </p>
        </div>

        {/* Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Hands-On Playtesting</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Every weapon tier list, extraction route, and boss guide is verified through extensive hands-on playtesting on PlayStation 5, PC, and Xbox platforms.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Strict Editorial Standards</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              We adhere to rigorous journalistic fact-checking. We cross-reference game patches, datamines, and developer announcements from Embark Studios.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Player-First Intelligence</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Zero fluff. Our guides prioritize actionable data, item drop rates, map callouts, and hardware optimization settings for Unreal Engine 5.
            </p>
          </div>
        </div>

        {/* Mission & Background */}
        <div className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none space-y-6 text-slate-800 dark:text-slate-200 leading-relaxed">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Our Mission</h2>
          <p>
            When Embark Studios announced ARC Raiders—transitioning from a pure cooperative experience into a high-stakes PvPvE extraction shooter—we recognized the need for a comprehensive, real-time tactical database. Speranza Colony, surface expeditions, ARC mechanical threats, and player loot economies require precise tactical intel.
          </p>
          <p>
            The ARC Raiders Hub was founded to serve as the single source of truth for both new recruits and seasoned extraction veterans. We dissect weapon TTK (Time-To-Kill), module crafting recipes, underground trader contracts, and boss weakpoints so players can extract with maximum loot.
          </p>

          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Editorial Independence &amp; Disclaimer</h2>
          <p>
            The ARC Raiders Hub is an independent fan media publication and community database. We are not officially affiliated with, endorsed by, or sponsored by Embark Studios AB or Nexon. All trademarks, game assets, and titles belong to their respective copyright holders.
          </p>
        </div>

        {/* CTA Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Have tips, feedback, or a correction?</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Our editorial desk reviews community submissions and updates guides daily.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/editorial-policy"
              className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 transition-colors"
            >
              Editorial Policy
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-xs font-bold text-white shadow-md shadow-amber-500/20 hover:opacity-95 transition-opacity"
            >
              Contact Us <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
