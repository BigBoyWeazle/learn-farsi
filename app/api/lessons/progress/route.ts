import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { userLessonProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * GET /api/lessons/progress
 * Fetch all lesson progress for the authenticated user
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ progress: [] });
    }

    const progress = await db
      .select()
      .from(userLessonProgress)
      .where(eq(userLessonProgress.userId, session.user.id));

    return NextResponse.json({ progress });
  } catch (error) {
    console.error("Error fetching lesson progress:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson progress" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/lessons/progress
 * Save or update lesson progress for the authenticated user
 */
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { lessonId, score, isCompleted } = body;

    if (!lessonId || typeof score !== "number") {
      return NextResponse.json(
        { error: "Missing required fields: lessonId, score" },
        { status: 400 }
      );
    }

    // Check if progress already exists
    const existing = await db
      .select()
      .from(userLessonProgress)
      .where(
        and(
          eq(userLessonProgress.userId, session.user.id),
          eq(userLessonProgress.lessonId, lessonId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing progress
      const currentProgress = existing[0];
      const newBestScore = Math.max(currentProgress.bestScore, score);
      const shouldMarkCompleted = isCompleted || currentProgress.isCompleted;

      await db
        .update(userLessonProgress)
        .set({
          attempts: currentProgress.attempts + 1,
          bestScore: newBestScore,
          isCompleted: shouldMarkCompleted,
          completedAt: shouldMarkCompleted && !currentProgress.completedAt
            ? new Date()
            : currentProgress.completedAt,
          updatedAt: new Date(),
        })
        .where(eq(userLessonProgress.id, currentProgress.id));

      return NextResponse.json({
        success: true,
        isCompleted: shouldMarkCompleted,
        bestScore: newBestScore,
        attempts: currentProgress.attempts + 1,
      });
    } else {
      // Create new progress record
      const newProgress = await db
        .insert(userLessonProgress)
        .values({
          userId: session.user.id,
          lessonId,
          isCompleted: isCompleted || false,
          completedAt: isCompleted ? new Date() : null,
          attempts: 1,
          bestScore: score,
        })
        .returning();

      return NextResponse.json({
        success: true,
        isCompleted: newProgress[0].isCompleted,
        bestScore: newProgress[0].bestScore,
        attempts: newProgress[0].attempts,
      });
    }
  } catch (error) {
    console.error("Error saving lesson progress:", error);
    return NextResponse.json(
      { error: "Failed to save lesson progress" },
      { status: 500 }
    );
  }
}
