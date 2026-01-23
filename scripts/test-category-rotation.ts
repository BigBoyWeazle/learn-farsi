import "dotenv/config";
import { db } from "../db";
import { wordCategories, vocabularyCategories } from "../db/schema";
import { eq, inArray } from "drizzle-orm";
import { selectWordsForSession } from "../lib/word-selection";

async function testCategoryRotation() {
  console.log("🧪 Testing Category Rotation\n");

  // Get all Level 1 categories
  const level1Categories = await db
    .select()
    .from(wordCategories)
    .where(eq(wordCategories.difficultyLevel, 1));

  console.log("Available Level 1 Categories:");
  level1Categories.forEach((cat) => {
    console.log(`  ${cat.icon} ${cat.name} (${cat.slug})`);
  });

  // Simulate 3 practice sessions to test rotation
  console.log("\n📚 Simulating 3 practice sessions:\n");

  for (let i = 1; i <= 3; i++) {
    console.log(`Session ${i}:`);

    const words = await selectWordsForSession({
      sessionSize: 3, // Smaller session size to see rotation better
      currentLevel: 1,
    });

    // Get categories for these words
    for (const word of words) {
      const wordCats = await db
        .select({ category: wordCategories })
        .from(vocabularyCategories)
        .innerJoin(wordCategories, eq(vocabularyCategories.categoryId, wordCategories.id))
        .where(eq(vocabularyCategories.vocabularyId, word.id));

      const categoryNames = wordCats.map(wc => wc.category.name).join(", ");
      console.log(`  - ${word.phonetic} → ${categoryNames || "No category"}`);
    }

    // Check localStorage for lastCategory
    if (typeof localStorage !== "undefined") {
      const lastCategory = localStorage.getItem("lastCategory");
      console.log(`  Last practiced category: ${lastCategory || "None"}`);
    }

    console.log("");
  }

  console.log("✅ Category rotation test complete!");
  process.exit(0);
}

testCategoryRotation().catch((error) => {
  console.error("❌ Test failed:", error);
  process.exit(1);
});
