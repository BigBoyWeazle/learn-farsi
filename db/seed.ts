import { db } from "./index";
import { vocabulary } from "./schema";

/**
 * Seed script to populate the database with initial Farsi vocabulary
 * Run with: tsx db/seed.ts (after installing tsx: npm install -D tsx)
 */
async function seed() {
  console.log("Starting database seed...");

  const sampleWords = [
    {
      farsiWord: "سلام",
      englishTranslation: "Hello",
      phonetic: "salaam",
      exampleFarsi: "سلام، حال شما چطور است؟",
      exampleEnglish: "Hello, how are you?",
      difficultyLevel: 1,
    },
    {
      farsiWord: "ممنون",
      englishTranslation: "Thank you",
      phonetic: "mamnoon",
      exampleFarsi: "خیلی ممنون از کمک شما",
      exampleEnglish: "Thank you very much for your help",
      difficultyLevel: 1,
    },
    {
      farsiWord: "کتاب",
      englishTranslation: "Book",
      phonetic: "ketaab",
      exampleFarsi: "این کتاب خیلی جالب است",
      exampleEnglish: "This book is very interesting",
      difficultyLevel: 1,
    },
    {
      farsiWord: "دوست",
      englishTranslation: "Friend",
      phonetic: "doost",
      exampleFarsi: "او بهترین دوست من است",
      exampleEnglish: "He/She is my best friend",
      difficultyLevel: 1,
    },
    {
      farsiWord: "خانه",
      englishTranslation: "Home / House",
      phonetic: "khaane",
      exampleFarsi: "خانه من در تهران است",
      exampleEnglish: "My home is in Tehran",
      difficultyLevel: 1,
    },
    {
      farsiWord: "آب",
      englishTranslation: "Water",
      phonetic: "aab",
      exampleFarsi: "لطفا یک لیوان آب بیاورید",
      exampleEnglish: "Please bring a glass of water",
      difficultyLevel: 1,
    },
    {
      farsiWord: "زیبا",
      englishTranslation: "Beautiful",
      phonetic: "zibaa",
      exampleFarsi: "این گل خیلی زیباست",
      exampleEnglish: "This flower is very beautiful",
      difficultyLevel: 2,
    },
    {
      farsiWord: "بله",
      englishTranslation: "Yes",
      phonetic: "bale",
      exampleFarsi: "بله، من موافقم",
      exampleEnglish: "Yes, I agree",
      difficultyLevel: 1,
    },
    {
      farsiWord: "نه",
      englishTranslation: "No",
      phonetic: "na",
      exampleFarsi: "نه، متشکرم",
      exampleEnglish: "No, thank you",
      difficultyLevel: 1,
    },
    {
      farsiWord: "مدرسه",
      englishTranslation: "School",
      phonetic: "madrese",
      exampleFarsi: "بچه‌ها به مدرسه می‌روند",
      exampleEnglish: "The children go to school",
      difficultyLevel: 2,
    },
    {
      farsiWord: "نان",
      englishTranslation: "Bread",
      phonetic: "noon",
      exampleFarsi: "نان تازه خریدم",
      exampleEnglish: "I bought fresh bread",
      difficultyLevel: 1,
    },
    {
      farsiWord: "مادر",
      englishTranslation: "Mother",
      phonetic: "maadar",
      exampleFarsi: "مادر من خیلی مهربان است",
      exampleEnglish: "My mother is very kind",
      difficultyLevel: 1,
    },
    {
      farsiWord: "پدر",
      englishTranslation: "Father",
      phonetic: "pedar",
      exampleFarsi: "پدر من معلم است",
      exampleEnglish: "My father is a teacher",
      difficultyLevel: 1,
    },
    {
      farsiWord: "صبح",
      englishTranslation: "Morning",
      phonetic: "sobh",
      exampleFarsi: "صبح بخیر",
      exampleEnglish: "Good morning",
      difficultyLevel: 1,
    },
    {
      farsiWord: "شب",
      englishTranslation: "Night",
      phonetic: "shab",
      exampleFarsi: "شب بخیر",
      exampleEnglish: "Good night",
      difficultyLevel: 1,
    },
  ];

  try {
    // Insert vocabulary words
    const inserted = await db.insert(vocabulary).values(sampleWords).returning();
    console.log(`Successfully seeded ${inserted.length} vocabulary words`);

    // Log sample of inserted words
    console.log("\nSample words added:");
    inserted.slice(0, 5).forEach((word) => {
      console.log(`- ${word.farsiWord} (${word.phonetic}): ${word.englishTranslation}`);
    });

    console.log("\nSeed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => {
    console.log("\nExiting...");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });
