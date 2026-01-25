import "dotenv/config";
import { db } from "../db";
import { vocabulary, wordCategories, vocabularyCategories, lessons } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Additional vocabulary seeding script
 * Adds Numbers, Colors, Time & Days, Body Parts, Adjectives, and Question Words
 */

// Numbers (Level 1)
const numbers = [
  { farsiWord: "یک", phonetic: "yek", englishTranslation: "One", exampleFarsi: "من یک کتاب دارم", examplePhonetic: "man yek ketab daram", exampleEnglish: "I have one book", difficultyLevel: 1 },
  { farsiWord: "دو", phonetic: "do", englishTranslation: "Two", exampleFarsi: "دو نفر آمدند", examplePhonetic: "do nafar amadand", exampleEnglish: "Two people came", difficultyLevel: 1 },
  { farsiWord: "سه", phonetic: "seh", englishTranslation: "Three", exampleFarsi: "سه تا سیب می‌خواهم", examplePhonetic: "seh ta sib mikhaham", exampleEnglish: "I want three apples", difficultyLevel: 1 },
  { farsiWord: "چهار", phonetic: "chahar", englishTranslation: "Four", exampleFarsi: "چهار فصل داریم", examplePhonetic: "chahar fasl darim", exampleEnglish: "We have four seasons", difficultyLevel: 1 },
  { farsiWord: "پنج", phonetic: "panj", englishTranslation: "Five", exampleFarsi: "پنج انگشت داریم", examplePhonetic: "panj angosht darim", exampleEnglish: "We have five fingers", difficultyLevel: 1 },
  { farsiWord: "شش", phonetic: "shesh", englishTranslation: "Six", exampleFarsi: "ساعت شش است", examplePhonetic: "saat shesh ast", exampleEnglish: "It's six o'clock", difficultyLevel: 1 },
  { farsiWord: "هفت", phonetic: "haft", englishTranslation: "Seven", exampleFarsi: "هفت روز هفته", examplePhonetic: "haft rooz hafte", exampleEnglish: "Seven days of the week", difficultyLevel: 1 },
  { farsiWord: "هشت", phonetic: "hasht", englishTranslation: "Eight", exampleFarsi: "هشت ساعت کار می‌کنم", examplePhonetic: "hasht saat kar mikonam", exampleEnglish: "I work eight hours", difficultyLevel: 1 },
  { farsiWord: "نه", phonetic: "noh", englishTranslation: "Nine", exampleFarsi: "ساعت نه صبح", examplePhonetic: "saat noh sobh", exampleEnglish: "Nine o'clock in the morning", difficultyLevel: 1 },
  { farsiWord: "ده", phonetic: "dah", englishTranslation: "Ten", exampleFarsi: "ده دقیقه صبر کن", examplePhonetic: "dah daghighe sabr kon", exampleEnglish: "Wait ten minutes", difficultyLevel: 1 },
  { farsiWord: "صد", phonetic: "sad", englishTranslation: "One hundred", exampleFarsi: "صد تومان", examplePhonetic: "sad toman", exampleEnglish: "One hundred tomans", difficultyLevel: 1 },
  { farsiWord: "هزار", phonetic: "hezar", englishTranslation: "One thousand", exampleFarsi: "هزار تومان", examplePhonetic: "hezar toman", exampleEnglish: "One thousand tomans", difficultyLevel: 1 },
];

// Colors (Level 1)
const colors = [
  { farsiWord: "سفید", phonetic: "sefid", englishTranslation: "White", exampleFarsi: "برف سفید است", examplePhonetic: "barf sefid ast", exampleEnglish: "Snow is white", difficultyLevel: 1 },
  { farsiWord: "سیاه", phonetic: "siyah", englishTranslation: "Black", exampleFarsi: "گربه سیاه", examplePhonetic: "gorbe siyah", exampleEnglish: "Black cat", difficultyLevel: 1 },
  { farsiWord: "قرمز", phonetic: "ghermez", englishTranslation: "Red", exampleFarsi: "سیب قرمز", examplePhonetic: "sib ghermez", exampleEnglish: "Red apple", difficultyLevel: 1 },
  { farsiWord: "آبی", phonetic: "abi", englishTranslation: "Blue", exampleFarsi: "آسمان آبی است", examplePhonetic: "aseman abi ast", exampleEnglish: "The sky is blue", difficultyLevel: 1 },
  { farsiWord: "سبز", phonetic: "sabz", englishTranslation: "Green", exampleFarsi: "چمن سبز", examplePhonetic: "chaman sabz", exampleEnglish: "Green grass", difficultyLevel: 1 },
  { farsiWord: "زرد", phonetic: "zard", englishTranslation: "Yellow", exampleFarsi: "موز زرد است", examplePhonetic: "moz zard ast", exampleEnglish: "Banana is yellow", difficultyLevel: 1 },
  { farsiWord: "نارنجی", phonetic: "narenji", englishTranslation: "Orange", exampleFarsi: "پرتقال نارنجی است", examplePhonetic: "porteghal narenji ast", exampleEnglish: "Orange is orange", difficultyLevel: 1 },
  { farsiWord: "بنفش", phonetic: "banafsh", englishTranslation: "Purple", exampleFarsi: "گل بنفش", examplePhonetic: "gol banafsh", exampleEnglish: "Purple flower", difficultyLevel: 1 },
  { farsiWord: "صورتی", phonetic: "soorati", englishTranslation: "Pink", exampleFarsi: "لباس صورتی", examplePhonetic: "lebas soorati", exampleEnglish: "Pink dress", difficultyLevel: 1 },
  { farsiWord: "قهوه‌ای", phonetic: "ghahve-i", englishTranslation: "Brown", exampleFarsi: "کفش قهوه‌ای", examplePhonetic: "kafsh ghahve-i", exampleEnglish: "Brown shoes", difficultyLevel: 1 },
];

// Time & Days (Level 2)
const timeDays = [
  { farsiWord: "امروز", phonetic: "emrooz", englishTranslation: "Today", exampleFarsi: "امروز هوا خوب است", examplePhonetic: "emrooz hava khoob ast", exampleEnglish: "Today the weather is nice", difficultyLevel: 2 },
  { farsiWord: "فردا", phonetic: "farda", englishTranslation: "Tomorrow", exampleFarsi: "فردا می‌بینمت", examplePhonetic: "farda mibinamet", exampleEnglish: "I'll see you tomorrow", difficultyLevel: 2 },
  { farsiWord: "دیروز", phonetic: "dirooz", englishTranslation: "Yesterday", exampleFarsi: "دیروز باران آمد", examplePhonetic: "dirooz baran amad", exampleEnglish: "It rained yesterday", difficultyLevel: 2 },
  { farsiWord: "هفته", phonetic: "hafte", englishTranslation: "Week", exampleFarsi: "هفته آینده", examplePhonetic: "hafte ayande", exampleEnglish: "Next week", difficultyLevel: 2 },
  { farsiWord: "ماه", phonetic: "mah", englishTranslation: "Month", exampleFarsi: "ماه گذشته", examplePhonetic: "mah gozashte", exampleEnglish: "Last month", difficultyLevel: 2 },
  { farsiWord: "سال", phonetic: "sal", englishTranslation: "Year", exampleFarsi: "سال نو مبارک", examplePhonetic: "sale no mobarak", exampleEnglish: "Happy New Year", difficultyLevel: 2 },
  { farsiWord: "شنبه", phonetic: "shanbe", englishTranslation: "Saturday", exampleFarsi: "شنبه اول هفته است", examplePhonetic: "shanbe avale hafte ast", exampleEnglish: "Saturday is the first day of the week", difficultyLevel: 2 },
  { farsiWord: "یکشنبه", phonetic: "yekshanbe", englishTranslation: "Sunday", exampleFarsi: "یکشنبه استراحت می‌کنم", examplePhonetic: "yekshanbe esterahat mikonam", exampleEnglish: "I rest on Sunday", difficultyLevel: 2 },
  { farsiWord: "دوشنبه", phonetic: "doshanbe", englishTranslation: "Monday", exampleFarsi: "دوشنبه کار می‌کنم", examplePhonetic: "doshanbe kar mikonam", exampleEnglish: "I work on Monday", difficultyLevel: 2 },
  { farsiWord: "سه‌شنبه", phonetic: "seshanbe", englishTranslation: "Tuesday", exampleFarsi: "سه‌شنبه کلاس دارم", examplePhonetic: "seshanbe kelas daram", exampleEnglish: "I have class on Tuesday", difficultyLevel: 2 },
  { farsiWord: "چهارشنبه", phonetic: "chaharshanbe", englishTranslation: "Wednesday", exampleFarsi: "چهارشنبه ورزش می‌کنم", examplePhonetic: "chaharshanbe varzesh mikonam", exampleEnglish: "I exercise on Wednesday", difficultyLevel: 2 },
  { farsiWord: "پنج‌شنبه", phonetic: "panjshanbe", englishTranslation: "Thursday", exampleFarsi: "پنج‌شنبه خرید می‌کنم", examplePhonetic: "panjshanbe kharid mikonam", exampleEnglish: "I shop on Thursday", difficultyLevel: 2 },
  { farsiWord: "جمعه", phonetic: "jome", englishTranslation: "Friday", exampleFarsi: "جمعه تعطیل است", examplePhonetic: "jome tatil ast", exampleEnglish: "Friday is a holiday", difficultyLevel: 2 },
  { farsiWord: "ساعت", phonetic: "saat", englishTranslation: "Hour / Clock / Watch", exampleFarsi: "ساعت چند است؟", examplePhonetic: "saat chand ast?", exampleEnglish: "What time is it?", difficultyLevel: 2 },
  { farsiWord: "دقیقه", phonetic: "daghighe", englishTranslation: "Minute", exampleFarsi: "پنج دقیقه صبر کن", examplePhonetic: "panj daghighe sabr kon", exampleEnglish: "Wait five minutes", difficultyLevel: 2 },
];

// Question Words (Level 2)
const questionWords = [
  { farsiWord: "چه", phonetic: "che", englishTranslation: "What", exampleFarsi: "این چیست؟", examplePhonetic: "in chist?", exampleEnglish: "What is this?", difficultyLevel: 2 },
  { farsiWord: "کی", phonetic: "key", englishTranslation: "When", exampleFarsi: "کی می‌آیی؟", examplePhonetic: "key miyai?", exampleEnglish: "When are you coming?", difficultyLevel: 2 },
  { farsiWord: "کجا", phonetic: "koja", englishTranslation: "Where", exampleFarsi: "کجا می‌روی؟", examplePhonetic: "koja miravi?", exampleEnglish: "Where are you going?", difficultyLevel: 2 },
  { farsiWord: "چرا", phonetic: "chera", englishTranslation: "Why", exampleFarsi: "چرا نیامدی؟", examplePhonetic: "chera nayamadi?", exampleEnglish: "Why didn't you come?", difficultyLevel: 2 },
  { farsiWord: "چطور", phonetic: "chetor", englishTranslation: "How", exampleFarsi: "چطور هستی؟", examplePhonetic: "chetor hasti?", exampleEnglish: "How are you?", difficultyLevel: 2 },
  { farsiWord: "چند", phonetic: "chand", englishTranslation: "How many / How much", exampleFarsi: "چند ساله‌ای؟", examplePhonetic: "chand salei?", exampleEnglish: "How old are you?", difficultyLevel: 2 },
  { farsiWord: "کدام", phonetic: "kodam", englishTranslation: "Which", exampleFarsi: "کدام یکی؟", examplePhonetic: "kodam yeki?", exampleEnglish: "Which one?", difficultyLevel: 2 },
  { farsiWord: "کی", phonetic: "ki", englishTranslation: "Who", exampleFarsi: "کی هست؟", examplePhonetic: "ki hast?", exampleEnglish: "Who is it?", difficultyLevel: 2 },
];

// Adjectives (Level 2)
const adjectives = [
  { farsiWord: "بزرگ", phonetic: "bozorg", englishTranslation: "Big / Large", exampleFarsi: "این خانه بزرگ است", examplePhonetic: "in khaneh bozorg ast", exampleEnglish: "This house is big", difficultyLevel: 2 },
  { farsiWord: "کوچک", phonetic: "koochak", englishTranslation: "Small / Little", exampleFarsi: "یک بچه کوچک", examplePhonetic: "yek bacheh koochak", exampleEnglish: "A small child", difficultyLevel: 2 },
  { farsiWord: "خوب", phonetic: "khoob", englishTranslation: "Good", exampleFarsi: "این خیلی خوب است", examplePhonetic: "in kheylee khoob ast", exampleEnglish: "This is very good", difficultyLevel: 2 },
  { farsiWord: "بد", phonetic: "bad", englishTranslation: "Bad", exampleFarsi: "هوا بد است", examplePhonetic: "hava bad ast", exampleEnglish: "The weather is bad", difficultyLevel: 2 },
  { farsiWord: "زیبا", phonetic: "ziba", englishTranslation: "Beautiful", exampleFarsi: "چه گل زیبایی", examplePhonetic: "che gole zibai", exampleEnglish: "What a beautiful flower", difficultyLevel: 2 },
  { farsiWord: "جدید", phonetic: "jadid", englishTranslation: "New", exampleFarsi: "ماشین جدید خریدم", examplePhonetic: "mashin jadid kharidam", exampleEnglish: "I bought a new car", difficultyLevel: 2 },
  { farsiWord: "قدیمی", phonetic: "ghadimi", englishTranslation: "Old (things)", exampleFarsi: "این ساختمان قدیمی است", examplePhonetic: "in sakhteman ghadimi ast", exampleEnglish: "This building is old", difficultyLevel: 2 },
  { farsiWord: "گرم", phonetic: "garm", englishTranslation: "Hot / Warm", exampleFarsi: "هوا گرم است", examplePhonetic: "hava garm ast", exampleEnglish: "The weather is hot", difficultyLevel: 2 },
  { farsiWord: "سرد", phonetic: "sard", englishTranslation: "Cold", exampleFarsi: "آب سرد می‌خواهم", examplePhonetic: "ab sard mikhaham", exampleEnglish: "I want cold water", difficultyLevel: 2 },
  { farsiWord: "تازه", phonetic: "taze", englishTranslation: "Fresh / New", exampleFarsi: "نان تازه", examplePhonetic: "nan taze", exampleEnglish: "Fresh bread", difficultyLevel: 2 },
  { farsiWord: "خوشحال", phonetic: "khoshhal", englishTranslation: "Happy", exampleFarsi: "امروز خوشحالم", examplePhonetic: "emrooz khoshhalam", exampleEnglish: "I'm happy today", difficultyLevel: 2 },
  { farsiWord: "ناراحت", phonetic: "narahat", englishTranslation: "Sad / Upset", exampleFarsi: "چرا ناراحتی؟", examplePhonetic: "chera narahati?", exampleEnglish: "Why are you sad?", difficultyLevel: 2 },
  { farsiWord: "خسته", phonetic: "khaste", englishTranslation: "Tired", exampleFarsi: "خیلی خسته‌ام", examplePhonetic: "kheylee khasteam", exampleEnglish: "I'm very tired", difficultyLevel: 2 },
  { farsiWord: "گرسنه", phonetic: "gorosne", englishTranslation: "Hungry", exampleFarsi: "گرسنه هستم", examplePhonetic: "gorosne hastam", exampleEnglish: "I'm hungry", difficultyLevel: 2 },
  { farsiWord: "تشنه", phonetic: "teshne", englishTranslation: "Thirsty", exampleFarsi: "تشنه هستم", examplePhonetic: "teshne hastam", exampleEnglish: "I'm thirsty", difficultyLevel: 2 },
];

// Family (Level 2)
const family = [
  { farsiWord: "مادر", phonetic: "madar", englishTranslation: "Mother", exampleFarsi: "مادرم خیلی مهربان است", examplePhonetic: "madaram kheylee mehraban ast", exampleEnglish: "My mother is very kind", difficultyLevel: 2 },
  { farsiWord: "پدر", phonetic: "pedar", englishTranslation: "Father", exampleFarsi: "پدرم کار می‌کند", examplePhonetic: "pedaram kar mikonad", exampleEnglish: "My father works", difficultyLevel: 2 },
  { farsiWord: "برادر", phonetic: "baradar", englishTranslation: "Brother", exampleFarsi: "برادرم دانشجو است", examplePhonetic: "baradaram daneshjoo ast", exampleEnglish: "My brother is a student", difficultyLevel: 2 },
  { farsiWord: "خواهر", phonetic: "khahar", englishTranslation: "Sister", exampleFarsi: "خواهرم معلم است", examplePhonetic: "khaharam moalem ast", exampleEnglish: "My sister is a teacher", difficultyLevel: 2 },
  { farsiWord: "پسر", phonetic: "pesar", englishTranslation: "Son / Boy", exampleFarsi: "پسرم مدرسه می‌رود", examplePhonetic: "pesaram madrese miravad", exampleEnglish: "My son goes to school", difficultyLevel: 2 },
  { farsiWord: "دختر", phonetic: "dokhtar", englishTranslation: "Daughter / Girl", exampleFarsi: "دخترم زیباست", examplePhonetic: "dokhtaram zibaast", exampleEnglish: "My daughter is beautiful", difficultyLevel: 2 },
  { farsiWord: "مادربزرگ", phonetic: "madarbozorg", englishTranslation: "Grandmother", exampleFarsi: "مادربزرگم پیر است", examplePhonetic: "madarbozorgam pir ast", exampleEnglish: "My grandmother is old", difficultyLevel: 2 },
  { farsiWord: "پدربزرگ", phonetic: "pedarbozorg", englishTranslation: "Grandfather", exampleFarsi: "پدربزرگم داستان تعریف می‌کند", examplePhonetic: "pedarbozorgam dastan tarif mikonad", exampleEnglish: "My grandfather tells stories", difficultyLevel: 2 },
  { farsiWord: "عمو", phonetic: "amoo", englishTranslation: "Uncle (paternal)", exampleFarsi: "عمویم در تهران زندگی می‌کند", examplePhonetic: "amuyam dar tehran zendegi mikonad", exampleEnglish: "My uncle lives in Tehran", difficultyLevel: 2 },
  { farsiWord: "خاله", phonetic: "khale", englishTranslation: "Aunt (maternal)", exampleFarsi: "خاله‌ام آشپزی بلد است", examplePhonetic: "khaleam ashpazi balad ast", exampleEnglish: "My aunt knows how to cook", difficultyLevel: 2 },
];

async function seedCategory(
  name: string,
  slug: string,
  description: string,
  icon: string,
  level: number,
  sortOrder: number,
  words: any[]
) {
  // Check if category exists
  const existing = await db
    .select()
    .from(wordCategories)
    .where(eq(wordCategories.slug, slug));

  let category;
  if (existing.length === 0) {
    const result = await db.insert(wordCategories).values({
      name,
      slug,
      description,
      icon,
      difficultyLevel: level,
      sortOrder,
    }).returning();
    category = result[0];
    console.log(`✓ Created category: ${name}`);
  } else {
    category = existing[0];
    console.log(`⏭ Category exists: ${name}`);
  }

  // Add words
  let addedCount = 0;
  for (const word of words) {
    const existingWord = await db
      .select()
      .from(vocabulary)
      .where(eq(vocabulary.phonetic, word.phonetic));

    if (existingWord.length === 0) {
      const inserted = await db.insert(vocabulary).values({
        ...word,
        isActive: true,
      }).returning();

      await db.insert(vocabularyCategories).values({
        vocabularyId: inserted[0].id,
        categoryId: category.id,
      });

      addedCount++;
    }
  }
  console.log(`   Added ${addedCount} new words`);

  // Check if lesson exists
  const existingLesson = await db
    .select()
    .from(lessons)
    .where(eq(lessons.categoryId, category.id));

  if (existingLesson.length === 0) {
    await db.insert(lessons).values({
      categoryId: category.id,
      title: name,
      description,
      difficultyLevel: level,
      sortOrder: sortOrder + 50,
      isActive: true,
    });
    console.log(`   ✓ Created lesson: ${name}`);
  }

  return addedCount;
}

async function main() {
  console.log("🌱 Seeding additional vocabulary...\n");

  try {
    let totalAdded = 0;

    // Numbers
    console.log("\n🔢 Numbers...");
    totalAdded += await seedCategory(
      "Numbers",
      "numbers",
      "Learn to count and use numbers in Farsi",
      "🔢",
      1,
      5,
      numbers
    );

    // Colors
    console.log("\n🎨 Colors...");
    totalAdded += await seedCategory(
      "Colors",
      "colors",
      "Learn the names of colors in Farsi",
      "🎨",
      1,
      6,
      colors
    );

    // Time & Days
    console.log("\n📅 Time & Days...");
    totalAdded += await seedCategory(
      "Time & Days",
      "time-days",
      "Days of the week, months, and time expressions",
      "📅",
      2,
      15,
      timeDays
    );

    // Question Words
    console.log("\n❓ Question Words...");
    totalAdded += await seedCategory(
      "Question Words",
      "question-words",
      "Essential words for asking questions",
      "❓",
      2,
      16,
      questionWords
    );

    // Adjectives
    console.log("\n📝 Adjectives...");
    totalAdded += await seedCategory(
      "Common Adjectives",
      "adjectives",
      "Describe things with common adjectives",
      "📝",
      2,
      17,
      adjectives
    );

    // Family
    console.log("\n👨‍👩‍👧‍👦 Family...");
    totalAdded += await seedCategory(
      "Family Members",
      "family",
      "Learn vocabulary for family relationships",
      "👨‍👩‍👧‍👦",
      2,
      18,
      family
    );

    console.log("\n" + "=".repeat(50));
    console.log("✅ ADDITIONAL VOCABULARY SEEDING COMPLETE!");
    console.log("=".repeat(50));
    console.log(`\n📊 Total new words added: ${totalAdded}`);
    console.log("🎉 Your vocabulary library has been expanded!\n");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

main();
