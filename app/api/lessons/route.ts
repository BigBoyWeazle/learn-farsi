import { NextResponse } from "next/server";
import { db } from "@/db";
import { lessons, wordCategories } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/lessons
 * Fetch all lessons with their category information
 */
export async function GET() {
  try {
    const allLessons = await db
      .select({
        lesson: lessons,
        category: wordCategories,
      })
      .from(lessons)
      .innerJoin(wordCategories, eq(lessons.categoryId, wordCategories.id))
      .where(eq(lessons.isActive, true))
      .orderBy(lessons.sortOrder);

    // Transform to include category data inline
    const lessonsWithCategories = allLessons.map(({ lesson, category }) => ({
      ...lesson,
      category: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        icon: category.icon,
        description: category.description,
      },
    }));

    return NextResponse.json({ lessons: lessonsWithCategories });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return NextResponse.json(
      { error: "Failed to fetch lessons" },
      { status: 500 }
    );
  }
}
