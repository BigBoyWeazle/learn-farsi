import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { userProgress } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { calculateNextReview } from "@/lib/spaced-repetition";
import type { Assessment } from "@/lib/spaced-repetition";

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();
    const { vocabularyId, assessment, isCorrect } = body as {
      vocabularyId: string;
      assessment: Assessment;
      isCorrect: boolean;
    };

    if (!vocabularyId || !assessment) {
      return NextResponse.json(
        { error: "Missing vocabularyId or assessment" },
        { status: 400 }
      );
    }

    // Get existing progress for this user + word
    const existing = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, userId),
          eq(userProgress.vocabularyId, vocabularyId)
        )
      )
      .limit(1);

    const currentProgress = existing[0] ?? null;

    // Calculate next review using spaced repetition algorithm
    const reviewUpdate = calculateNextReview(assessment, isCorrect, currentProgress);

    if (currentProgress) {
      // Update existing progress
      await db
        .update(userProgress)
        .set({
          nextReviewDate: reviewUpdate.nextReviewDate,
          easeFactor: reviewUpdate.easeFactor,
          repetitions: reviewUpdate.repetitions,
          confidenceLevel: reviewUpdate.confidenceLevel,
          lastAssessment: reviewUpdate.lastAssessment,
          isLearned: reviewUpdate.isLearned,
          reviewCount: reviewUpdate.reviewCount,
          lastReviewedAt: reviewUpdate.lastReviewedAt,
          updatedAt: reviewUpdate.updatedAt,
          lastAnswerCorrect: reviewUpdate.lastAnswerCorrect,
          consecutiveCorrect: reviewUpdate.consecutiveCorrect,
          consecutiveWrong: reviewUpdate.consecutiveWrong,
          totalCorrect: reviewUpdate.totalCorrect,
          totalWrong: reviewUpdate.totalWrong,
          accuracy: reviewUpdate.accuracy,
        })
        .where(eq(userProgress.id, currentProgress.id));
    } else {
      // Insert new progress record
      await db.insert(userProgress).values({
        userId,
        vocabularyId,
        nextReviewDate: reviewUpdate.nextReviewDate,
        easeFactor: reviewUpdate.easeFactor,
        repetitions: reviewUpdate.repetitions,
        confidenceLevel: reviewUpdate.confidenceLevel,
        lastAssessment: reviewUpdate.lastAssessment,
        isLearned: reviewUpdate.isLearned,
        reviewCount: reviewUpdate.reviewCount,
        lastReviewedAt: reviewUpdate.lastReviewedAt,
        updatedAt: reviewUpdate.updatedAt,
        lastAnswerCorrect: reviewUpdate.lastAnswerCorrect,
        consecutiveCorrect: reviewUpdate.consecutiveCorrect,
        consecutiveWrong: reviewUpdate.consecutiveWrong,
        totalCorrect: reviewUpdate.totalCorrect,
        totalWrong: reviewUpdate.totalWrong,
        accuracy: reviewUpdate.accuracy,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving review:", error);
    return NextResponse.json(
      { error: "Failed to save review" },
      { status: 500 }
    );
  }
}
