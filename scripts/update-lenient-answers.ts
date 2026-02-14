import "dotenv/config";
import { db } from "../db";
import { vocabulary } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Updates existing vocabulary words with more lenient alternative answers.
 * Uses the "/" separator that answer-validation.ts already supports.
 * Run with: tsx scripts/update-lenient-answers.ts
 */

const updates: { phonetic: string; englishTranslation: string }[] = [
  // Original seed words
  { phonetic: "salaam", englishTranslation: "Hello / Hi / Hey" },
  { phonetic: "mamnoon", englishTranslation: "Thank you / Thanks" },
  { phonetic: "doost", englishTranslation: "Friend / Buddy" },
  { phonetic: "zibaa", englishTranslation: "Beautiful / Pretty" },
  { phonetic: "ziba", englishTranslation: "Beautiful / Pretty" },
  { phonetic: "bale", englishTranslation: "Yes / Yeah" },
  { phonetic: "na", englishTranslation: "No / Nah / Nope" },
  { phonetic: "maadar", englishTranslation: "Mother / Mom / Mum" },
  { phonetic: "madar", englishTranslation: "Mother / Mom / Mum" },
  { phonetic: "pedar", englishTranslation: "Father / Dad" },

  // Adjectives from seed-more-words
  { phonetic: "khoob", englishTranslation: "Good / Nice / Fine" },
  { phonetic: "bad", englishTranslation: "Bad / Poor" },
  { phonetic: "khoshhal", englishTranslation: "Happy / Glad / Pleased" },
  { phonetic: "narahat", englishTranslation: "Sad / Upset / Unhappy" },
  { phonetic: "khaste", englishTranslation: "Tired / Exhausted" },
  { phonetic: "bozorg", englishTranslation: "Big / Large / Great" },
  { phonetic: "koochak", englishTranslation: "Small / Little / Tiny" },
  { phonetic: "garm", englishTranslation: "Hot / Warm" },
  { phonetic: "jadid", englishTranslation: "New / Brand new" },
  { phonetic: "taze", englishTranslation: "Fresh / New" },

  // Verbs - add informal alternatives
  { phonetic: "raftan", englishTranslation: "To go / Go" },
  { phonetic: "amadan", englishTranslation: "To come / Come" },
  { phonetic: "khordan", englishTranslation: "To eat / Eat" },
  { phonetic: "nooshidan", englishTranslation: "To drink / Drink" },
  { phonetic: "khabidan", englishTranslation: "To sleep / Sleep" },
  { phonetic: "didan", englishTranslation: "To see / See" },
  { phonetic: "shenidan", englishTranslation: "To hear / Hear / Listen" },
  { phonetic: "goftan", englishTranslation: "To say / To tell / Say / Tell" },
  { phonetic: "kardan", englishTranslation: "To do / To make / Do / Make" },
  { phonetic: "dashtan", englishTranslation: "To have / Have" },
  { phonetic: "boodan", englishTranslation: "To be / Be" },
  { phonetic: "khastan", englishTranslation: "To want / Want" },
  { phonetic: "danestan", englishTranslation: "To know / Know" },
  { phonetic: "neveshtan", englishTranslation: "To write / Write" },
  { phonetic: "khandan", englishTranslation: "To read / Read" },
  { phonetic: "davidan", englishTranslation: "To run / Run" },

  // Question words
  { phonetic: "che", englishTranslation: "What" },
  { phonetic: "key", englishTranslation: "When" },
  { phonetic: "koja", englishTranslation: "Where" },
  { phonetic: "chera", englishTranslation: "Why" },
  { phonetic: "chetor", englishTranslation: "How" },
  { phonetic: "chand", englishTranslation: "How many / How much" },
  { phonetic: "kodam", englishTranslation: "Which / Which one" },
  { phonetic: "ki", englishTranslation: "Who" },

  // Family - add informal alternatives
  { phonetic: "baradar", englishTranslation: "Brother / Bro" },
  { phonetic: "khahar", englishTranslation: "Sister / Sis" },
  { phonetic: "pesar", englishTranslation: "Son / Boy" },
  { phonetic: "dokhtar", englishTranslation: "Daughter / Girl" },
  { phonetic: "madarbozorg", englishTranslation: "Grandmother / Grandma" },
  { phonetic: "pedarbozorg", englishTranslation: "Grandfather / Grandpa" },
  { phonetic: "amoo", englishTranslation: "Uncle (paternal) / Uncle" },
  { phonetic: "khale", englishTranslation: "Aunt (maternal) / Aunt" },

  // Time
  { phonetic: "saat", englishTranslation: "Hour / Clock / Watch / Time" },
];

async function main() {
  console.log("Updating vocabulary with lenient answers...\n");

  let updated = 0;
  let skipped = 0;

  for (const update of updates) {
    const existing = await db
      .select()
      .from(vocabulary)
      .where(eq(vocabulary.phonetic, update.phonetic));

    if (existing.length > 0) {
      const word = existing[0];
      if (word.englishTranslation !== update.englishTranslation) {
        await db
          .update(vocabulary)
          .set({ englishTranslation: update.englishTranslation })
          .where(eq(vocabulary.id, word.id));
        console.log(
          `  Updated: ${word.phonetic} "${word.englishTranslation}" -> "${update.englishTranslation}"`
        );
        updated++;
      } else {
        skipped++;
      }
    }
  }

  console.log("\n" + "=".repeat(50));
  console.log("LENIENT ANSWERS UPDATE COMPLETE!");
  console.log("=".repeat(50));
  console.log(`\n  Updated: ${updated}`);
  console.log(`  Already correct: ${skipped}`);
  console.log(`  Total checked: ${updates.length}\n`);

  process.exit(0);
}

main().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
