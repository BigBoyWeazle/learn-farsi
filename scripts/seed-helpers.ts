import { db } from "../db";
import {
  vocabulary,
  wordCategories,
  vocabularyCategories,
  lessons,
  lessonVocabulary,
} from "../db/schema";
import { eq, and } from "drizzle-orm";

export interface WordData {
  farsiWord: string;
  phonetic: string;
  englishTranslation: string;
  exampleFarsi: string;
  examplePhonetic: string;
  exampleEnglish: string;
  difficultyLevel: number;
  isFormal?: boolean;
  entryType?: "word" | "phrase" | "sentence";
}

interface SeedCategoryConfig {
  name: string;
  slug: string;
  description: string;
  icon: string;
  level: number;
  sortOrder: number;
  words: WordData[];
  maxWordsPerLesson?: number;
}

/**
 * Seeds a category with words, creates lesson(s), and assigns words to lessons.
 * Idempotent — safe to re-run. Skips existing categories/words.
 *
 * If a category has more words than maxWordsPerLesson, it splits into multiple lessons.
 */
export async function seedCategory(config: SeedCategoryConfig) {
  const {
    name,
    slug,
    description,
    icon,
    level,
    sortOrder,
    words,
    maxWordsPerLesson,
  } = config;

  // Default words per lesson based on level
  const defaultMax: Record<number, number> = {
    1: 10,
    2: 12,
    3: 15,
    4: 18,
    5: 20,
  };
  const wordsPerLesson = maxWordsPerLesson || defaultMax[level] || 15;

  // 1. Create or find category
  const existing = await db
    .select()
    .from(wordCategories)
    .where(eq(wordCategories.slug, slug));

  let category;
  if (existing.length === 0) {
    const result = await db
      .insert(wordCategories)
      .values({ name, slug, description, icon, difficultyLevel: level, sortOrder })
      .returning();
    category = result[0];
  } else {
    category = existing[0];
  }

  // 2. Insert words and link to category
  const insertedWordIds: string[] = [];
  let wordsAdded = 0;

  for (const word of words) {
    // Check for existing word by phonetic + english (compound dedup)
    const existingWord = await db
      .select()
      .from(vocabulary)
      .where(
        and(
          eq(vocabulary.phonetic, word.phonetic),
          eq(vocabulary.englishTranslation, word.englishTranslation)
        )
      );

    let wordId: string;
    if (existingWord.length === 0) {
      const inserted = await db
        .insert(vocabulary)
        .values({ ...word, isActive: true })
        .returning();
      wordId = inserted[0].id;
      wordsAdded++;
    } else {
      wordId = existingWord[0].id;
    }

    insertedWordIds.push(wordId);

    // Link word to category (check first)
    const existingLink = await db
      .select()
      .from(vocabularyCategories)
      .where(
        and(
          eq(vocabularyCategories.vocabularyId, wordId),
          eq(vocabularyCategories.categoryId, category.id)
        )
      );

    if (existingLink.length === 0) {
      await db.insert(vocabularyCategories).values({
        vocabularyId: wordId,
        categoryId: category.id,
      });
    }
  }

  // 3. Create lesson(s) and assign words
  const numLessons = Math.max(1, Math.ceil(words.length / wordsPerLesson));
  let lessonsCreated = 0;

  for (let i = 0; i < numLessons; i++) {
    const lessonTitle =
      numLessons === 1 ? name : `${name} (Part ${i + 1})`;
    const lessonSortOrder = sortOrder * 10 + i;

    // Check if lesson already exists for this category with this title
    const existingLesson = await db
      .select()
      .from(lessons)
      .where(
        and(
          eq(lessons.categoryId, category.id),
          eq(lessons.title, lessonTitle)
        )
      );

    let lessonId: string;
    if (existingLesson.length === 0) {
      const created = await db
        .insert(lessons)
        .values({
          categoryId: category.id,
          title: lessonTitle,
          description,
          difficultyLevel: level,
          sortOrder: lessonSortOrder,
          isActive: true,
        })
        .returning();
      lessonId = created[0].id;
      lessonsCreated++;
    } else {
      lessonId = existingLesson[0].id;
    }

    // Assign words to this lesson
    const start = i * wordsPerLesson;
    const end = Math.min(start + wordsPerLesson, insertedWordIds.length);
    const chunkIds = insertedWordIds.slice(start, end);

    for (let j = 0; j < chunkIds.length; j++) {
      const existingAssignment = await db
        .select()
        .from(lessonVocabulary)
        .where(
          and(
            eq(lessonVocabulary.lessonId, lessonId),
            eq(lessonVocabulary.vocabularyId, chunkIds[j])
          )
        );

      if (existingAssignment.length === 0) {
        await db.insert(lessonVocabulary).values({
          lessonId,
          vocabularyId: chunkIds[j],
          sortOrder: j,
        });
      }
    }
  }

  console.log(
    `  ✓ ${name}: ${wordsAdded} new words (${words.length} total), ${lessonsCreated} new lessons`
  );

  return { wordsAdded, lessonsCreated };
}
