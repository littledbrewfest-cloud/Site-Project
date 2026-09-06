/**
 * Standalone Cron Worker for 4 Articles/Day Automation
 * Run with: npm run cron
 */
require("dotenv").config();
const cron = require("node-cron");

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://thearc-raiders.com";
const CRON_SECRET = process.env.CRON_SECRET || "cron_secret_key_987654321";
// Schedule: 4 times a day (every 6 hours: 00:00, 06:00, 12:00, 18:00 UTC)
const SCHEDULE = process.env.CRON_SCHEDULE || "0 */6 * * *";

console.log("==========================================");
console.log("🤖 The ARC Raiders Hub - 4x Daily Auto-Blogger");
console.log(`🌐 Target Endpoint: ${SITE_URL}/api/cron/generate`);
console.log(`⏰ Cron Schedule:   ${SCHEDULE} (4 Posts Every 24 Hours)`);
console.log("==========================================");

async function triggerPostGeneration() {
  console.log(`\n[${new Date().toISOString()}] 🚀 Triggering scheduled keyword article generation...`);

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
      console.log(`✅ [${new Date().toISOString()}] Keyword Article Published Successfully!`);
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

// Schedule task for 4x daily
cron.schedule(SCHEDULE, () => {
  triggerPostGeneration();
});

console.log("⏳ Worker is active: Publishing 4 comprehensive gaming guides every day.");
console.log("💡 You can press Ctrl+C to terminate this worker.");
