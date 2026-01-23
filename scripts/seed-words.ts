import "dotenv/config";
import { db } from "../db";
import { vocabulary } from "../db/schema";

const words = [
  // Level 1: Beginner (Basic greetings and common words)
  {
    farsiWord: "سلام",
    phonetic: "salaam",
    englishTranslation: "Hello",
    exampleFarsi: "سلام، چطوری؟",
    examplePhonetic: "salaam, chetori?",
    exampleEnglish: "Hello, how are you?",
    difficultyLevel: 1,
  },
  {
    farsiWord: "خداحافظ",
    phonetic: "khodahafez",
    englishTranslation: "Goodbye",
    exampleFarsi: "خداحافظ، فردا میبینمت",
    examplePhonetic: "khodahafez, farda meebinamet",
    exampleEnglish: "Goodbye, see you tomorrow",
    difficultyLevel: 1,
  },
  {
    farsiWord: "بله",
    phonetic: "baleh",
    englishTranslation: "Yes",
    exampleFarsi: "بله، موافقم",
    examplePhonetic: "baleh, movafeqam",
    exampleEnglish: "Yes, I agree",
    difficultyLevel: 1,
  },
  {
    farsiWord: "نه",
    phonetic: "na",
    englishTranslation: "No",
    exampleFarsi: "نه، متشکرم",
    examplePhonetic: "na, moteshakeram",
    exampleEnglish: "No, thank you",
    difficultyLevel: 1,
  },
  {
    farsiWord: "ممنون",
    phonetic: "mamnoon",
    englishTranslation: "Thank you",
    exampleFarsi: "خیلی ممنون از کمکت",
    examplePhonetic: "kheylee mamnoon az komaket",
    exampleEnglish: "Thank you very much for your help",
    difficultyLevel: 1,
  },
  {
    farsiWord: "لطفا",
    phonetic: "lotfan",
    englishTranslation: "Please",
    exampleFarsi: "لطفا کمکم کن",
    examplePhonetic: "lotfan komakam kon",
    exampleEnglish: "Please help me",
    difficultyLevel: 1,
  },

  // Level 2: Elementary (Common daily words)
  {
    farsiWord: "آب",
    phonetic: "aab",
    englishTranslation: "Water",
    exampleFarsi: "یک لیوان آب می‌خواهم",
    examplePhonetic: "yek livaan aab mikhaham",
    exampleEnglish: "I want a glass of water",
    difficultyLevel: 2,
  },
  {
    farsiWord: "خانه",
    phonetic: "khaneh",
    englishTranslation: "House / Home",
    exampleFarsi: "من به خانه می‌روم",
    examplePhonetic: "man be khaneh miravam",
    exampleEnglish: "I am going home",
    difficultyLevel: 2,
  },
  {
    farsiWord: "دوست",
    phonetic: "doost",
    englishTranslation: "Friend",
    exampleFarsi: "او بهترین دوست من است",
    examplePhonetic: "oo behtarin doost-e man ast",
    exampleEnglish: "He/She is my best friend",
    difficultyLevel: 2,
  },
  {
    farsiWord: "کتاب",
    phonetic: "ketaab",
    englishTranslation: "Book",
    exampleFarsi: "این کتاب جالب است",
    examplePhonetic: "in ketaab jaaleb ast",
    exampleEnglish: "This book is interesting",
    difficultyLevel: 2,
  },
  {
    farsiWord: "مدرسه",
    phonetic: "madreseh",
    englishTranslation: "School",
    exampleFarsi: "من به مدرسه می‌روم",
    examplePhonetic: "man be madreseh miravam",
    exampleEnglish: "I go to school",
    difficultyLevel: 2,
  },
  {
    farsiWord: "غذا",
    phonetic: "ghaza",
    englishTranslation: "Food",
    exampleFarsi: "این غذا خوشمزه است",
    examplePhonetic: "in ghaza khoshmazeh ast",
    exampleEnglish: "This food is delicious",
    difficultyLevel: 2,
  },

  // Level 3: Intermediate (Conversational vocabulary)
  {
    farsiWord: "سفر",
    phonetic: "safar",
    englishTranslation: "Travel / Journey",
    exampleFarsi: "من دوست دارم سفر کنم",
    examplePhonetic: "man doost daaram safar konam",
    exampleEnglish: "I like to travel",
    difficultyLevel: 3,
  },
  {
    farsiWord: "زندگی",
    phonetic: "zendegi",
    englishTranslation: "Life",
    exampleFarsi: "زندگی زیباست",
    examplePhonetic: "zendegi zeebaast",
    exampleEnglish: "Life is beautiful",
    difficultyLevel: 3,
  },
  {
    farsiWord: "دانشگاه",
    phonetic: "daneshgah",
    englishTranslation: "University",
    exampleFarsi: "من در دانشگاه درس می‌خوانم",
    examplePhonetic: "man dar daneshgah dars mikhaanam",
    exampleEnglish: "I study at university",
    difficultyLevel: 3,
  },
];

async function main() {
  console.log("🌱 Seeding vocabulary words...");

  try {
    for (const word of words) {
      await db.insert(vocabulary).values({
        ...word,
        isActive: true,
      });
      console.log(`✓ Added: ${word.phonetic} (${word.englishTranslation})`);
    }

    console.log(`\n✅ Successfully added ${words.length} words to the database!`);
  } catch (error) {
    console.error("❌ Error seeding words:", error);
    process.exit(1);
  }
}

main();
