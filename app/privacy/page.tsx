import React from "react";
import type { Metadata } from "next";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { getSiteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  title: "Privacy Policy — The ARC Raiders Hub",
  description:
    "Privacy Policy for The ARC Raiders Hub (thearc-raiders.com). Explaining how we collect, protect, and handle data in compliance with GDPR and CCPA.",
  alternates: {
    canonical: `${getSiteUrl()}/privacy`,
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-10 py-6 text-slate-800 dark:text-slate-200">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Shield className="w-3.5 h-3.5" />
          <span>Legal Compliance</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-mono">
          Last Updated: September 26, 2026
        </p>
      </div>

      <div className="prose prose-slate lg:prose-lg dark:prose-invert max-w-none space-y-6 leading-relaxed">
        <p>
          Welcome to <strong>The ARC Raiders Hub</strong> (accessible from <a href="https://thearc-raiders.com">thearc-raiders.com</a>). Your privacy is important to us. This Privacy Policy outlines the types of information collected and how it is used.
        </p>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4">1. Information We Collect</h2>
        <p>
          We do not require user account registration to read our public guides and game database. When you visit our website, standard non-personally identifiable log files may record:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Internet Protocol (IP) address</li>
          <li>Browser type and operating system</li>
          <li>Referring/exit pages and timestamps</li>
          <li>Number of clicks for analytics and site optimization</li>
        </ul>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4">2. Cookies &amp; Web Beacons</h2>
        <p>
          The ARC Raiders Hub uses standard cookies to store preferences such as your Dark/Light theme mode and anonymous traffic metrics to improve content loading speed and guide accessibility.
        </p>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4">3. Third-Party Services &amp; Analytics</h2>
        <p>
          We may use trusted third-party analytics services (such as Google Analytics or Cloudflare Web Analytics) to understand how visitors engage with our guides. These providers may use cookies and scripts according to their respective privacy policies.
        </p>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4">4. GDPR &amp; CCPA Rights</h2>
        <p>
          Under European GDPR and California CCPA regulations, you have the right to request access to, deletion of, or restriction on the processing of any personal data collected. If you wish to exercise these rights, please contact us at <a href="mailto:privacy@thearc-raiders.com">privacy@thearc-raiders.com</a>.
        </p>

        <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-8 mb-4">5. Contact Information</h2>
        <p>
          If you have questions regarding this Privacy Policy, please contact our data team via email at <strong>privacy@thearc-raiders.com</strong>.
        </p>
      </div>
    </div>
  );
}
