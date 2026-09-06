import { PrismaClient } from "@prisma/client";
import { DEFAULT_CATEGORIES } from "../lib/constants";
import { saveActiveCategories } from "../lib/settings";

const prisma = new PrismaClient();

const SAMPLE_POSTS = [
  {
    title: "The Rise of Agentic AI: How Autonomous Agents Are Transforming Software Development",
    slug: "rise-of-agentic-ai-autonomous-agents",
    category: "Technology",
    tags: "AI, Software Engineering, Automation, Future Tech",
    excerpt: "Explore how autonomous AI agents are moving beyond basic code completion to multi-step reasoning, pair programming, and full application architecture.",
    coverImageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    content: `# The Rise of Agentic AI: How Autonomous Agents Are Transforming Software Development

Artificial Intelligence in software engineering has rapidly evolved from simple syntax autocomplete into sophisticated, autonomous coding agents capable of multi-step planning, debugging, and end-to-end execution.

## From Copilots to Autonomous Collaborators

Early developer tools focused on single-line suggestions. While helpful, they still required developers to break down large problems into tiny manual steps. 

Agentic AI changes this paradigm:
- **Autonomous Planning**: Analyzing complex multi-file codebases and drafting architectural roadmaps.
- **Self-Correction**: Executing terminal commands, parsing error traces, and adjusting code iteratively.
- **Context-Aware Tooling**: Interacting with databases, git repositories, and cloud deployments seamlessly.

> "The true breakthrough of modern AI systems is not just understanding natural language, but taking purposeful actions within developer environments."

## Key Pillars of Modern AI Agents

1. **Deep Context Windows**: Processing entire repositories to understand dependencies.
2. **Tool Invocation**: Reading files, running test suites, and querying APIs directly.
3. **Structured Verification**: Continuously testing modifications against requirements before shipping.

## The Future Landscape

As models become more efficient and capable, developer workflows will increasingly focus on system architecture, prompt strategy, and validation rather than boilerplate coding. The future belongs to engineers who leverage these agentic superpowers effectively.
`,
  },
  {
    title: "Mastering Personal Finance: 5 High-Impact Rules for Building Long-Term Wealth",
    slug: "mastering-personal-finance-5-rules-building-wealth",
    category: "Finance & Money",
    tags: "Finance, Investing, Wealth Building, Budgeting",
    excerpt: "Discover the five foundational rules of personal finance that turn everyday income into sustainable, compounding long-term wealth.",
    coverImageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    content: `# Mastering Personal Finance: 5 High-Impact Rules for Building Long-Term Wealth

Building wealth isn't about finding a lucky shortcut; it is about establishing disciplined, compounding habits that work reliably over decades.

## 1. Pay Yourself First

Before paying bills or allocating discretionary spending, automatically route 15–25% of your income into investments and emergency savings. Treat your financial future as non-negotiable.

## 2. Eliminate High-Interest Debt

Credit card debt and high-interest loans are wealth destroyers. Use the **Avalanche method** (paying off highest interest rates first) to eliminate expensive debt rapidly.

## 3. Leverage the Magic of Compound Interest

\`\`\`
Compounding Formula: A = P(1 + r/n)^(nt)
\`\`\`

Time in the market consistently beats timing the market. Consistently investing in low-cost, broad-market index funds allows compounding returns to accelerate your net worth.

## 4. Build a 3 to 6 Month Emergency Buffer

Having liquid cash stored in a high-yield savings account protects you from liquidating long-term investments during unexpected market downturns or life emergencies.

## 5. Keep Lifestyle Inflation in Check

As your career progresses and income rises, resist the temptation to inflate your cost of living proportionally. Instead, increase your savings rate to accelerate financial independence.
`,
  },
  {
    title: "The Science of High-Quality Sleep: How to Optimize Your Rest for Peak Energy",
    slug: "science-of-high-quality-sleep-peak-energy",
    category: "Health & Wellness",
    tags: "Sleep, Health, Biohacking, Wellness, Recovery",
    excerpt: "Unlock restorative deep sleep with evidence-backed protocols: circadian alignment, temperature regulation, and screen-time management.",
    coverImageUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80",
    status: "published",
    content: `# The Science of High-Quality Sleep: How to Optimize Your Rest for Peak Energy

Sleep is the ultimate biological performance enhancer. Quality rest improves memory consolidation, hormone balance, immune function, and mental clarity.

## Understanding Your Circadian Rhythm

Your body's internal clock is governed primarily by light exposure. When photon receptors in your eyes detect sunlight in the morning, cortisol rises and melatonin production shuts down, setting a timer for restful sleep later that night.

### Morning Protocols
- View natural sunlight within 30 minutes of waking (10–15 minutes).
- Delay caffeine intake by 90 minutes to prevent the afternoon energy crash.

### Evening Protocols
- Dim ambient lighting 2 hours prior to bed.
- Avoid blue light from screens or use blue-blocking filters.
- Keep your bedroom cool (around 65°F / 18°C) to facilitate core body temperature drop.

> "Better sleep isn't achieved right before bed—it begins the moment you wake up in the morning."

## Nutrition and Supplementation

Avoid large meals and alcohol close to bedtime. Incorporating magnesium glycinate and chamomile tea can support calm nervous system transitions.
`,
  },
];

async function main() {
  console.log("Seeding database...");

  // Save default categories setting
  await saveActiveCategories(DEFAULT_CATEGORIES);

  // Clear existing posts or add sample posts
  for (const post of SAMPLE_POSTS) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        ...post,
        publishedAt: new Date(),
      },
    });
  }

  console.log("Database seeded successfully with initial posts and categories.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
