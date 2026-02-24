import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { lessons, userLessonProgress, vocabulary, vocabularyCategories, wordCategories, userProgress } from "@/db/schema";

/**
 * POST /api/admin/reset-vocabulary
 * Complete reset: Delete ALL vocabulary data including words, lessons, categories
 * Use this to start fresh before re-seeding
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete in order of dependencies (most dependent first)

    // 1. Delete user progress on vocabulary words
    const deletedUserProgress = await db.delete(userProgress).returning();

    // 2. Delete user lesson progress
    const deletedLessonProgress = await db.delete(userLessonProgress).returning();

    // 3. Delete vocabulary-category relations
    const deletedVocabCategories = await db.delete(vocabularyCategories).returning();

    // 4. Delete all lessons
    const deletedLessons = await db.delete(lessons).returning();

    // 5. Delete all vocabulary words
    const deletedWords = await db.delete(vocabulary).returning();

    // 6. Delete all word categories
    const deletedCategories = await db.delete(wordCategories).returning();

    return NextResponse.json({
      success: true,
      message: `Complete vocabulary reset successful`,
      stats: {
        userProgressDeleted: deletedUserProgress.length,
        lessonProgressDeleted: deletedLessonProgress.length,
        vocabularyCategoriesDeleted: deletedVocabCategories.length,
        lessonsDeleted: deletedLessons.length,
        wordsDeleted: deletedWords.length,
        categoriesDeleted: deletedCategories.length,
      },
    });
  } catch (error) {
    console.error("Error resetting vocabulary:", error);
    return NextResponse.json(
      { error: "Failed to reset vocabulary", details: String(error) },
      { status: 500 }
    );
  }
}
