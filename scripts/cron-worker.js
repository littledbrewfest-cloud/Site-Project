/**
 * Standalone Cron Worker for Local Development or VPS Hosting
 * Run with: npm run cron
 */
require("dotenv").config();
const cron = require("node-cron");

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const CRON_SECRET = process.env.CRON_SECRET || "";
// Default schedule: Every day at 06:00 and 18:00 (or customized via CRON_SCHEDULE env var)
const SCHEDULE = process.env.CRON_SCHEDULE || "0 6,18 * * *";

console.log("==========================================");
console.log("🤖 Auto-Blogging Cron Worker Initialized");
console.log(`🌐 Target Endpoint: ${SITE_URL}/api/cron/generate`);
console.log(`⏰ Cron Schedule:   ${SCHEDULE}`);
console.log("==========================================");

async function triggerPostGeneration() {
  console.log(`\n[${new Date().toISOString()}] 🚀 Triggering scheduled post generation...`);

  try {
    const headers = {
      "Content-Type": "application/json",
    };

    if (CRON_SECRET) {
      headers["Authorization"] = `Bearer ${CRON_SECRET}`;
      headers["x-cron-secret"] = CRON_SECRET;
    }

    const response = await fetch(`${SITE_URL}/api/cron/generate`, {
      method: "POST",
      headers,
    });

    const data = await response.json();

    if (response.ok && data.success) {
      console.log(`✅ [${new Date().toISOString()}] Post generated successfully!`);
      console.log(`   Title: "${data.post?.title}"`);
      console.log(`   Slug:  ${data.post?.slug}`);
      console.log(`   Category: ${data.post?.category}`);
    } else {
      console.error(`❌ [${new Date().toISOString()}] Generation failed:`, data.error || data);
    }
  } catch (err) {
    console.error(`❌ [${new Date().toISOString()}] Network or server error:`, err.message);
  }
}

// Schedule task
cron.schedule(SCHEDULE, () => {
  triggerPostGeneration();
});

console.log("⏳ Worker is running in the background and waiting for scheduled intervals.");
console.log("💡 You can press Ctrl+C to terminate this worker.");
