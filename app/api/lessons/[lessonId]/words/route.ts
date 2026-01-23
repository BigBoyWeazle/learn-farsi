import { NextResponse } from "next/server";
import { db } from "@/db";
import { lessons, vocabulary, vocabularyCategories } from "@/db/schema";
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

    const categoryId = lesson[0].categoryId;

    // Get all words in this lesson's category
    const wordsInCategory = await db
      .select({
        word: vocabulary,
      })
      .from(vocabularyCategories)
      .innerJoin(
        vocabulary,
        eq(vocabularyCategories.vocabularyId, vocabulary.id)
      )
      .where(eq(vocabularyCategories.categoryId, categoryId));

    const words = wordsInCategory.map((w) => w.word);

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
