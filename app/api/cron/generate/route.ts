import { NextRequest, NextResponse } from "next/server";
import { generateBlogPost } from "@/lib/generatePost";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  return handleCron(req);
}

export async function POST(req: NextRequest) {
  return handleCron(req);
}

async function handleCron(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET?.trim();

  // If CRON_SECRET is configured, enforce security check
  if (cronSecret) {
    const authHeader = req.headers.get("authorization");
    const secretHeader = req.headers.get("x-cron-secret");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : null;

    if (bearerToken !== cronSecret && secretHeader !== cronSecret) {
      return NextResponse.json(
        { error: "Unauthorized: Invalid or missing CRON_SECRET token." },
        { status: 401 }
      );
    }
  }

  try {
    const url = new URL(req.url);
    const categoryParam = url.searchParams.get("category") || undefined;

    const result = await generateBlogPost(categoryParam);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Automated blog post generated and published successfully.",
      post: {
        id: result.post?.id,
        title: result.post?.title,
        slug: result.post?.slug,
        category: result.post?.category,
        publishedAt: result.post?.publishedAt,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "An unexpected error occurred during cron generation.";
    console.error("Cron generation job error:", err);
    return NextResponse.json(
      {
        success: false,
        error: msg,
      },
      { status: 500 }
    );
  }
}
