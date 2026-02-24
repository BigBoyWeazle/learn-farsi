import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { lessons } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

/**
 * POST /api/admin/fix-lessons
 * Fix lesson sort orders to be sequential by level (Level 1 first, then Level 2, then Level 3)
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all lessons ordered by difficulty level first, then by current sort order
    const allLessons = await db
      .select()
      .from(lessons)
      .orderBy(asc(lessons.difficultyLevel), asc(lessons.sortOrder));

    // Update each lesson with sequential sort order and proper title
    const updates = [];
    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i];
      const newSortOrder = i + 1;

      // Extract the category name from the current title (remove any existing "Lesson X:" prefix)
      let baseName = lesson.title;
      const lessonPrefixMatch = baseName.match(/^Lesson \d+:\s*/);
      if (lessonPrefixMatch) {
        baseName = baseName.replace(lessonPrefixMatch[0], "");
      }

      // Create new title with proper numbering
      const newTitle = `Lesson ${newSortOrder}: ${baseName}`;

      await db
        .update(lessons)
        .set({
          sortOrder: newSortOrder,
          title: newTitle,
        })
        .where(eq(lessons.id, lesson.id));

      updates.push({
        id: lesson.id,
        level: lesson.difficultyLevel,
        oldSortOrder: lesson.sortOrder,
        newSortOrder,
        oldTitle: lesson.title,
        newTitle,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${allLessons.length} lessons - ordered by level, then sequential`,
      lessons: updates,
    });
  } catch (error) {
    console.error("Error fixing lessons:", error);
    return NextResponse.json(
      { error: "Failed to fix lessons" },
      { status: 500 }
    );
  }
}
