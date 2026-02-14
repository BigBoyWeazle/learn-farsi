import "dotenv/config";
import { db } from "../db";
import { lessons, vocabulary, vocabularyCategories, lessonVocabulary } from "../db/schema";
import { eq, sql } from "drizzle-orm";

/**
 * Migrates lesson-word associations from the category-based system
 * to the direct lesson_vocabulary junction table.
 *
 * For categories used by a single lesson: all words go to that lesson.
 * For categories shared by multiple lessons: words are split evenly
 * across lessons in their sort order.
 *
 * Run with: tsx scripts/migrate-lesson-words.ts
 */

async function main() {
  console.log("Migrating lesson-word associations...\n");

  // Clear existing data
  await db.execute(sql`DELETE FROM lesson_vocabulary`);

  // Get all lessons ordered by sort order
  const allLessons = await db
    .select()
    .from(lessons)
    .orderBy(lessons.sortOrder);

  // Group lessons by category
  const categoryGroups: Record<string, typeof allLessons> = {};
  for (const lesson of allLessons) {
    if (!categoryGroups[lesson.categoryId]) {
      categoryGroups[lesson.categoryId] = [];
    }
    categoryGroups[lesson.categoryId].push(lesson);
  }

  let totalAssigned = 0;

  for (const [categoryId, lessonsInCategory] of Object.entries(categoryGroups)) {
    // Get all words in this category
    const wordsInCategory = await db
      .select({ word: vocabulary })
      .from(vocabularyCategories)
      .innerJoin(vocabulary, eq(vocabularyCategories.vocabularyId, vocabulary.id))
      .where(eq(vocabularyCategories.categoryId, categoryId));

    const words = wordsInCategory.map((w) => w.word);

    if (words.length === 0) {
      console.log(`  Skipping ${lessonsInCategory[0].title} - no words in category`);
      continue;
    }

    if (lessonsInCategory.length === 1) {
      // Single lesson for this category - assign all words
      const lesson = lessonsInCategory[0];
      for (let i = 0; i < words.length; i++) {
        await db.insert(lessonVocabulary).values({
          lessonId: lesson.id,
          vocabularyId: words[i].id,
          sortOrder: i,
        });
      }
      console.log(`  ${lesson.title}: ${words.length} words`);
      totalAssigned += words.length;
    } else {
      // Multiple lessons share this category - split words
      const chunkSize = Math.ceil(words.length / lessonsInCategory.length);

      for (let li = 0; li < lessonsInCategory.length; li++) {
        const lesson = lessonsInCategory[li];
        const start = li * chunkSize;
        const end = Math.min(start + chunkSize, words.length);
        const chunk = words.slice(start, end);

        for (let i = 0; i < chunk.length; i++) {
          await db.insert(lessonVocabulary).values({
            lessonId: lesson.id,
            vocabularyId: chunk[i].id,
            sortOrder: i,
          });
        }
        console.log(`  ${lesson.title}: ${chunk.length} words (${start}-${end - 1})`);
        totalAssigned += chunk.length;
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("MIGRATION COMPLETE!");
  console.log("=".repeat(50));
  console.log(`\nTotal word-lesson associations created: ${totalAssigned}`);
  console.log(`Lessons processed: ${allLessons.length}\n`);

  process.exit(0);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
