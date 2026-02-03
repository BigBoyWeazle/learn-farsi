import { NextResponse } from "next/server";
import { db } from "@/db";
import { grammarLessons } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

/**
 * GET /api/grammar
 * Fetch all grammar lessons ordered by sort order
 */
export async function GET() {
  try {
    const lessons = await db
      .select()
      .from(grammarLessons)
      .where(eq(grammarLessons.isActive, true))
      .orderBy(asc(grammarLessons.sortOrder));

    return NextResponse.json({ lessons });
  } catch (error) {
    console.error("Error fetching grammar lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch grammar lessons" },
      { status: 500 }
    );
  }
}
