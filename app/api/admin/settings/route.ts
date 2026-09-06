import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getActiveCategories, saveActiveCategories } from "@/lib/settings";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const categories = await getActiveCategories();
  return NextResponse.json({ success: true, categories });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { categories } = await req.json();

    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json(
        { error: "Categories must be a non-empty array of strings." },
        { status: 400 }
      );
    }

    const saved = await saveActiveCategories(categories);
    if (!saved) {
      return NextResponse.json({ error: "Failed to save categories." }, { status: 500 });
    }

    return NextResponse.json({ success: true, categories });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to update categories.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
