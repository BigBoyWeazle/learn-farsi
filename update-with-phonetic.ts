import "dotenv/config";
import { db } from "./db/index";
import { vocabulary } from "./db/schema";
import { eq } from "drizzle-orm";

async function updateWord() {
  const result = await db
    .update(vocabulary)
    .set({
      examplePhonetic: "in kheylee khoob ast",
    })
    .where(eq(vocabulary.englishTranslation, "Good"))
    .returning();

  console.log("Word updated with phonetic example:");
  console.log("Farsi:", result[0].exampleFarsi);
  console.log("Phonetic:", result[0].examplePhonetic);
  console.log("English:", result[0].exampleEnglish);
  process.exit(0);
}

updateWord().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
