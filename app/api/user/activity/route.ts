import { auth } from "@/auth";
import { db } from "@/db";
import { userLessonProgress, userGrammarProgress, userProgress } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
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
      // Vocab lesson data: total attempts and unique completions
      db
        .select({
          completed: sql<number>`COALESCE(SUM(CASE WHEN ${userLessonProgress.isCompleted} = true THEN 1 ELSE 0 END), 0)`,
          totalAttempts: sql<number>`COALESCE(SUM(${userLessonProgress.attempts}), 0)`,
        })
        .from(userLessonProgress)
        .where(eq(userLessonProgress.userId, userId)),

      // Grammar lesson data: total attempts and unique completions
      db
        .select({
          completed: sql<number>`COALESCE(SUM(CASE WHEN ${userGrammarProgress.isCompleted} = true THEN 1 ELSE 0 END), 0)`,
          totalAttempts: sql<number>`COALESCE(SUM(${userGrammarProgress.attempts}), 0)`,
        })
        .from(userGrammarProgress)
        .where(eq(userGrammarProgress.userId, userId)),

      // Total word reviews (for estimating daily practice sessions)
      db
        .select({ totalReviews: sql<number>`COALESCE(SUM(${userProgress.reviewCount}), 0)` })
        .from(userProgress)
        .where(eq(userProgress.userId, userId)),
    ]);

    const vocabCompleted = Number(vocabResult[0]?.completed || 0);
    const vocabAttempts = Number(vocabResult[0]?.totalAttempts || 0);
    const grammarCompleted = Number(grammarResult[0]?.completed || 0);
    const grammarAttempts = Number(grammarResult[0]?.totalAttempts || 0);
    const totalPracticeReviews = Number(practiceResult[0]?.totalReviews || 0);
    // Estimate daily practice sessions (10 words each)
    const practiceSessionsCompleted = Math.floor(totalPracticeReviews / 10);

    // Total lessons completed = all lesson attempts + daily practice sessions
    // This counts every time the user practiced across all activity types
    const totalLessonsCompleted = vocabAttempts + grammarAttempts + practiceSessionsCompleted;

    return NextResponse.json({
      vocabCompleted,
      grammarCompleted,
      vocabAttempts,
      grammarAttempts,
      practiceSessionsCompleted,
      totalLessonsCompleted,
      totalActivities: totalLessonsCompleted + practiceSessionsCompleted,
    });
  } catch (error) {
    console.error("Error fetching user activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch user activity" },
      { status: 500 }
    );
  }
}
