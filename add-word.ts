import "dotenv/config";
import { db } from "./db/index";
import { vocabulary } from "./db/schema";

async function addWord() {
  const newWord = {
    farsiWord: "خوب",
    englishTranslation: "Good",
    phonetic: "khoob",
    exampleFarsi: "این خیلی خوب است",
    exampleEnglish: "This is very good",
    difficultyLevel: 1,
    isActive: true,
  };

  const result = await db.insert(vocabulary).values(newWord).returning();
  console.log("Word added successfully:", result[0]);
  process.exit(0);
}

addWord().catch((error) => {
  console.error("Error adding word:", error);
  process.exit(1);
});
