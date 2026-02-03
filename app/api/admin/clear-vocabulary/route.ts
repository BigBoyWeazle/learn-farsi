import { NextResponse } from "next/server";
import { db } from "@/db";
import { lessons, userLessonProgress } from "@/db/schema";

/**
 * POST /api/admin/clear-vocabulary
 * Delete all vocabulary lessons (but keep categories and words)
 */
export async function POST() {
  try {
    // First delete user progress for lessons
    await db.delete(userLessonProgress);

    // Then delete all lessons
    const deleted = await db.delete(lessons).returning();

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${deleted.length} vocabulary lessons`,
      stats: {
        lessonsDeleted: deleted.length,
      },
    });
  } catch (error) {
    console.error("Error clearing vocabulary lessons:", error);
    return NextResponse.json(
      { error: "Failed to clear vocabulary lessons", details: String(error) },
      { status: 500 }
    );
  }
}
