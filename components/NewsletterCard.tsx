"use client";

import React, { useState } from "react";
import { Mail, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export default function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/40 text-white p-6 sm:p-10 border border-amber-500/20 shadow-2xl">
      {/* Background glow orbs */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-mono font-semibold backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="uppercase tracking-widest">Speranza Tactical Dispatch</span>
        </div>

        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
          Never Drop Unprepared into the Wasteland
        </h3>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
          Get weekly ARC Raiders surface intel: weapon tier list meta shifts, hidden bunker codes, machine boss strategies, and patch alerts.
        </p>

        {subscribed ? (
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Encrypted channel confirmed. Welcome to the Vanguard Raider squad.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
            <div className="relative flex-1">
              <label htmlFor="newsletter-email-input" className="sr-only">
                Email address for ARC Raiders tactical intel
              </label>
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" aria-hidden="true" />
              <input
                id="newsletter-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your raider comms email..."
                aria-label="Email address for ARC Raiders tactical newsletter"
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 backdrop-blur-sm transition-all"
              />
            </div>
            <button
              type="submit"
              aria-label="Subscribe to ARC Raiders tactical intel newsletter"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Join Intel</span>
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </form>
        )}

        <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>No spam. 100% ARC Raiders game tactical guides. Unsubscribe anytime.</span>
        </p>
      </div>
    </div>
  );
}
