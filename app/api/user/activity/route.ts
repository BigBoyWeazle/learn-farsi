import { auth } from "@/auth";
import { db } from "@/db";
import { userLessonProgress, userGrammarProgress, userProgress } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * GET - Fetch total activity counts for the current user
 * Includes: vocab lessons, grammar lessons, practice sessions, words practiced
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    // Run all queries in parallel
    const [vocabResult, grammarResult, practiceResult] = await Promise.all([
      // Completed vocabulary lessons
      db
        .select({ count: count() })
        .from(userLessonProgress)
        .where(
          sql`${userLessonProgress.userId} = ${userId} AND ${userLessonProgress.isCompleted} = true`
        ),

      // Completed grammar lessons
      db
        .select({ count: count() })
        .from(userGrammarProgress)
        .where(
          sql`${userGrammarProgress.userId} = ${userId} AND ${userGrammarProgress.isCompleted} = true`
        ),

      // Total practice sessions (unique words reviewed = rows in userProgress)
      db
        .select({ totalReviews: sql<number>`COALESCE(SUM(${userProgress.reviewCount}), 0)` })
        .from(userProgress)
        .where(eq(userProgress.userId, userId)),
    ]);

    const vocabCompleted = vocabResult[0]?.count || 0;
    const grammarCompleted = grammarResult[0]?.count || 0;
    const totalPracticeReviews = practiceResult[0]?.totalReviews || 0;
    // Each daily practice session is 10 words
    const practiceSessionsCompleted = Math.floor(Number(totalPracticeReviews) / 10);

    return NextResponse.json({
      vocabCompleted,
      grammarCompleted,
      practiceSessionsCompleted,
      totalActivities: vocabCompleted + grammarCompleted + practiceSessionsCompleted,
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch user activity" },
      { status: 500 }
    );
  }
}
