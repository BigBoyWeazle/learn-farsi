import "dotenv/config";
import { db } from "../db";
import {
  vocabulary,
  vocabularyCategories,
  wordCategories,
  userProgress,
} from "../db/schema";
import { eq, and } from "drizzle-orm";
import { distance } from "fastest-levenshtein";

/**
 * Vocabulary audit script: finds duplicates and flags incorrect difficulty levels.
 *
 * Run with: npx tsx scripts/audit-vocabulary.ts          (dry run)
 *           npx tsx scripts/audit-vocabulary.ts --apply   (apply fixes)
 */

const DRY_RUN = !process.argv.includes("--apply");

type Vocab = typeof vocabulary.$inferSelect;

// ── Phonetic normalization ──────────────────────────────────────────────

function normalizePhonetic(phonetic: string | null): string {
  if (!phonetic) return "";
  let p = phonetic.toLowerCase().trim();
  // Strip dashes, apostrophes
  p = p.replace(/[-'ʼ'`]/g, "");
  // Collapse whitespace
  p = p.replace(/\s+/g, " ");
  // oo/ou/u → oo
  p = p.replace(/ou/g, "oo");
  p = p.replace(/(?<![aeioo])u(?![aeioo])/g, "oo");
  // ey/ay → ei
  p = p.replace(/ey\b/g, "ei");
  p = p.replace(/ay\b/g, "ei");
  // gh → q (same sound)
  p = p.replace(/gh/g, "q");
  // terminal eh → e
  p = p.replace(/eh\b/g, "e");
  return p;
}

// ── Completeness scoring (for choosing which duplicate to keep) ─────────

function completenessScore(word: Vocab): number {
  let score = 0;
  if (word.exampleFarsi) score += 3;
  if (word.examplePhonetic) score += 2;
  if (word.exampleEnglish) score += 2;
  if (word.phonetic) score += 1;
  if (word.englishTranslation.includes("/")) score += 1;
  return score;
}

// ── Translation overlap check ───────────────────────────────────────────

function translationsOverlap(a: string, b: string): boolean {
  const wordsA = new Set(
    a
      .toLowerCase()
      .split(/[\/,\s]+/)
      .filter((w) => w.length > 2)
  );
  const wordsB = new Set(
    b
      .toLowerCase()
      .split(/[\/,\s]+/)
      .filter((w) => w.length > 2)
  );
  for (const w of wordsA) {
    if (wordsB.has(w)) return true;
  }
  return false;
}

// ── Category → expected difficulty mapping ──────────────────────────────

const CATEGORY_DIFFICULTY: Record<string, number> = {
  // Level 1
  "Basic Greetings": 1,
  "Essential Words": 1,
  "Numbers 1-10": 1,
  Colors: 1,
  Prepositions: 1,
  "Common Phrases": 1,
  Pronouns: 1,
  "Everyday Objects": 1,
  "Basic Food": 1,
  "Family Basics": 1,
  "Numbers 11-20": 1,
  "Basic Adjectives": 1,
  "Simple Verbs": 1,
  Greetings: 1,
  // Level 2
  "Time & Days": 2,
  "Question Words": 2,
  "Common Adjectives": 2,
  "Family Members": 2,
  "Conjunctions & Adverbs": 2,
  "Jobs & Work": 2,
  Weather: 2,
  Animals: 2,
  "Body Parts": 2,
  Clothes: 2,
  "Basic Verbs Part 1": 2,
  "Basic Verbs Part 2": 2,
  "Food & Drink Expanded": 2,
  "Home & Furniture": 2,
  "Places Around Town": 2,
  Transportation: 2,
  "Emotions & Feelings": 2,
  "Daily Routines": 2,
  "Large Numbers & Ordinals": 2,
  "Common Verbs 2": 2,
  "Household Items": 2,
  "Shopping & Money": 2,
  // Level 3
  "Countries & Travel": 3,
  "Phrasal Verbs Part 1": 3,
  "Phrasal Verbs Part 2": 3,
  "Abstract Concepts": 3,
  "Education & Learning": 3,
  "Health & Body": 3,
  "At the Restaurant": 3,
  "Directions & Location": 3,
  "Nature & Environment": 3,
  Technology: 3,
  "Sports & Hobbies": 3,
  "Office & Work": 3,
  "Opinions & Discussion": 3,
  "Time Expressions": 3,
  "Verbs of Motion": 3,
  "Descriptive Adjectives": 3,
  // Level 4
  "Formal Expressions": 4,
  "Feelings & Mental States": 4,
  "Law & Government": 4,
  "Media & News": 4,
  "Banking & Finance": 4,
  "Housing & Real Estate": 4,
  "Education Advanced": 4,
  "Cooking & Kitchen": 4,
  "Cultural Vocabulary": 4,
  "Advanced Verbs": 4,
  "Connectors & Discourse": 4,
  "Formal & Written Farsi": 4,
  // Level 5
  "Academic & Professional": 5,
  "Nuanced Emotions": 5,
  "Proverbs & Idioms": 5,
  "Literature & Poetry": 5,
  "Philosophy & Abstract": 5,
  "Advanced Phrasal Verbs": 5,
};

// ── Difficulty suggestion heuristics ────────────────────────────────────

const HIGH_FREQ_WORDS = new Set([
  "hello", "hi", "goodbye", "bye", "yes", "no", "please", "thanks",
  "thank", "good", "bad", "big", "small", "water", "food", "bread",
  "house", "home", "man", "woman", "child", "mother", "father",
  "brother", "sister", "today", "tomorrow", "yesterday", "morning",
  "night", "name", "door", "tea", "milk", "rice", "come", "go",
  "eat", "drink", "sleep", "friend", "love", "day", "white", "black",
  "red", "blue", "green", "one", "two", "three", "four", "five",
]);

const NICHE_WORDS = new Set([
  "conference", "methodology", "analysis", "hypothesis", "theory",
  "legislation", "jurisdiction", "monetary", "fiscal", "manuscript",
  "dissertation", "bureaucracy", "infrastructure", "innovation",
  "strategy", "philosophy", "rhetoric", "metaphor", "paradigm",
]);

function suggestDifficulty(
  word: Vocab,
  categories: string[]
): { suggested: number; reasons: string[] } | null {
  const reasons: string[] = [];
  let suggested: number | null = null;

  // Rule 1: Category-based (primary signal)
  for (const cat of categories) {
    const catLevel = CATEGORY_DIFFICULTY[cat];
    if (catLevel !== undefined) {
      if (suggested === null || catLevel < suggested) {
        suggested = catLevel;
      }
      reasons.push(`Category "${cat}" → level ${catLevel}`);
    }
  }

  // Rule 2: Sentences/proverbs should be high difficulty
  if (word.entryType === "sentence") {
    const min = 4;
    if (suggested !== null && suggested < min) {
      reasons.push(`Sentence/proverb should be ≥ ${min}`);
      suggested = min;
    } else if (suggested === null) {
      suggested = 5;
      reasons.push("Sentence defaults to level 5");
    }
  }

  // Rule 3: Formal register ≥ 3
  if (word.isFormal && suggested !== null && suggested < 3) {
    reasons.push("Formal register word should be ≥ 3");
    suggested = 3;
  }

  // Rule 4: High-frequency English concepts → cap at level 2 (never raise)
  // Skip for sentences/proverbs — their difficulty comes from structure, not word frequency
  if (word.englishTranslation && word.entryType !== "sentence") {
    const engWords = word.englishTranslation
      .toLowerCase()
      .split(/[\/,\s]+/)
      .filter((w) => w.length > 1);
    const isHighFreq = engWords.some((w) => HIGH_FREQ_WORDS.has(w));
    if (isHighFreq) {
      const current = suggested ?? word.difficultyLevel ?? 1;
      if (current > 2) {
        // Don't drop more than 2 levels from category suggestion (prevents
        // "To go well" L5 → L2 just because "go" is high-freq)
        const floor = suggested !== null ? Math.max(suggested - 2, 2) : 2;
        const target = Math.max(floor, 2);
        reasons.push(
          `High-frequency concept "${word.englishTranslation}" should be ≤ 2`
        );
        suggested = target;
      } else if (suggested === null) {
        // Actively claim this level so phonetic-length fallback doesn't raise it
        suggested = current;
      }
    }

    // Niche/specialized terms → floor at level 4 (never lower)
    const isNiche = engWords.some((w) => NICHE_WORDS.has(w));
    if (isNiche) {
      const current = suggested ?? word.difficultyLevel ?? 5;
      if (current < 4) {
        reasons.push(
          `Specialized term "${word.englishTranslation}" should be ≥ 4`
        );
        suggested = 4;
      }
    }
  }

  // Rule 5: Phonetic length as fallback (only if no category signal)
  if (suggested === null && word.phonetic) {
    const phoneticLen = word.phonetic.length;
    const wordCount = word.phonetic.split(/\s+/).length;

    if (wordCount === 1 && phoneticLen <= 5) {
      suggested = 1;
      reasons.push(`Short single word (${phoneticLen} chars)`);
    } else if (wordCount === 1 && phoneticLen <= 8) {
      suggested = 2;
      reasons.push(`Medium single word (${phoneticLen} chars)`);
    } else if (wordCount >= 3) {
      suggested = 4;
      reasons.push(`Multi-word expression (${wordCount} words)`);
    }
  }

  // Only return if we have a suggestion different from current
  if (suggested !== null && suggested !== word.difficultyLevel) {
    return { suggested, reasons };
  }
  return null;
}

// ── Duplicate detection ─────────────────────────────────────────────────

async function auditDuplicates(allVocab: Vocab[]) {
  console.log("\n" + "=".repeat(60));
  console.log("  DUPLICATE DETECTION");
  console.log("=".repeat(60));

  // Tier 1: Group by normalized phonetic
  const phoneticGroups: Record<string, Vocab[]> = {};
  for (const word of allVocab) {
    const norm = normalizePhonetic(word.phonetic);
    if (!norm) continue;
    if (!phoneticGroups[norm]) phoneticGroups[norm] = [];
    phoneticGroups[norm].push(word);
  }

  // Also group by identical farsiWord
  const farsiGroups: Record<string, Vocab[]> = {};
  for (const word of allVocab) {
    if (!word.farsiWord) continue;
    const key = word.farsiWord.trim();
    if (!farsiGroups[key]) farsiGroups[key] = [];
    farsiGroups[key].push(word);
  }

  // Merge duplicate sets — combine phonetic and farsi matches
  const dupeSetMap = new Map<string, Set<string>>(); // wordId → set of dupe ids
  const addPair = (a: string, b: string) => {
    const setA = dupeSetMap.get(a);
    const setB = dupeSetMap.get(b);
    const merged = new Set([a, b, ...(setA ?? []), ...(setB ?? [])]);
    for (const id of merged) {
      dupeSetMap.set(id, merged);
    }
  };

  // From phonetic groups
  for (const [, words] of Object.entries(phoneticGroups)) {
    if (words.length < 2) continue;
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j < words.length; j++) {
        if (translationsOverlap(words[i].englishTranslation, words[j].englishTranslation)) {
          addPair(words[i].id, words[j].id);
        }
      }
    }
  }

  // From farsi groups
  for (const [, words] of Object.entries(farsiGroups)) {
    if (words.length < 2) continue;
    for (let i = 0; i < words.length; i++) {
      for (let j = i + 1; j < words.length; j++) {
        if (translationsOverlap(words[i].englishTranslation, words[j].englishTranslation)) {
          addPair(words[i].id, words[j].id);
        }
      }
    }
  }

  // Deduplicate sets
  const seen = new Set<string>();
  const exactDupeSets: Vocab[][] = [];
  for (const [id, set] of dupeSetMap.entries()) {
    if (seen.has(id)) continue;
    for (const s of set) seen.add(s);
    const vocabSet = [...set]
      .map((sid) => allVocab.find((v) => v.id === sid)!)
      .filter(Boolean);
    if (vocabSet.length >= 2) {
      exactDupeSets.push(vocabSet);
    }
  }

  // Tier 2: Fuzzy matching on singletons
  const singletonsNorm = Object.entries(phoneticGroups)
    .filter(([, words]) => words.length === 1)
    .filter(([, words]) => !seen.has(words[0].id))
    .map(([norm, words]) => ({ norm, word: words[0] }));

  const fuzzyPairs: Array<{ a: Vocab; b: Vocab; dist: number }> = [];
  for (let i = 0; i < singletonsNorm.length; i++) {
    for (let j = i + 1; j < singletonsNorm.length; j++) {
      const normA = singletonsNorm[i].norm;
      const normB = singletonsNorm[j].norm;
      if (Math.min(normA.length, normB.length) < 4) continue;
      const d = distance(normA, normB);
      if (d <= 2 && d > 0) {
        const a = singletonsNorm[i].word;
        const b = singletonsNorm[j].word;
        if (translationsOverlap(a.englishTranslation, b.englishTranslation)) {
          fuzzyPairs.push({ a, b, dist: d });
        }
      }
    }
  }

  // Report exact duplicates
  console.log(`\n  EXACT DUPLICATES: ${exactDupeSets.length} groups\n`);
  let totalToDelete = 0;

  for (let i = 0; i < exactDupeSets.length; i++) {
    const group = exactDupeSets[i].sort(
      (a, b) => completenessScore(b) - completenessScore(a)
    );
    const keep = group[0];
    const dupes = group.slice(1);
    totalToDelete += dupes.length;

    console.log(`  Group ${i + 1}:`);
    console.log(
      `    KEEP:   "${keep.phonetic}" — "${keep.englishTranslation}" (score: ${completenessScore(keep)})`
    );
    for (const d of dupes) {
      console.log(
        `    DELETE: "${d.phonetic}" — "${d.englishTranslation}" (score: ${completenessScore(d)})`
      );
    }
  }

  // Report fuzzy matches
  if (fuzzyPairs.length > 0) {
    console.log(
      `\n  FUZZY MATCHES (review manually): ${fuzzyPairs.length} pairs\n`
    );
    for (const pair of fuzzyPairs) {
      console.log(
        `    "${pair.a.phonetic}" ↔ "${pair.b.phonetic}" (distance: ${pair.dist})`
      );
      console.log(
        `      A: "${pair.a.englishTranslation}"  B: "${pair.b.englishTranslation}"`
      );
    }
  }

  console.log(`\n  Summary: ${totalToDelete} exact duplicates to remove`);
  if (fuzzyPairs.length > 0) {
    console.log(`           ${fuzzyPairs.length} fuzzy matches to review`);
  }

  // Apply deletions
  if (!DRY_RUN && totalToDelete > 0) {
    console.log(`\n  Applying deletions...`);
    for (const group of exactDupeSets) {
      const sorted = group.sort(
        (a, b) => completenessScore(b) - completenessScore(a)
      );
      const keepId = sorted[0].id;
      for (const dupe of sorted.slice(1)) {
        await safeDeleteDuplicate(keepId, dupe.id);
        console.log(`    Deleted "${dupe.phonetic}" (${dupe.id})`);
      }
    }
    console.log("  Done.");
  }
}

async function safeDeleteDuplicate(keepId: string, deleteId: string) {
  // Migrate user progress from deleted word to kept word
  const progressRows = await db
    .select()
    .from(userProgress)
    .where(eq(userProgress.vocabularyId, deleteId));

  for (const prog of progressRows) {
    const existing = await db
      .select()
      .from(userProgress)
      .where(
        and(
          eq(userProgress.userId, prog.userId),
          eq(userProgress.vocabularyId, keepId)
        )
      );

    if (existing.length === 0) {
      // Move progress to kept word
      await db
        .update(userProgress)
        .set({ vocabularyId: keepId })
        .where(eq(userProgress.id, prog.id));
    }
    // If both exist, cascade delete will clean up
  }

  // Merge category assignments
  const dupCats = await db
    .select()
    .from(vocabularyCategories)
    .where(eq(vocabularyCategories.vocabularyId, deleteId));

  for (const dc of dupCats) {
    const existingLink = await db
      .select()
      .from(vocabularyCategories)
      .where(
        and(
          eq(vocabularyCategories.vocabularyId, keepId),
          eq(vocabularyCategories.categoryId, dc.categoryId)
        )
      );
    if (existingLink.length === 0) {
      await db.insert(vocabularyCategories).values({
        vocabularyId: keepId,
        categoryId: dc.categoryId,
      });
    }
  }

  // Now safe to delete (cascades handle remaining FKs)
  await db.delete(vocabulary).where(eq(vocabulary.id, deleteId));
}

// ── Difficulty audit ────────────────────────────────────────────────────

async function auditDifficulty(
  allVocab: Vocab[],
  catMap: Record<string, string[]>
) {
  console.log("\n" + "=".repeat(60));
  console.log("  DIFFICULTY LEVEL AUDIT");
  console.log("=".repeat(60));

  const changes: Array<{
    word: Vocab;
    currentLevel: number;
    suggestedLevel: number;
    reasons: string[];
  }> = [];

  for (const word of allVocab) {
    const categories = catMap[word.id] || [];
    const result = suggestDifficulty(word, categories);
    if (result) {
      changes.push({
        word,
        currentLevel: word.difficultyLevel ?? 1,
        suggestedLevel: result.suggested,
        reasons: result.reasons,
      });
    }
  }

  const increases = changes.filter((c) => c.suggestedLevel > c.currentLevel);
  const decreases = changes.filter((c) => c.suggestedLevel < c.currentLevel);

  console.log(`\n  Found ${changes.length} words with suggested changes:`);
  console.log(`  Difficulty INCREASES: ${increases.length}`);
  console.log(`  Difficulty DECREASES: ${decreases.length}\n`);

  for (const change of changes) {
    const arrow = change.suggestedLevel > change.currentLevel ? "↑" : "↓";
    console.log(
      `  [${arrow}] "${change.word.phonetic}" (${change.word.englishTranslation}): ${change.currentLevel} → ${change.suggestedLevel}`
    );
    for (const reason of change.reasons) {
      console.log(`       ${reason}`);
    }
  }

  if (!DRY_RUN && changes.length > 0) {
    console.log(`\n  Applying ${changes.length} difficulty changes...`);
    for (const change of changes) {
      await db
        .update(vocabulary)
        .set({
          difficultyLevel: change.suggestedLevel,
          updatedAt: new Date(),
        })
        .where(eq(vocabulary.id, change.word.id));
    }
    console.log("  Done.");
  }
}

// ── Main ────────────────────────────────────────────────────────────────

async function main() {
  console.log("=".repeat(60));
  console.log(
    DRY_RUN
      ? "  VOCABULARY AUDIT — DRY RUN (use --apply to fix)"
      : "  VOCABULARY AUDIT — APPLYING CHANGES"
  );
  console.log("=".repeat(60));

  // Load all vocabulary
  const allVocab = await db.select().from(vocabulary);
  console.log(`\n  Total words in database: ${allVocab.length}`);

  // Load category mappings
  const vocabCats = await db
    .select({
      vocabularyId: vocabularyCategories.vocabularyId,
      categoryName: wordCategories.name,
    })
    .from(vocabularyCategories)
    .innerJoin(
      wordCategories,
      eq(wordCategories.id, vocabularyCategories.categoryId)
    );

  const catMap: Record<string, string[]> = {};
  for (const vc of vocabCats) {
    if (!catMap[vc.vocabularyId]) catMap[vc.vocabularyId] = [];
    catMap[vc.vocabularyId].push(vc.categoryName);
  }

  await auditDuplicates(allVocab);
  await auditDifficulty(allVocab, catMap);

  console.log("\n" + "=".repeat(60));
  console.log("  AUDIT COMPLETE");
  console.log("=".repeat(60) + "\n");

  process.exit(0);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
