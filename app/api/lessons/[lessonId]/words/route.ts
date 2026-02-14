import { NextResponse } from "next/server";
import { db } from "@/db";
import { lessons, vocabulary, lessonVocabulary } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/lessons/[lessonId]/words
 * Fetch all words for a specific lesson
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
      .from(lessons)
      .where(eq(lessons.id, lessonId))
      .limit(1);

    if (lesson.length === 0) {
      return NextResponse.json({ error: "Lesson not found" }, { status: 404 });
    }

    // Get words directly assigned to this lesson
    const lessonWords = await db
      .select({
        word: vocabulary,
      })
      .from(lessonVocabulary)
      .innerJoin(
        vocabulary,
        eq(lessonVocabulary.vocabularyId, vocabulary.id)
      )
      .where(eq(lessonVocabulary.lessonId, lessonId))
      .orderBy(lessonVocabulary.sortOrder);

    const words = lessonWords.map((w) => w.word);

    return NextResponse.json({
      lesson: lesson[0],
      words,
      wordCount: words.length,
    });
  } catch (error) {
    console.error("Error fetching lesson words:", error);
    return NextResponse.json(
      { error: "Failed to fetch lesson words" },
      { status: 500 }
    );
  }
}
