import { NextResponse } from "next/server";
import { db } from "@/db";
import { grammarLessons, grammarExercises, userGrammarProgress } from "@/db/schema";

/**
 * POST /api/admin/clear-grammar
 * Clear all grammar data to allow re-seeding
 */
export async function POST() {
  try {
    // Delete in order due to foreign key constraints
    await db.delete(userGrammarProgress);
    await db.delete(grammarExercises);
    await db.delete(grammarLessons);

    return NextResponse.json({
      success: true,
      message: "All grammar data cleared",
    });
  } catch (error) {
    console.error("Error clearing grammar data:", error);
    return NextResponse.json(
      { error: "Failed to clear grammar data", details: String(error) },
      { status: 500 }
    );
  }
}
