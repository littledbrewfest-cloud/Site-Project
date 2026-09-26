import React from "react";
import type { Metadata } from "next";
import { Mail, MessageSquare, ShieldCheck, Send } from "lucide-react";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Contact Us & Raider Tips Desk — The ARC Raiders Hub",
  description:
    "Get in touch with The ARC Raiders Hub editorial team. Submit game tips, report corrections, send press releases, or inquire about business partnerships.",
  alternates: {
    canonical: `${getSiteUrl()}/contact`,
  },
};

export default function ContactPage() {
  const siteUrl = getSiteUrl();

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact The ARC Raiders Hub",
    url: `${siteUrl}/contact`,
    description: "Official contact desk for The ARC Raiders Hub editorial team and media desk.",
    mainEntity: {
      "@type": "Organization",
      name: "The ARC Raiders Hub",
      email: "contact@thearc-raiders.com",
      url: siteUrl,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />

      <div className="max-w-4xl mx-auto space-y-12 py-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>Direct Editorial &amp; Tips Desk</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
            Contact The ARC Raiders Hub
          </h1>
          <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 leading-relaxed">
            Have a game discovery, tactical question, correction, or business inquiry? We&apos;d love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Editorial Inquiries</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For article feedback, guide suggestions, and corrections:
            </p>
            <p className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 break-all">
              editorial@thearc-raiders.com
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Community &amp; Tips</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Found a new secret extraction spot or blueprint spawn:
            </p>
            <p className="text-xs font-mono font-bold text-orange-600 dark:text-orange-400 break-all">
              tips@thearc-raiders.com
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Press &amp; Partnerships</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For media requests, hardware reviews, and syndication:
            </p>
            <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 break-all">
              press@thearc-raiders.com
            </p>
          </div>
        </div>

        {/* Contact Form Container */}
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Send Us a Message
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Fill out the form below and our editorial staff will respond within 24 to 48 business hours.
            </p>
          </div>

          <form className="space-y-4" onSubmit={undefined}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Your Name</label>
                <input
                  type="text"
                  placeholder="e.g. Raider Vanguard"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Topic / Inquiry Type</label>
              <select className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50">
                <option>Guide Correction / Hotfix Update</option>
                <option>Game Tip / Secret Spawn Discovery</option>
                <option>General Question</option>
                <option>Press / Media Inquiry</option>
                <option>Advertising &amp; Sponsorship</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Message</label>
              <textarea
                rows={5}
                placeholder="Describe your question, tip, or correction in detail..."
                required
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
