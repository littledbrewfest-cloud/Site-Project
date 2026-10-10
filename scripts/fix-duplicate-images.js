const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function fixAllDuplicatePhotos() {
  const curatedPath = path.join(__dirname, '..', 'data', 'curated-images.json');
  const curated = JSON.parse(fs.readFileSync(curatedPath, 'utf8'));
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: 'asc' } });

  console.log(`Total posts to inspect: ${posts.length}`);
  console.log(`Total curated photos available: ${curated.length}`);

  const usedBaseIds = new Set();
  let updatedCount = 0;
  let poolIndex = 0;

  for (const post of posts) {
    const currentBase = (post.coverImageUrl || '').split('?')[0];

    // If this base image is already used by an earlier post or empty, replace it with a fresh unique photo
    if (!currentBase || usedBaseIds.has(currentBase)) {
      while (poolIndex < curated.length && usedBaseIds.has(curated[poolIndex].split('?')[0])) {
        poolIndex++;
      }

      if (poolIndex < curated.length) {
        const newPhoto = curated[poolIndex];
        const newBase = newPhoto.split('?')[0];
        usedBaseIds.add(newBase);
        poolIndex++;

        await prisma.post.update({
          where: { id: post.id },
          data: { coverImageUrl: newPhoto },
        });
        updatedCount++;
        console.log(`✅ Fixed: "${post.title.slice(0, 45)}" -> ${newBase}`);
      }
    } else {
      usedBaseIds.add(currentBase);
    }
  }

  console.log(`\n🎉 Success! Replaced duplicates on ${updatedCount} posts.`);
  console.log(`Total posts in database: ${posts.length}`);
  console.log(`Total unique visual photos now: ${usedBaseIds.size}`);
}

fixAllDuplicatePhotos()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
