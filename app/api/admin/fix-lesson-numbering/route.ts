import { NextResponse } from "next/server";
import { db } from "@/db";
import { lessons } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

/**
 * POST /api/admin/fix-lesson-numbering
 * Renumber all lessons sequentially and ensure consistent "Lesson X: Name" format
 */
export async function POST() {
  try {
    // Get all lessons ordered by sortOrder
    const allLessons = await db
      .select()
      .from(lessons)
      .orderBy(asc(lessons.sortOrder), asc(lessons.createdAt));

    let updatedCount = 0;

    for (let i = 0; i < allLessons.length; i++) {
      const lesson = allLessons[i];
      const newNumber = i + 1;

      // Extract the base name (remove existing "Lesson X:" or "Lesson:" prefix)
      let baseName = lesson.title;

      // Remove "Lesson X: " prefix (with number)
      baseName = baseName.replace(/^Lesson \d+:\s*/, "");
      // Remove "Lesson: " prefix (without number)
      baseName = baseName.replace(/^Lesson:\s*/, "");

      // Create new title with proper numbering
      const newTitle = `Lesson ${newNumber}: ${baseName}`;

      // Update lesson with new sortOrder and title
      await db
        .update(lessons)
        .set({
          title: newTitle,
          sortOrder: newNumber,
        })
        .where(eq(lessons.id, lesson.id));

      updatedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully renumbered ${updatedCount} lessons`,
      stats: {
        totalLessons: allLessons.length,
        lessonsUpdated: updatedCount,
      },
    });
  } catch (error) {
    console.error("Error fixing lesson numbering:", error);
    return NextResponse.json(
      { error: "Failed to fix lesson numbering", details: String(error) },
      { status: 500 }
    );
  }
}
