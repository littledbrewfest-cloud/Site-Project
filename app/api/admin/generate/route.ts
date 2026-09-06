import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { generateBlogPost } from "@/lib/generatePost";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    let customCategory: string | undefined;
    try {
      const body = await req.json();
      customCategory = body.category || undefined;
    } catch {
      // Empty body is okay
    }

    const result = await generateBlogPost(customCategory);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post: result.post,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Generation failed.";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
