import { PrismaClient } from "@prisma/client";
import { DEFAULT_CATEGORIES } from "../lib/constants";
import { saveActiveCategories } from "../lib/settings";
import { SAMPLE_FALLBACK_POSTS } from "../lib/db-helper";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with ARC Raiders topics and initial publications...");

  // Save active ARC Raiders categories
  await saveActiveCategories(DEFAULT_CATEGORIES);

  // Seed cornerstone posts
  for (const post of SAMPLE_FALLBACK_POSTS) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        coverImageUrl: post.coverImageUrl,
        tags: post.tags,
      },
      create: {
        title: post.title,
        slug: post.slug,
        category: post.category,
        excerpt: post.excerpt,
        content: post.content,
        coverImageUrl: post.coverImageUrl,
        tags: post.tags,
        status: "published",
        publishedAt: new Date(),
      },
    });
  }

  console.log("Database seeded successfully for thearc-raiders.com!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
