import "dotenv/config";
import { db } from "../db";
import { vocabulary, vocabularyCategories, wordCategories } from "../db/schema";
import { eq, and, sql } from "drizzle-orm";

/**
 * One-time migration script to classify all existing vocabulary entries
 * into "word", "phrase", or "sentence" types.
 *
 * Run with: npx tsx scripts/set-entry-types.ts
 */

// Categories whose entries are full sentences (proverbs, idioms)
const SENTENCE_CATEGORIES = ["Proverbs & Idioms"];

// Categories whose multi-word entries are phrases
const PHRASE_CATEGORIES = [
  "Common Phrases",
  "Greetings",
  "Basic Greetings",
  "Daily Routines",
  "Time Expressions",
  "Connectors & Discourse",
  "Formal & Written Farsi",
  "Opinions & Discussion",
];

// Farsi verb infinitive suffixes — entries ending with these are phrasal verbs
const VERB_SUFFIXES = [
  "کردن",
  "شدن",
  "دادن",
  "گرفتن",
  "زدن",
  "خوردن",
  "بردن",
  "رفتن",
  "آوردن",
  "آمدن",
  "داشتن",
  "ماندن",
  "کشیدن",
  "انداختن",
  "خواستن",
];

// Known compound nouns that look multi-word but are single concepts → stay as "word"
const COMPOUND_NOUNS = new Set([
  "تخم مرغ",
  "آب میوه",
  "اتاق خواب",
  "پمپ بنزین",
  "کیف پول",
  "باقی پول",
  "دفتر کار",
  "رئیس جمهور",
  "کارت اعتباری",
  "نرخ ارز",
  "دستور غذا",
  "تجزیه و تحلیل",
  "نیمه شب",
  "بعد از ظهر",
]);

async function main() {
  console.log("Classifying vocabulary entries...\n");

  // Get all vocab with their categories
  const allVocab = await db.select().from(vocabulary);
  const vocabCategories = await db
    .select({
      vocabularyId: vocabularyCategories.vocabularyId,
      categoryName: wordCategories.name,
    })
    .from(vocabularyCategories)
    .innerJoin(wordCategories, eq(wordCategories.id, vocabularyCategories.categoryId));

  // Build a map: vocabId → category names
  const catMap: Record<string, string[]> = {};
  for (const vc of vocabCategories) {
    if (!catMap[vc.vocabularyId]) catMap[vc.vocabularyId] = [];
    catMap[vc.vocabularyId].push(vc.categoryName);
  }

  let sentences = 0;
  let phrases = 0;
  let words = 0;

  for (const word of allVocab) {
    const categories = catMap[word.id] || [];
    let entryType = "word";

    // 1. Check if in a sentence category (proverbs/idioms)
    if (categories.some((c) => SENTENCE_CATEGORIES.includes(c))) {
      entryType = "sentence";
    }
    // 2. Check if in a phrase category and is multi-word
    else if (
      word.farsiWord.includes(" ") &&
      categories.some((c) => PHRASE_CATEGORIES.includes(c))
    ) {
      // Skip known compound nouns
      if (!COMPOUND_NOUNS.has(word.farsiWord)) {
        entryType = "phrase";
      }
    }
    // 3. Check if it ends with a Farsi verb infinitive (phrasal verb)
    else if (
      word.farsiWord.includes(" ") &&
      VERB_SUFFIXES.some((suffix) => word.farsiWord.endsWith(suffix))
    ) {
      if (!COMPOUND_NOUNS.has(word.farsiWord)) {
        entryType = "phrase";
      }
    }

    // Update if not default
    if (entryType !== "word") {
      await db
        .update(vocabulary)
        .set({ entryType })
        .where(eq(vocabulary.id, word.id));
    }

    if (entryType === "sentence") sentences++;
    else if (entryType === "phrase") phrases++;
    else words++;
  }

  console.log(`Classification complete:`);
  console.log(`  Words:     ${words}`);
  console.log(`  Phrases:   ${phrases}`);
  console.log(`  Sentences: ${sentences}`);
  console.log(`  Total:     ${allVocab.length}\n`);

  process.exit(0);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
