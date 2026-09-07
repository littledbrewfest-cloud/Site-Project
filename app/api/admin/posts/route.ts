import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { createUniqueSlug } from "@/lib/slugify";
import { DEFAULT_FALLBACK_IMAGE } from "@/lib/constants";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, posts });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, excerpt, content, category, tags, coverImageUrl, status } = await req.json();

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "Title, category, and content are required." },
        { status: 400 }
      );
    }

    const slug = await createUniqueSlug(title);
    const postStatus = status || "published";

    const newPost = await prisma.post.create({
      data: {
        title: title.trim(),
        slug,
        excerpt: excerpt?.trim() || title.trim(),
        content: content.trim(),
        category: category.trim(),
        tags: tags ? tags.trim() : "",
        coverImageUrl: coverImageUrl?.trim() || DEFAULT_FALLBACK_IMAGE,
        status: postStatus,
        publishedAt: postStatus === "published" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, post: newPost });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create manual post.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ error: "Missing id or status." }, { status: 400 });
    }

    const updated = await prisma.post.update({
      where: { id },
      data: {
        status,
        publishedAt: status === "published" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update post status.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
