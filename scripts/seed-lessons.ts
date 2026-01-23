import "dotenv/config";
import { db } from "../db";
import { lessons, wordCategories } from "../db/schema";
import { eq } from "drizzle-orm";

async function seedLessons() {
  console.log("🌱 Seeding lessons...\n");

  try {
    // Get all categories
    const categories = await db
      .select()
      .from(wordCategories)
      .orderBy(wordCategories.difficultyLevel, wordCategories.sortOrder);

    console.log(`Found ${categories.length} categories\n`);

    let lessonNumber = 1;

    for (const category of categories) {
      // Create a lesson for each category
      const lesson = await db
        .insert(lessons)
        .values({
          categoryId: category.id,
          title: `Lesson ${lessonNumber}: ${category.name}`,
          description: category.description || `Learn ${category.name.toLowerCase()} in Farsi`,
          difficultyLevel: category.difficultyLevel,
          sortOrder: lessonNumber,
          isActive: true,
        })
        .returning();

      console.log(`✓ Created: ${lesson[0].title}`);
      console.log(`  Level ${category.difficultyLevel} | ${category.icon} ${category.name}`);
      console.log("");

      lessonNumber++;
    }

    console.log(`✅ Successfully created ${lessonNumber - 1} lessons!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding lessons:", error);
    process.exit(1);
  }
}

seedLessons();
