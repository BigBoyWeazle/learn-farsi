import "dotenv/config";
import { db } from "../db";
import { vocabulary } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Fixes duplicate/incorrect phonetics in the vocabulary database:
 * 1. Removes "ruye" duplicate (correct form is "rooye")
 * 2. Updates "aan" → "oon" (conversational Farsi)
 *
 * Run with: npx tsx scripts/fix-duplicates.ts
 */

async function main() {
  console.log("=== Fixing vocabulary duplicates ===\n");

  // 1. Delete "ruye" entries (duplicate of "rooye")
  const ruyeEntries = await db
    .select({ id: vocabulary.id, phonetic: vocabulary.phonetic, farsiWord: vocabulary.farsiWord })
    .from(vocabulary)
    .where(eq(vocabulary.phonetic, "ruye"));

  if (ruyeEntries.length > 0) {
    for (const entry of ruyeEntries) {
      await db.delete(vocabulary).where(eq(vocabulary.id, entry.id));
      console.log(`  Deleted duplicate: "ruye" (id: ${entry.id}, farsi: ${entry.farsiWord})`);
    }
  } else {
    console.log("  No 'ruye' duplicates found.");
  }

  // Verify "rooye" exists
  const rooyeEntries = await db
    .select({ id: vocabulary.id, phonetic: vocabulary.phonetic })
    .from(vocabulary)
    .where(eq(vocabulary.phonetic, "rooye"));
  console.log(`  "rooye" entries in DB: ${rooyeEntries.length}`);

  // 2. Update "aan" → "oon" (conversational Farsi)
  const aanEntries = await db
    .select({ id: vocabulary.id, phonetic: vocabulary.phonetic, farsiWord: vocabulary.farsiWord, examplePhonetic: vocabulary.examplePhonetic })
    .from(vocabulary)
    .where(eq(vocabulary.phonetic, "aan"));

  if (aanEntries.length > 0) {
    for (const entry of aanEntries) {
      const newExamplePhonetic = entry.examplePhonetic
        ?.replace(/\baan\b/g, "oon")
        ?.replace(/\bkhaneh\b/g, "khooneh")
        ?.replace(/\bast\b/g, "e");
      await db
        .update(vocabulary)
        .set({
          phonetic: "oon",
          ...(newExamplePhonetic ? { examplePhonetic: newExamplePhonetic } : {}),
        })
        .where(eq(vocabulary.id, entry.id));
      console.log(`  Updated: "aan" → "oon" (id: ${entry.id}, farsi: ${entry.farsiWord})`);
    }
  } else {
    console.log("  No 'aan' entries found (already updated).");
  }

  // Check for any remaining "oon" duplicates
  const oonEntries = await db
    .select({ id: vocabulary.id, phonetic: vocabulary.phonetic })
    .from(vocabulary)
    .where(eq(vocabulary.phonetic, "oon"));

  if (oonEntries.length > 1) {
    console.log(`\n  Warning: ${oonEntries.length} entries with phonetic "oon" found. Removing duplicates...`);
    // Keep the first one, delete the rest
    for (let i = 1; i < oonEntries.length; i++) {
      await db.delete(vocabulary).where(eq(vocabulary.id, oonEntries[i].id));
      console.log(`  Deleted duplicate "oon" (id: ${oonEntries[i].id})`);
    }
  }

  console.log("\n=== Done! ===");
  process.exit(0);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
