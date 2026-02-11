/**
 * Smart word selection algorithm for practice sessions
 * Uses database-backed user progress for spaced repetition
 * Prioritizes: failed words → due for review → new words (randomized)
 */

import { db } from "@/db";
import { vocabulary, userProgress } from "@/db/schema";
import { eq, and, lte, notInArray, sql, desc, asc } from "drizzle-orm";
import type { Vocabulary } from "@/db/schema";

export interface WordSelectionOptions {
  sessionSize: number;
  currentLevel: number;
  userId: string;
}

/**
 * Select words for a practice session using intelligent prioritization
 * All progress is read from the userProgress table (per-user, per-word)
 */
export async function selectWordsForSession(
  options: WordSelectionOptions
): Promise<Vocabulary[]> {
  const { sessionSize, currentLevel, userId } = options;
  const selectedWords: Vocabulary[] = [];
  const selectedIds: string[] = [];

  // 1. Get words the user got wrong recently (consecutiveWrong > 0) — max 2
  const failedWords = await db
    .select({ vocab: vocabulary })
    .from(userProgress)
    .innerJoin(vocabulary, eq(userProgress.vocabularyId, vocabulary.id))
    .where(
      and(
        eq(userProgress.userId, userId),
        sql`${userProgress.consecutiveWrong} > 0`,
        eq(vocabulary.isActive, true)
      )
    )
    .orderBy(desc(userProgress.consecutiveWrong))
    .limit(Math.min(2, sessionSize));

  for (const row of failedWords) {
    selectedWords.push(row.vocab);
    selectedIds.push(row.vocab.id);
  }

  // 2. Get words due for review (nextReviewDate <= now) — max 2
  if (selectedWords.length < sessionSize) {
    const remaining = sessionSize - selectedWords.length;
    const now = new Date();

    const dueWords = await db
      .select({ vocab: vocabulary })
      .from(userProgress)
      .innerJoin(vocabulary, eq(userProgress.vocabularyId, vocabulary.id))
      .where(
        and(
          eq(userProgress.userId, userId),
          lte(userProgress.nextReviewDate, now),
          eq(vocabulary.isActive, true),
          sql`${userProgress.consecutiveWrong} = 0`,
          selectedIds.length > 0
            ? notInArray(vocabulary.id, selectedIds)
            : undefined
        )
      )
      .orderBy(asc(userProgress.nextReviewDate))
      .limit(Math.min(2, remaining));

    for (const row of dueWords) {
      selectedWords.push(row.vocab);
      selectedIds.push(row.vocab.id);
    }
  }

  // 3. Fill remaining slots with NEW words the user hasn't seen yet (at current level)
  if (selectedWords.length < sessionSize) {
    const remaining = sessionSize - selectedWords.length;

    // Get all word IDs this user has progress on
    const seenWordRows = await db
      .select({ vocabularyId: userProgress.vocabularyId })
      .from(userProgress)
      .where(eq(userProgress.userId, userId));

    const seenIds = seenWordRows.map((r) => r.vocabularyId);
    const excludeIds = [...new Set([...selectedIds, ...seenIds])];

    const newWords = await db
      .select()
      .from(vocabulary)
      .where(
        and(
          eq(vocabulary.difficultyLevel, currentLevel),
          eq(vocabulary.isActive, true),
          excludeIds.length > 0
            ? notInArray(vocabulary.id, excludeIds)
            : undefined
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(remaining);

    for (const word of newWords) {
      selectedWords.push(word);
      selectedIds.push(word.id);
    }
  }

  // 4. If not enough new words at current level, get random words at current level
  //    (including previously seen ones, but not already selected)
  if (selectedWords.length < sessionSize) {
    const remaining = sessionSize - selectedWords.length;

    const randomWords = await db
      .select()
      .from(vocabulary)
      .where(
        and(
          eq(vocabulary.difficultyLevel, currentLevel),
          eq(vocabulary.isActive, true),
          selectedIds.length > 0
            ? notInArray(vocabulary.id, selectedIds)
            : undefined
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(remaining);

    for (const word of randomWords) {
      selectedWords.push(word);
      selectedIds.push(word.id);
    }
  }

  // 5. If STILL not enough (level has few words), get from any level
  if (selectedWords.length < sessionSize) {
    const remaining = sessionSize - selectedWords.length;

    const anyWords = await db
      .select()
      .from(vocabulary)
      .where(
        and(
          eq(vocabulary.isActive, true),
          selectedIds.length > 0
            ? notInArray(vocabulary.id, selectedIds)
            : undefined
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(remaining);

    for (const word of anyWords) {
      selectedWords.push(word);
      selectedIds.push(word.id);
    }
  }

  // Shuffle to avoid predictable ordering (failed words always first, etc.)
  return shuffleArray(selectedWords);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
