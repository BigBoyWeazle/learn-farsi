import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

/**
 * POST /api/admin/create-grammar-tables
 * Create grammar tables if they don't exist
 */
export async function POST() {
  try {
    // Create grammar_lessons table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS grammar_lessons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        explanation TEXT NOT NULL,
        difficulty_level INTEGER NOT NULL,
        sort_order INTEGER NOT NULL,
        icon TEXT DEFAULT '📖',
        is_active BOOLEAN DEFAULT true NOT NULL,
        created_at TIMESTAMP DEFAULT now() NOT NULL
      )
    `);

    // Create grammar_exercises table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS grammar_exercises (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        grammar_lesson_id UUID NOT NULL REFERENCES grammar_lessons(id) ON DELETE CASCADE,
        exercise_type TEXT NOT NULL,
        question TEXT NOT NULL,
        question_farsi TEXT,
        correct_answer TEXT NOT NULL,
        alternatives TEXT,
        hint TEXT,
        explanation TEXT,
        sort_order INTEGER DEFAULT 0 NOT NULL
      )
    `);

    // Create user_grammar_progress table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_grammar_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id TEXT NOT NULL,
        grammar_lesson_id UUID NOT NULL REFERENCES grammar_lessons(id) ON DELETE CASCADE,
        is_completed BOOLEAN DEFAULT false NOT NULL,
        completed_at TIMESTAMP,
        attempts INTEGER DEFAULT 0 NOT NULL,
        best_score INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT now() NOT NULL,
        updated_at TIMESTAMP DEFAULT now() NOT NULL
      )
    `);

    return NextResponse.json({
      success: true,
      message: "Grammar tables created successfully",
    });
  } catch (error) {
    console.error("Error creating grammar tables:", error);
    return NextResponse.json(
      { error: "Failed to create grammar tables", details: String(error) },
      { status: 500 }
    );
  }
}
