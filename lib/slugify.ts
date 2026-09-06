import prisma from "./prisma";

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word chars
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}

/**
 * Ensures the slug is completely unique in the database by appending a counter if duplicate exists.
 */
export async function createUniqueSlug(baseText: string, currentPostId?: string): Promise<string> {
  const baseSlug = slugify(baseText) || "post";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.post.findUnique({
      where: { slug },
      select: { id: true },
    });

    // If no existing post found, or it's the post we are currently editing
    if (!existing || (currentPostId && existing.id === currentPostId)) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
