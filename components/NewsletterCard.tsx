import React from "react";
import Link from "next/link";
import { Flame, Trophy, Gamepad2, Zap, ShieldCheck, Crosshair, ArrowRight, Sparkles } from "lucide-react";
import { categoryToSlug } from "@/lib/constants";

export default function NewsletterCard() {
  const hubCategories = [
    {
      name: "Weapons & Loadouts",
      slug: "Weapons & Loadouts",
      desc: "Gun tier lists, TTK stats, recoil patterns & meta builds.",
      icon: Flame,
      color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
    },
    {
      name: "Guides & Walkthroughs",
      slug: "Guides & Walkthroughs",
      desc: "Titan weakpoints, Sentinel farming & quest blueprints.",
      icon: Trophy,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
    },
    {
      name: "PS5 & Console Gaming",
      slug: "PS5 & Console Gaming",
      desc: "DualSense haptics, crossplay & 4K performance settings.",
      icon: Gamepad2,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    },
    {
      name: "PC Specs & Performance",
      slug: "PC Specs & Performance",
      desc: "Unreal Engine 5 max FPS guides, DLSS & latency tweaks.",
      icon: Zap,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      name: "Extraction Survival",
      slug: "Extraction Shooters",
      desc: "Solo survival, extraction drop zones & squad tactics.",
      icon: ShieldCheck,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    },
    {
      name: "ARC Raiders News",
      slug: "ARC Raiders News",
      desc: "Embark Studios patch notes, release updates & lore.",
      icon: Crosshair,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  return (
    <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 text-white p-6 sm:p-10 lg:p-12 border border-amber-500/20 shadow-2xl space-y-8">
      {/* Ambient background glows */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-72 h-72 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-semibold backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="uppercase tracking-widest">TACTICAL DATABASE NAVIGATOR</span>
        </div>

        <h3 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
          Ready for Your Next Surface Extraction?
        </h3>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-lg mx-auto">
          Explore comprehensive weapon tier lists, machine boss weakpoint strategies, and PS5/PC performance guides curated by verified raiders.
        </p>
      </div>

      {/* Category Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {hubCategories.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={`/category/${categoryToSlug(item.slug)}`}
              className="group p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 backdrop-blur-sm flex flex-col justify-between space-y-3 hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-500/10"
            >
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${item.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-1 transition-all" />
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-white group-hover:text-amber-400 transition-colors uppercase tracking-tight">
                  {item.name}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {item.desc}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Bottom Action Row */}
      <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <span className="font-mono flex items-center gap-1.5 text-emerald-400 font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
          Updated Daily for 2026 Surface Season
        </span>

        <Link
          href={`/category/${categoryToSlug("Weapons & Loadouts")}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold transition-all shadow-md shadow-amber-500/20 hover:scale-105"
        >
          <span>Explore Weapon Meta Tier List</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}
