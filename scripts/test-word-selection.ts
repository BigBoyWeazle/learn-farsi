import "dotenv/config";
import { selectWordsForSession } from "../lib/word-selection";

async function testWordSelection() {
  console.log("🧪 Testing Smart Word Selection Algorithm\n");

  // Test 1: Level 1 words
  console.log("Test 1: Selecting 5 words from Level 1");
  const level1Words = await selectWordsForSession({
    sessionSize: 5,
    currentLevel: 1,
  });
  console.log(`  ✓ Selected ${level1Words.length} words`);
  level1Words.forEach((word, index) => {
    console.log(`    ${index + 1}. ${word.phonetic} (${word.englishTranslation}) - Level ${word.difficultyLevel}`);
  });

  // Test 2: Level 2 words
  console.log("\nTest 2: Selecting 5 words from Level 2");
  const level2Words = await selectWordsForSession({
    sessionSize: 5,
    currentLevel: 2,
  });
  console.log(`  ✓ Selected ${level2Words.length} words`);
  level2Words.forEach((word, index) => {
    console.log(`    ${index + 1}. ${word.phonetic} (${word.englishTranslation}) - Level ${word.difficultyLevel}`);
  });

  // Test 3: Level 3 words
  console.log("\nTest 3: Selecting 5 words from Level 3");
  const level3Words = await selectWordsForSession({
    sessionSize: 5,
    currentLevel: 3,
  });
  console.log(`  ✓ Selected ${level3Words.length} words`);
  level3Words.forEach((word, index) => {
    console.log(`    ${index + 1}. ${word.phonetic} (${word.englishTranslation}) - Level ${word.difficultyLevel}`);
  });

  // Verify all words are from the correct level
  console.log("\n✅ Verification:");
  const allLevel1Correct = level1Words.every(w => w.difficultyLevel === 1);
  const allLevel2Correct = level2Words.every(w => w.difficultyLevel === 2);
  const allLevel3Correct = level3Words.every(w => w.difficultyLevel === 3);

  console.log(`  Level 1 words correct: ${allLevel1Correct ? "✓" : "✗"}`);
  console.log(`  Level 2 words correct: ${allLevel2Correct ? "✓" : "✗"}`);
  console.log(`  Level 3 words correct: ${allLevel3Correct ? "✓" : "✗"}`);

  if (allLevel1Correct && allLevel2Correct && allLevel3Correct) {
    console.log("\n🎉 All tests passed! Smart word selection is working correctly.");
  } else {
    console.log("\n❌ Some tests failed. Check the algorithm.");
  }

  process.exit(0);
}

testWordSelection().catch((error) => {
  console.error("❌ Test failed:", error);
  process.exit(1);
});
