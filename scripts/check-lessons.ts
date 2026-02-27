import "dotenv/config";
import { db } from "../db";
import {
  lessons,
  lessonVocabulary,
  vocabulary,
  vocabularyCategories,
  wordCategories,
} from "../db/schema";
import { eq, inArray } from "drizzle-orm";

async function check() {
  const allLV = await db
    .select({
      lessonId: lessonVocabulary.lessonId,
      vocabId: lessonVocabulary.vocabularyId,
    })
    .from(lessonVocabulary);
  const allLessons = await db.select().from(lessons);

  const isOrganized = (title: string) => /^Lesson \d+:/.test(title);
  const organizedIds = new Set(
    allLessons.filter((l) => isOrganized(l.title)).map((l) => l.id)
  );
  const expandedIds = new Set(
    allLessons.filter((l) => !isOrganized(l.title)).map((l) => l.id)
  );

  // Find words only in organized lessons
  const orgWords = new Set<string>();
  const expWords = new Set<string>();
  for (const lv of allLV) {
    if (organizedIds.has(lv.lessonId)) orgWords.add(lv.vocabId);
    if (expandedIds.has(lv.lessonId)) expWords.add(lv.vocabId);
  }

  const onlyInOrganized: string[] = [];
  for (const w of orgWords) {
    if (!expWords.has(w)) onlyInOrganized.push(w);
  }

  console.log(`Words only in organized lessons: ${onlyInOrganized.length}`);

  if (onlyInOrganized.length === 0) {
    console.log("All organized words also exist in expanded lessons.");
    process.exit(0);
  }

  // Get vocab details
  const orphanVocab = await db
    .select()
    .from(vocabulary)
    .where(inArray(vocabulary.id, onlyInOrganized));

  // Get their categories
  const vocabCats = await db
    .select({
      vocabId: vocabularyCategories.vocabularyId,
      catName: wordCategories.name,
    })
    .from(vocabularyCategories)
    .innerJoin(
      wordCategories,
      eq(wordCategories.id, vocabularyCategories.categoryId)
    );

  const vocabCatMap = new Map<string, string[]>();
  for (const vc of vocabCats) {
    if (!vocabCatMap.has(vc.vocabId)) vocabCatMap.set(vc.vocabId, []);
    vocabCatMap.get(vc.vocabId)!.push(vc.catName);
  }

  let hasCategory = 0;
  let noCategory = 0;

  console.log(`\nOrphaned words (only in organized lessons):`);
  for (const v of orphanVocab) {
    const cats = vocabCatMap.get(v.id) || [];
    console.log(
      `  "${v.phonetic}" (${v.englishTranslation}) - cats: [${cats.join(", ")}] - level: ${v.difficultyLevel}`
    );
    if (cats.length > 0) hasCategory++;
    else noCategory++;
  }

  console.log(`\nWith categories: ${hasCategory}, without: ${noCategory}`);

  // Count by difficulty level
  const byLevel: Record<number, number> = {};
  for (const v of orphanVocab) {
    const lvl = v.difficultyLevel ?? 0;
    byLevel[lvl] = (byLevel[lvl] || 0) + 1;
  }
  console.log(`By difficulty level:`, byLevel);

  process.exit(0);
}

check().catch(console.error);
