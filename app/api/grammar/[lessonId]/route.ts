import { NextResponse } from "next/server";
import { db } from "@/db";
import { grammarLessons, grammarExercises } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

/**
 * GET /api/grammar/[lessonId]
 * Fetch a specific grammar lesson with its exercises
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  try {
    const { lessonId } = await params;

    // Get the lesson
    const lesson = await db
      .select()
      .from(grammarLessons)
      .where(eq(grammarLessons.id, lessonId))
      .limit(1);

    if (lesson.length === 0) {
      return NextResponse.json(
        { error: "Grammar lesson not found" },
        { status: 404 }
      );
    }

    // Get exercises for this lesson
    const exercises = await db
      .select()
      .from(grammarExercises)
      .where(eq(grammarExercises.grammarLessonId, lessonId))
      .orderBy(asc(grammarExercises.sortOrder));

    return NextResponse.json({
      lesson: lesson[0],
      exercises,
      exerciseCount: exercises.length,
    });
  } catch (error) {
    console.error("Error fetching grammar lesson:", error);
    return NextResponse.json(
      { error: "Failed to fetch grammar lesson" },
      { status: 500 }
    );
  }
}
