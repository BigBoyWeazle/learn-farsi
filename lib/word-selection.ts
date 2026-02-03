/**
 * Smart word selection algorithm for practice sessions
 * Prioritizes: failed words → due for review → new words
 */

import { db } from "@/db";
import { vocabulary, wordCategories, vocabularyCategories } from "@/db/schema";
import { eq, and, lte, notInArray, inArray, sql } from "drizzle-orm";
import type { Vocabulary } from "@/db/schema";

export interface WordSelectionOptions {
  sessionSize: number;
  currentLevel: number;
}

/**
 * Select words for a practice session using intelligent prioritization
 * Priority: failed words (from localStorage) → due for review → new words
 */
export async function selectWordsForSession(
  options: WordSelectionOptions
): Promise<Vocabulary[]> {
  const { sessionSize, currentLevel } = options;
  const selectedWords: Vocabulary[] = [];

  // 1. Get failed words from localStorage (words with consecutiveWrong > 0)
  const failedWordIds = getFailedWordIds();
  if (failedWordIds.length > 0) {
    const failedWords = await db
      .select()
      .from(vocabulary)
      .where(
        and(
          inArray(vocabulary.id, failedWordIds),
          eq(vocabulary.difficultyLevel, currentLevel),
          eq(vocabulary.isActive, true)
        )
      )
      .limit(Math.min(2, sessionSize)); // Max 2 failed words per session

    selectedWords.push(...failedWords);
  }

  // 2. Get due words (nextReviewDate <= today) from localStorage
  if (selectedWords.length < sessionSize) {
    const dueWordIds = getDueWordIds();
    const remainingSlots = sessionSize - selectedWords.length;

    if (dueWordIds.length > 0) {
      const alreadySelected = selectedWords.map((w) => w.id);
      const dueWords = await db
        .select()
        .from(vocabulary)
        .where(
          and(
            inArray(vocabulary.id, dueWordIds),
            eq(vocabulary.difficultyLevel, currentLevel),
            eq(vocabulary.isActive, true),
            alreadySelected.length > 0
              ? notInArray(vocabulary.id, alreadySelected)
              : undefined
          )
        )
        .limit(Math.min(2, remainingSlots)); // Max 2 due words per session

      selectedWords.push(...dueWords);
    }
  }

  // 3. Fill remaining slots with new words (category rotation)
  if (selectedWords.length < sessionSize) {
    const remainingSlots = sessionSize - selectedWords.length;
    const alreadySelected = selectedWords.map((w) => w.id);
    const seenWordIds = getSeenWordIds();

    const newWords = await selectNewWordsWithCategoryRotation(
      currentLevel,
      remainingSlots,
      [...alreadySelected, ...seenWordIds]
    );

    selectedWords.push(...newWords);
  }

  // 4. If still not enough words, get truly random words from current level
  if (selectedWords.length < sessionSize) {
    const remainingSlots = sessionSize - selectedWords.length;
    const alreadySelected = selectedWords.map((w) => w.id);

    const randomWords = await db
      .select()
      .from(vocabulary)
      .where(
        and(
          eq(vocabulary.difficultyLevel, currentLevel),
          eq(vocabulary.isActive, true),
          alreadySelected.length > 0
            ? notInArray(vocabulary.id, alreadySelected)
            : undefined
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(remainingSlots);

    selectedWords.push(...randomWords);
  }

  // 5. If STILL not enough (level might have few words), get random from ANY level
  if (selectedWords.length < sessionSize) {
    const remainingSlots = sessionSize - selectedWords.length;
    const alreadySelected = selectedWords.map((w) => w.id);

    const anyWords = await db
      .select()
      .from(vocabulary)
      .where(
        and(
          eq(vocabulary.isActive, true),
          alreadySelected.length > 0
            ? notInArray(vocabulary.id, alreadySelected)
            : undefined
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(remainingSlots);

    selectedWords.push(...anyWords);
  }

  // Shuffle the selected words to avoid predictable ordering
  return shuffleArray(selectedWords);
}

/**
 * Select new words with category rotation for variety
 */
async function selectNewWordsWithCategoryRotation(
  currentLevel: number,
  count: number,
  excludeWordIds: string[]
): Promise<Vocabulary[]> {
  // Get last practiced category from localStorage
  const lastCategorySlug = getLastPracticedCategory();

  // Get all categories for current level
  const categories = await db
    .select()
    .from(wordCategories)
    .where(
      and(
        eq(wordCategories.difficultyLevel, currentLevel),
        eq(wordCategories.isActive, true)
      )
    )
    .orderBy(wordCategories.sortOrder);

  if (categories.length === 0) {
    // No categories, fallback to random selection
    return db
      .select()
      .from(vocabulary)
      .where(
        and(
          eq(vocabulary.difficultyLevel, currentLevel),
          eq(vocabulary.isActive, true),
          excludeWordIds.length > 0
            ? notInArray(vocabulary.id, excludeWordIds)
            : undefined
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(count);
  }

  // Find next category to practice
  let nextCategoryIndex = 0;
  if (lastCategorySlug) {
    const lastIndex = categories.findIndex((cat) => cat.slug === lastCategorySlug);
    nextCategoryIndex = (lastIndex + 1) % categories.length;
  }

  const nextCategory = categories[nextCategoryIndex];

  // Save this category as last practiced
  saveLastPracticedCategory(nextCategory.slug);

  // Get words from this category
  const categoryWordIds = await db
    .select({ vocabularyId: vocabularyCategories.vocabularyId })
    .from(vocabularyCategories)
    .where(eq(vocabularyCategories.categoryId, nextCategory.id));

  if (categoryWordIds.length === 0) {
    // Category has no words, fallback to random
    return db
      .select()
      .from(vocabulary)
      .where(
        and(
          eq(vocabulary.difficultyLevel, currentLevel),
          eq(vocabulary.isActive, true),
          excludeWordIds.length > 0
            ? notInArray(vocabulary.id, excludeWordIds)
            : undefined
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(count);
  }

  const wordIds = categoryWordIds.map((w) => w.vocabularyId);
  const availableWordIds = excludeWordIds.length > 0
    ? wordIds.filter((id) => !excludeWordIds.includes(id))
    : wordIds;

  if (availableWordIds.length === 0) {
    // All words in category already seen, fallback to random
    return db
      .select()
      .from(vocabulary)
      .where(
        and(
          eq(vocabulary.difficultyLevel, currentLevel),
          eq(vocabulary.isActive, true),
          excludeWordIds.length > 0
            ? notInArray(vocabulary.id, excludeWordIds)
            : undefined
        )
      )
      .orderBy(sql`RANDOM()`)
      .limit(count);
  }

  return db
    .select()
    .from(vocabulary)
    .where(
      and(
        inArray(vocabulary.id, availableWordIds),
        eq(vocabulary.isActive, true)
      )
    )
    .orderBy(sql`RANDOM()`)
    .limit(count);
}

// Helper functions for localStorage

function getFailedWordIds(): string[] {
  if (typeof window === "undefined") return [];

  const failedIds: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("progress_")) {
      const progress = JSON.parse(localStorage.getItem(key) || "{}");
      if (progress.consecutiveWrong > 0) {
        failedIds.push(progress.vocabularyId);
      }
    }
  }
  return failedIds;
}

function getDueWordIds(): string[] {
  if (typeof window === "undefined") return [];

  const today = new Date().toISOString().split("T")[0];
  const dueIds: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("progress_")) {
      const progress = JSON.parse(localStorage.getItem(key) || "{}");
      if (progress.nextReviewDate) {
        const reviewDate = progress.nextReviewDate.split("T")[0];
        if (reviewDate <= today) {
          dueIds.push(progress.vocabularyId);
        }
      }
    }
  }
  return dueIds;
}

function getSeenWordIds(): string[] {
  if (typeof window === "undefined") return [];

  const seenIds: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith("progress_")) {
      const progress = JSON.parse(localStorage.getItem(key) || "{}");
      seenIds.push(progress.vocabularyId);
    }
  }
  return seenIds;
}

function getLastPracticedCategory(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("lastCategory");
}

function saveLastPracticedCategory(slug: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("lastCategory", slug);
}

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
