import "dotenv/config";
import { db } from "../db";
import { wordCategories, vocabularyCategories, vocabulary } from "../db/schema";
import { eq } from "drizzle-orm";

async function main() {
  console.log("🌱 Seeding word categories...");

  try {
    // Create Level 1 categories
    console.log("\n📁 Creating Level 1 categories...");

    const greetings = await db.insert(wordCategories).values({
      name: "Basic Greetings",
      slug: "greetings",
      description: "Essential greetings and polite expressions",
      icon: "👋",
      difficultyLevel: 1,
      sortOrder: 1,
    }).returning();
    console.log("✓ Created: Basic Greetings");

    const essential = await db.insert(wordCategories).values({
      name: "Essential Words",
      slug: "essential",
      description: "Most common everyday words",
      icon: "⭐",
      difficultyLevel: 1,
      sortOrder: 2,
    }).returning();
    console.log("✓ Created: Essential Words");

    // Create Level 2 categories
    console.log("\n📁 Creating Level 2 categories...");

    const places = await db.insert(wordCategories).values({
      name: "Places & Things",
      slug: "places",
      description: "Common places and objects",
      icon: "🏠",
      difficultyLevel: 2,
      sortOrder: 1,
    }).returning();
    console.log("✓ Created: Places & Things");

    const food = await db.insert(wordCategories).values({
      name: "Food & Drink",
      slug: "food",
      description: "Common foods and beverages",
      icon: "🍔",
      difficultyLevel: 2,
      sortOrder: 2,
    }).returning();
    console.log("✓ Created: Food & Drink");

    const people = await db.insert(wordCategories).values({
      name: "People & Relationships",
      slug: "people",
      description: "Family, friends, and relationships",
      icon: "👨‍👩‍👧",
      difficultyLevel: 2,
      sortOrder: 3,
    }).returning();
    console.log("✓ Created: People & Relationships");

    // Create Level 3 categories
    console.log("\n📁 Creating Level 3 categories...");

    const abstract = await db.insert(wordCategories).values({
      name: "Abstract Concepts",
      slug: "abstract",
      description: "Life, travel, and abstract ideas",
      icon: "💭",
      difficultyLevel: 3,
      sortOrder: 1,
    }).returning();
    console.log("✓ Created: Abstract Concepts");

    const education = await db.insert(wordCategories).values({
      name: "Education & Learning",
      slug: "education",
      description: "School, university, and learning",
      icon: "📚",
      difficultyLevel: 3,
      sortOrder: 2,
    }).returning();
    console.log("✓ Created: Education & Learning");

    // Now assign words to categories
    console.log("\n🔗 Assigning words to categories...");

    const words = await db.select().from(vocabulary);

    for (const word of words) {
      const phonetic = word.phonetic?.toLowerCase() || "";
      const english = word.englishTranslation.toLowerCase();

      // Level 1 - Basic Greetings
      if (["salaam", "khodahafez", "mamnoon", "lotfan"].includes(phonetic)) {
        await db.insert(vocabularyCategories).values({
          vocabularyId: word.id,
          categoryId: greetings[0].id,
        });
        console.log(`  ✓ ${word.phonetic} → Basic Greetings`);
      }

      // Level 1 - Essential Words
      if (["baleh", "na"].includes(phonetic)) {
        await db.insert(vocabularyCategories).values({
          vocabularyId: word.id,
          categoryId: essential[0].id,
        });
        console.log(`  ✓ ${word.phonetic} → Essential Words`);
      }

      // Level 2 - Places & Things
      if (["khaneh", "madreseh", "ketaab"].includes(phonetic)) {
        await db.insert(vocabularyCategories).values({
          vocabularyId: word.id,
          categoryId: places[0].id,
        });
        console.log(`  ✓ ${word.phonetic} → Places & Things`);
      }

      // Level 2 - Food & Drink
      if (["aab", "ghaza"].includes(phonetic)) {
        await db.insert(vocabularyCategories).values({
          vocabularyId: word.id,
          categoryId: food[0].id,
        });
        console.log(`  ✓ ${word.phonetic} → Food & Drink`);
      }

      // Level 2 - People & Relationships
      if (["doost"].includes(phonetic)) {
        await db.insert(vocabularyCategories).values({
          vocabularyId: word.id,
          categoryId: people[0].id,
        });
        console.log(`  ✓ ${word.phonetic} → People & Relationships`);
      }

      // Level 3 - Abstract Concepts
      if (["safar", "zendegi"].includes(phonetic)) {
        await db.insert(vocabularyCategories).values({
          vocabularyId: word.id,
          categoryId: abstract[0].id,
        });
        console.log(`  ✓ ${word.phonetic} → Abstract Concepts`);
      }

      // Level 3 - Education & Learning
      if (["daneshgah"].includes(phonetic)) {
        await db.insert(vocabularyCategories).values({
          vocabularyId: word.id,
          categoryId: education[0].id,
        });
        console.log(`  ✓ ${word.phonetic} → Education & Learning`);
      }
    }

    console.log("\n✅ Category seeding complete!");
    console.log(`   - Created 7 categories across 3 difficulty levels`);
    console.log(`   - Assigned ${words.length} words to categories`);

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding categories:", error);
    process.exit(1);
  }
}

main();
