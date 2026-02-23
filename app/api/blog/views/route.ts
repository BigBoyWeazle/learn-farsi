import { db } from "@/db";
import { blogViews } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch view counts
export async function GET(request: NextRequest) {
  try {
    const slug = request.nextUrl.searchParams.get("slug");

    if (slug) {
      const result = await db
        .select()
        .from(blogViews)
        .where(eq(blogViews.slug, slug))
        .limit(1);

      return NextResponse.json({ views: result[0]?.views ?? 0 });
    }

    // Return all view counts
    const allViews = await db.select().from(blogViews);
    const viewMap: Record<string, number> = {};
    for (const row of allViews) {
      viewMap[row.slug] = row.views;
    }

    return NextResponse.json(viewMap);
  } catch (error) {
    console.error("Error fetching blog views:", error);
    return NextResponse.json({ error: "Failed to fetch views" }, { status: 500 });
  }
}

// POST - Increment view count
export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    }

    // Upsert: insert with views=1, or increment if exists
    await db
      .insert(blogViews)
      .values({ slug, views: 1 })
      .onConflictDoUpdate({
        target: blogViews.slug,
        set: { views: sql`${blogViews.views} + 1` },
      });

    const result = await db
      .select()
      .from(blogViews)
      .where(eq(blogViews.slug, slug))
      .limit(1);

    return NextResponse.json({ views: result[0]?.views ?? 1 });
  } catch (error) {
    console.error("Error incrementing blog views:", error);
    return NextResponse.json({ error: "Failed to increment views" }, { status: 500 });
  }
}
