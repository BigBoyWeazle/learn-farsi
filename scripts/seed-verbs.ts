import "dotenv/config";
import { db } from "../db";
import { vocabulary, wordCategories, vocabularyCategories, lessons } from "../db/schema";
import { eq } from "drizzle-orm";

/**
 * Comprehensive verb seeding script
 * Adds Basic Verbs (Level 2) and Phrasal Verbs (Level 3)
 */

// Basic Verbs - Present stem forms (Level 2)
const basicVerbs = [
  // Essential Action Verbs
  {
    farsiWord: "رفتن",
    phonetic: "raftan",
    englishTranslation: "To go",
    exampleFarsi: "من به خانه می‌روم",
    examplePhonetic: "man be khaneh miravam",
    exampleEnglish: "I am going home",
    difficultyLevel: 2,
  },
  {
    farsiWord: "آمدن",
    phonetic: "amadan",
    englishTranslation: "To come",
    exampleFarsi: "او فردا می‌آید",
    examplePhonetic: "oo farda miyaad",
    exampleEnglish: "He/She is coming tomorrow",
    difficultyLevel: 2,
  },
  {
    farsiWord: "خوردن",
    phonetic: "khordan",
    englishTranslation: "To eat",
    exampleFarsi: "من صبحانه می‌خورم",
    examplePhonetic: "man sobhaneh mikhoram",
    exampleEnglish: "I eat breakfast",
    difficultyLevel: 2,
  },
  {
    farsiWord: "نوشیدن",
    phonetic: "nooshidan",
    englishTranslation: "To drink",
    exampleFarsi: "چای می‌نوشم",
    examplePhonetic: "chay minoosham",
    exampleEnglish: "I drink tea",
    difficultyLevel: 2,
  },
  {
    farsiWord: "خوابیدن",
    phonetic: "khabidan",
    englishTranslation: "To sleep",
    exampleFarsi: "من زود می‌خوابم",
    examplePhonetic: "man zood mikhabam",
    exampleEnglish: "I sleep early",
    difficultyLevel: 2,
  },
  {
    farsiWord: "بیدار شدن",
    phonetic: "bidaar shodan",
    englishTranslation: "To wake up",
    exampleFarsi: "صبح زود بیدار می‌شوم",
    examplePhonetic: "sobh zood bidaar misham",
    exampleEnglish: "I wake up early in the morning",
    difficultyLevel: 2,
  },
  {
    farsiWord: "دیدن",
    phonetic: "didan",
    englishTranslation: "To see",
    exampleFarsi: "من دوستم را می‌بینم",
    examplePhonetic: "man doostam ra mibinam",
    exampleEnglish: "I see my friend",
    difficultyLevel: 2,
  },
  {
    farsiWord: "شنیدن",
    phonetic: "shenidan",
    englishTranslation: "To hear",
    exampleFarsi: "صدای موسیقی را می‌شنوم",
    examplePhonetic: "sedaye moosighi ra mishenavam",
    exampleEnglish: "I hear the music",
    difficultyLevel: 2,
  },
  {
    farsiWord: "گفتن",
    phonetic: "goftan",
    englishTranslation: "To say / To tell",
    exampleFarsi: "چه می‌گویی؟",
    examplePhonetic: "che migooi?",
    exampleEnglish: "What are you saying?",
    difficultyLevel: 2,
  },
  {
    farsiWord: "کردن",
    phonetic: "kardan",
    englishTranslation: "To do / To make",
    exampleFarsi: "چه کار می‌کنی؟",
    examplePhonetic: "che kar mikoni?",
    exampleEnglish: "What are you doing?",
    difficultyLevel: 2,
  },
  {
    farsiWord: "داشتن",
    phonetic: "dashtan",
    englishTranslation: "To have",
    exampleFarsi: "من یک کتاب دارم",
    examplePhonetic: "man yek ketab daram",
    exampleEnglish: "I have a book",
    difficultyLevel: 2,
  },
  {
    farsiWord: "بودن",
    phonetic: "boodan",
    englishTranslation: "To be",
    exampleFarsi: "من خوشحالم",
    examplePhonetic: "man khoshhalam",
    exampleEnglish: "I am happy",
    difficultyLevel: 2,
  },
  {
    farsiWord: "خواستن",
    phonetic: "khastan",
    englishTranslation: "To want",
    exampleFarsi: "من آب می‌خواهم",
    examplePhonetic: "man ab mikhaham",
    exampleEnglish: "I want water",
    difficultyLevel: 2,
  },
  {
    farsiWord: "دانستن",
    phonetic: "danestan",
    englishTranslation: "To know",
    exampleFarsi: "من می‌دانم",
    examplePhonetic: "man midanam",
    exampleEnglish: "I know",
    difficultyLevel: 2,
  },
  {
    farsiWord: "توانستن",
    phonetic: "tavanestan",
    englishTranslation: "To be able to / Can",
    exampleFarsi: "من می‌توانم فارسی صحبت کنم",
    examplePhonetic: "man mitavanam farsi sohbat konam",
    exampleEnglish: "I can speak Farsi",
    difficultyLevel: 2,
  },
  // Movement Verbs
  {
    farsiWord: "نشستن",
    phonetic: "neshestan",
    englishTranslation: "To sit",
    exampleFarsi: "لطفا بنشینید",
    examplePhonetic: "lotfan beneshinid",
    exampleEnglish: "Please sit down",
    difficultyLevel: 2,
  },
  {
    farsiWord: "ایستادن",
    phonetic: "istadan",
    englishTranslation: "To stand",
    exampleFarsi: "من اینجا ایستاده‌ام",
    examplePhonetic: "man inja istadeam",
    exampleEnglish: "I am standing here",
    difficultyLevel: 2,
  },
  {
    farsiWord: "دویدن",
    phonetic: "davidan",
    englishTranslation: "To run",
    exampleFarsi: "او سریع می‌دود",
    examplePhonetic: "oo saree midavad",
    exampleEnglish: "He/She runs fast",
    difficultyLevel: 2,
  },
  {
    farsiWord: "راه رفتن",
    phonetic: "rah raftan",
    englishTranslation: "To walk",
    exampleFarsi: "من هر روز راه می‌روم",
    examplePhonetic: "man har rooz rah miravam",
    exampleEnglish: "I walk every day",
    difficultyLevel: 2,
  },
  // Daily Life Verbs
  {
    farsiWord: "نوشتن",
    phonetic: "neveshtan",
    englishTranslation: "To write",
    exampleFarsi: "من نامه می‌نویسم",
    examplePhonetic: "man nameh minevisam",
    exampleEnglish: "I write a letter",
    difficultyLevel: 2,
  },
  {
    farsiWord: "خواندن",
    phonetic: "khandan",
    englishTranslation: "To read",
    exampleFarsi: "من کتاب می‌خوانم",
    examplePhonetic: "man ketab mikhanam",
    exampleEnglish: "I read a book",
    difficultyLevel: 2,
  },
  {
    farsiWord: "کار کردن",
    phonetic: "kar kardan",
    englishTranslation: "To work",
    exampleFarsi: "من در دفتر کار می‌کنم",
    examplePhonetic: "man dar daftar kar mikonam",
    exampleEnglish: "I work in an office",
    difficultyLevel: 2,
  },
  {
    farsiWord: "یاد گرفتن",
    phonetic: "yad gereftan",
    englishTranslation: "To learn",
    exampleFarsi: "من فارسی یاد می‌گیرم",
    examplePhonetic: "man farsi yad migiram",
    exampleEnglish: "I am learning Farsi",
    difficultyLevel: 2,
  },
  {
    farsiWord: "فکر کردن",
    phonetic: "fekr kardan",
    englishTranslation: "To think",
    exampleFarsi: "من دارم فکر می‌کنم",
    examplePhonetic: "man daram fekr mikonam",
    exampleEnglish: "I am thinking",
    difficultyLevel: 2,
  },
  {
    farsiWord: "دوست داشتن",
    phonetic: "doost dashtan",
    englishTranslation: "To like / To love",
    exampleFarsi: "من غذای ایرانی دوست دارم",
    examplePhonetic: "man ghazaye irani doost daram",
    exampleEnglish: "I like Iranian food",
    difficultyLevel: 2,
  },
];

// Phrasal Verbs and Advanced Verbs (Level 3)
const phrasalVerbs = [
  // Common Phrasal Verbs
  {
    farsiWord: "برگشتن",
    phonetic: "bargashtan",
    englishTranslation: "To return / To go back",
    exampleFarsi: "من فردا برمی‌گردم",
    examplePhonetic: "man farda barmigardam",
    exampleEnglish: "I will return tomorrow",
    difficultyLevel: 3,
  },
  {
    farsiWord: "در آوردن",
    phonetic: "dar avardan",
    englishTranslation: "To take out / To remove",
    exampleFarsi: "کفش‌هایت را در بیاور",
    examplePhonetic: "kafshhayat ra dar biyar",
    exampleEnglish: "Take off your shoes",
    difficultyLevel: 3,
  },
  {
    farsiWord: "پوشیدن",
    phonetic: "pooshidan",
    englishTranslation: "To wear / To put on",
    exampleFarsi: "من لباس گرم می‌پوشم",
    examplePhonetic: "man lebas garm mipoosham",
    exampleEnglish: "I wear warm clothes",
    difficultyLevel: 3,
  },
  {
    farsiWord: "بلند شدن",
    phonetic: "boland shodan",
    englishTranslation: "To get up / To stand up",
    exampleFarsi: "لطفا بلند شوید",
    examplePhonetic: "lotfan boland shavid",
    exampleEnglish: "Please stand up",
    difficultyLevel: 3,
  },
  {
    farsiWord: "جمع کردن",
    phonetic: "jam kardan",
    englishTranslation: "To collect / To gather",
    exampleFarsi: "اتاقت را جمع کن",
    examplePhonetic: "otaghet ra jam kon",
    exampleEnglish: "Clean up your room",
    difficultyLevel: 3,
  },
  {
    farsiWord: "تمام کردن",
    phonetic: "tamam kardan",
    englishTranslation: "To finish / To complete",
    exampleFarsi: "کارم را تمام کردم",
    examplePhonetic: "karam ra tamam kardam",
    exampleEnglish: "I finished my work",
    difficultyLevel: 3,
  },
  {
    farsiWord: "شروع کردن",
    phonetic: "shoro kardan",
    englishTranslation: "To start / To begin",
    exampleFarsi: "بیا شروع کنیم",
    examplePhonetic: "biya shoro konim",
    exampleEnglish: "Let's start",
    difficultyLevel: 3,
  },
  {
    farsiWord: "ادامه دادن",
    phonetic: "edame dadan",
    englishTranslation: "To continue",
    exampleFarsi: "لطفا ادامه بدهید",
    examplePhonetic: "lotfan edame bedahid",
    exampleEnglish: "Please continue",
    difficultyLevel: 3,
  },
  {
    farsiWord: "منتظر ماندن",
    phonetic: "montazer mandan",
    englishTranslation: "To wait",
    exampleFarsi: "یک لحظه منتظر بمانید",
    examplePhonetic: "yek lahze montazer bemanid",
    exampleEnglish: "Wait a moment",
    difficultyLevel: 3,
  },
  {
    farsiWord: "حرف زدن",
    phonetic: "harf zadan",
    englishTranslation: "To talk / To speak",
    exampleFarsi: "ما با هم حرف می‌زنیم",
    examplePhonetic: "ma ba ham harf mizanim",
    exampleEnglish: "We talk to each other",
    difficultyLevel: 3,
  },
  {
    farsiWord: "گوش دادن",
    phonetic: "goosh dadan",
    englishTranslation: "To listen",
    exampleFarsi: "به من گوش بده",
    examplePhonetic: "be man goosh bede",
    exampleEnglish: "Listen to me",
    difficultyLevel: 3,
  },
  {
    farsiWord: "نگاه کردن",
    phonetic: "negah kardan",
    englishTranslation: "To look at",
    exampleFarsi: "به من نگاه کن",
    examplePhonetic: "be man negah kon",
    exampleEnglish: "Look at me",
    difficultyLevel: 3,
  },
  {
    farsiWord: "پیدا کردن",
    phonetic: "peyda kardan",
    englishTranslation: "To find",
    exampleFarsi: "کلیدم را پیدا کردم",
    examplePhonetic: "klidam ra peyda kardam",
    exampleEnglish: "I found my key",
    difficultyLevel: 3,
  },
  {
    farsiWord: "گم کردن",
    phonetic: "gom kardan",
    englishTranslation: "To lose",
    exampleFarsi: "کیفم را گم کردم",
    examplePhonetic: "kifam ra gom kardam",
    exampleEnglish: "I lost my bag",
    difficultyLevel: 3,
  },
  {
    farsiWord: "یادم رفتن",
    phonetic: "yadam raftan",
    englishTranslation: "To forget",
    exampleFarsi: "یادم رفت چی بگم",
    examplePhonetic: "yadam raft chi begam",
    exampleEnglish: "I forgot what to say",
    difficultyLevel: 3,
  },
  {
    farsiWord: "یاد آوردن",
    phonetic: "yad avardan",
    englishTranslation: "To remember / To remind",
    exampleFarsi: "یادم آورد که قرار داشتم",
    examplePhonetic: "yadam avord ke gharar dashtam",
    exampleEnglish: "I remembered I had a meeting",
    difficultyLevel: 3,
  },
  {
    farsiWord: "عوض کردن",
    phonetic: "avaz kardan",
    englishTranslation: "To change",
    exampleFarsi: "لباسم را عوض می‌کنم",
    examplePhonetic: "lebasam ra avaz mikonam",
    exampleEnglish: "I change my clothes",
    difficultyLevel: 3,
  },
  {
    farsiWord: "قبول کردن",
    phonetic: "ghabool kardan",
    englishTranslation: "To accept",
    exampleFarsi: "دعوتت را قبول می‌کنم",
    examplePhonetic: "davatetet ra ghabool mikonam",
    exampleEnglish: "I accept your invitation",
    difficultyLevel: 3,
  },
  {
    farsiWord: "رد کردن",
    phonetic: "rad kardan",
    englishTranslation: "To reject / To pass",
    exampleFarsi: "پیشنهادش را رد کردم",
    examplePhonetic: "pishnahadash ra rad kardam",
    exampleEnglish: "I rejected his/her offer",
    difficultyLevel: 3,
  },
  {
    farsiWord: "تعجب کردن",
    phonetic: "taajob kardan",
    englishTranslation: "To be surprised",
    exampleFarsi: "از خبر تعجب کردم",
    examplePhonetic: "az khabar taajob kardam",
    exampleEnglish: "I was surprised by the news",
    difficultyLevel: 3,
  },
  // Advanced Phrasal Verbs
  {
    farsiWord: "سر زدن",
    phonetic: "sar zadan",
    englishTranslation: "To visit / To drop by",
    exampleFarsi: "به دوستم سر زدم",
    examplePhonetic: "be doostam sar zadam",
    exampleEnglish: "I visited my friend",
    difficultyLevel: 3,
  },
  {
    farsiWord: "حوصله داشتن",
    phonetic: "hoseleh dashtan",
    englishTranslation: "To have patience / To be in the mood",
    exampleFarsi: "امروز حوصله ندارم",
    examplePhonetic: "emrooz hoseleh nadaram",
    exampleEnglish: "I'm not in the mood today",
    difficultyLevel: 3,
  },
  {
    farsiWord: "سعی کردن",
    phonetic: "sa'y kardan",
    englishTranslation: "To try",
    exampleFarsi: "سعی می‌کنم بهتر بشم",
    examplePhonetic: "sa'y mikonam behtar besham",
    exampleEnglish: "I try to get better",
    difficultyLevel: 3,
  },
  {
    farsiWord: "امتحان کردن",
    phonetic: "emtehan kardan",
    englishTranslation: "To test / To try out",
    exampleFarsi: "این غذا را امتحان کن",
    examplePhonetic: "in ghaza ra emtehan kon",
    exampleEnglish: "Try this food",
    difficultyLevel: 3,
  },
  {
    farsiWord: "خسته شدن",
    phonetic: "khasteh shodan",
    englishTranslation: "To get tired",
    exampleFarsi: "از کار زیاد خسته شدم",
    examplePhonetic: "az kar ziyad khasteh shodam",
    exampleEnglish: "I got tired from too much work",
    difficultyLevel: 3,
  },
];

async function main() {
  console.log("🌱 Seeding verbs and phrasal verbs...\n");

  try {
    // Step 1: Create verb categories
    console.log("📁 Creating verb categories...\n");

    // Check if categories already exist
    const existingBasicVerbs = await db
      .select()
      .from(wordCategories)
      .where(eq(wordCategories.slug, "basic-verbs"));

    let basicVerbCategory;
    if (existingBasicVerbs.length === 0) {
      const result = await db.insert(wordCategories).values({
        name: "Basic Verbs",
        slug: "basic-verbs",
        description: "Essential everyday verbs for daily communication",
        icon: "🏃",
        difficultyLevel: 2,
        sortOrder: 10,
      }).returning();
      basicVerbCategory = result[0];
      console.log("✓ Created: Basic Verbs category");
    } else {
      basicVerbCategory = existingBasicVerbs[0];
      console.log("✓ Basic Verbs category already exists");
    }

    const existingPhrasalVerbs = await db
      .select()
      .from(wordCategories)
      .where(eq(wordCategories.slug, "phrasal-verbs"));

    let phrasalVerbCategory;
    if (existingPhrasalVerbs.length === 0) {
      const result = await db.insert(wordCategories).values({
        name: "Phrasal Verbs",
        slug: "phrasal-verbs",
        description: "Common compound and phrasal verbs in Farsi",
        icon: "🔗",
        difficultyLevel: 3,
        sortOrder: 10,
      }).returning();
      phrasalVerbCategory = result[0];
      console.log("✓ Created: Phrasal Verbs category");
    } else {
      phrasalVerbCategory = existingPhrasalVerbs[0];
      console.log("✓ Phrasal Verbs category already exists");
    }

    // Step 2: Add Basic Verbs
    console.log("\n📝 Adding Basic Verbs...\n");
    let basicVerbCount = 0;

    for (const verb of basicVerbs) {
      // Check if word already exists
      const existing = await db
        .select()
        .from(vocabulary)
        .where(eq(vocabulary.phonetic, verb.phonetic));

      if (existing.length === 0) {
        const inserted = await db.insert(vocabulary).values({
          ...verb,
          isActive: true,
        }).returning();

        // Link to category
        await db.insert(vocabularyCategories).values({
          vocabularyId: inserted[0].id,
          categoryId: basicVerbCategory.id,
        });

        console.log(`  ✓ ${verb.phonetic} - ${verb.englishTranslation}`);
        basicVerbCount++;
      } else {
        console.log(`  ⏭ ${verb.phonetic} already exists`);
      }
    }

    // Step 3: Add Phrasal Verbs
    console.log("\n📝 Adding Phrasal Verbs...\n");
    let phrasalVerbCount = 0;

    for (const verb of phrasalVerbs) {
      // Check if word already exists
      const existing = await db
        .select()
        .from(vocabulary)
        .where(eq(vocabulary.phonetic, verb.phonetic));

      if (existing.length === 0) {
        const inserted = await db.insert(vocabulary).values({
          ...verb,
          isActive: true,
        }).returning();

        // Link to category
        await db.insert(vocabularyCategories).values({
          vocabularyId: inserted[0].id,
          categoryId: phrasalVerbCategory.id,
        });

        console.log(`  ✓ ${verb.phonetic} - ${verb.englishTranslation}`);
        phrasalVerbCount++;
      } else {
        console.log(`  ⏭ ${verb.phonetic} already exists`);
      }
    }

    // Step 4: Create lessons for verb categories
    console.log("\n📚 Creating verb lessons...\n");

    // Check if lessons already exist
    const existingBasicVerbsLesson = await db
      .select()
      .from(lessons)
      .where(eq(lessons.categoryId, basicVerbCategory.id));

    if (existingBasicVerbsLesson.length === 0) {
      await db.insert(lessons).values({
        categoryId: basicVerbCategory.id,
        title: "Basic Verbs",
        description: "Master essential everyday verbs - the building blocks of Farsi sentences",
        difficultyLevel: 2,
        sortOrder: 100,
        isActive: true,
      });
      console.log("✓ Created: Basic Verbs lesson");
    } else {
      console.log("✓ Basic Verbs lesson already exists");
    }

    const existingPhrasalVerbsLesson = await db
      .select()
      .from(lessons)
      .where(eq(lessons.categoryId, phrasalVerbCategory.id));

    if (existingPhrasalVerbsLesson.length === 0) {
      await db.insert(lessons).values({
        categoryId: phrasalVerbCategory.id,
        title: "Phrasal Verbs",
        description: "Learn compound verbs and expressions that make your Farsi more natural",
        difficultyLevel: 3,
        sortOrder: 101,
        isActive: true,
      });
      console.log("✓ Created: Phrasal Verbs lesson");
    } else {
      console.log("✓ Phrasal Verbs lesson already exists");
    }

    // Summary
    console.log("\n" + "=".repeat(50));
    console.log("✅ VERB SEEDING COMPLETE!");
    console.log("=".repeat(50));
    console.log(`\n📊 Summary:`);
    console.log(`   • Basic Verbs added: ${basicVerbCount}`);
    console.log(`   • Phrasal Verbs added: ${phrasalVerbCount}`);
    console.log(`   • Total new verbs: ${basicVerbCount + phrasalVerbCount}`);
    console.log(`   • New lessons created: 2`);
    console.log("\n🎉 Your verb lessons are ready!");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error seeding verbs:", error);
    process.exit(1);
  }
}

main();
