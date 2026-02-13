import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { userStats, vocabulary } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { selectWordsForSession } from "@/lib/word-selection";

export async function GET() {
  try {
    const session = await auth();

    // Guest fallback: return 5 random level-1 words
    if (!session?.user?.id) {
      const words = await db
        .select()
        .from(vocabulary)
        .where(
          and(
            eq(vocabulary.difficultyLevel, 1),
            eq(vocabulary.isActive, true)
          )
        )
        .orderBy(sql`RANDOM()`)
        .limit(5);

      return NextResponse.json({ words });
    }

    const userId = session.user.id;

    // Get user's current level from database
    const stats = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1);

    const currentLevel = stats[0]?.currentLevel ?? 1;

    // Use smart word selection with DB-backed progress
    const words = await selectWordsForSession({
      sessionSize: 5,
      currentLevel,
      userId,
    });

    return NextResponse.json({ words });
  } catch (error) {
    console.error("Error fetching practice words:", error);
    return NextResponse.json(
      { error: "Failed to fetch practice words" },
      { status: 500 }
    );
  }
}
