import "dotenv/config";
import { db } from "./db/index";
import { vocabulary } from "./db/schema";
import { eq } from "drizzle-orm";

async function updateWord() {
  // Update the word we just added
  const result = await db
    .update(vocabulary)
    .set({
      exampleFarsi: "این خیلی خوب است",
      exampleEnglish: "This is very good",
      phonetic: "khoob",
    })
    .where(eq(vocabulary.englishTranslation, "Good"))
    .returning();

  console.log("Word updated successfully:", result[0]);
  process.exit(0);
}

updateWord().catch((error) => {
  console.error("Error updating word:", error);
  process.exit(1);
});
