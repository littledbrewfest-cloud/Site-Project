import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { isAuthenticated } from "@/lib/auth";
import { createUniqueSlug } from "@/lib/slugify";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const post = await prisma.post.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true, post });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, coverImageUrl, category, tags, status } = body;

    // Validate or regenerate unique slug if modified
    const cleanSlug = slug ? await createUniqueSlug(slug, params.id) : undefined;

    const updated = await prisma.post.update({
      where: { id: params.id },
      data: {
        ...(title && { title: title.trim() }),
        ...(cleanSlug && { slug: cleanSlug }),
        ...(excerpt !== undefined && { excerpt: excerpt.trim() }),
        ...(content !== undefined && { content: content.trim() }),
        ...(coverImageUrl !== undefined && { coverImageUrl: coverImageUrl.trim() }),
        ...(category && { category: category.trim() }),
        ...(tags !== undefined && { tags: tags.trim() }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({ success: true, post: updated });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update article.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await prisma.post.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Post deleted successfully." });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to delete article.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
