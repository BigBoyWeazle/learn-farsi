import { NextResponse } from "next/server";
import { db } from "@/db";
import { vocabulary, wordCategories, vocabularyCategories, lessons } from "@/db/schema";
import { eq } from "drizzle-orm";

const MAX_WORDS_PER_LESSON = 10;

/**
 * POST /api/admin/seed-verbs-expanded
 * Seed expanded verbs from the Google Doc content
 * Splits lessons with >10 words into multiple lessons
 * All verbs use PHONETIC Farsi (Latin script)
 */
export async function POST() {
  try {
    // Define verb categories with their verbs
    const verbCategories = [
      {
        category: {
          name: "Essential Verbs",
          slug: "essential-verbs",
          description: "The most common and important verbs in Farsi",
          icon: "🎯",
          difficultyLevel: 2,
        },
        verbs: [
          { phonetic: "boodan", english: "To be", example: "man hastam - I am" },
          { phonetic: "daashtan", english: "To have", example: "man daaram - I have" },
          { phonetic: "kardan", english: "To do", example: "man mikonam - I do" },
          { phonetic: "shodan", english: "To become", example: "man misham - I become" },
          { phonetic: "raftan", english: "To go", example: "man miravam - I go" },
          { phonetic: "aamadan", english: "To come", example: "man miaam - I come" },
          { phonetic: "khordan", english: "To eat", example: "man mikhoram - I eat" },
          { phonetic: "didan", english: "To see", example: "man mibinam - I see" },
          { phonetic: "goftan", english: "To say", example: "man miguyam - I say" },
          { phonetic: "dadan", english: "To give", example: "man midam - I give" },
          { phonetic: "gereftan", english: "To take/get", example: "man migiram - I take" },
          { phonetic: "khaastan", english: "To want", example: "man mikhaam - I want" },
        ],
      },
      {
        category: {
          name: "Daily Activity Verbs",
          slug: "daily-verbs",
          description: "Verbs for everyday activities",
          icon: "☀️",
          difficultyLevel: 2,
        },
        verbs: [
          { phonetic: "khaabidan", english: "To sleep", example: "man mikhaabam - I sleep" },
          { phonetic: "bidaar shodan", english: "To wake up", example: "man bidaar misham - I wake up" },
          { phonetic: "khaandan", english: "To read", example: "man mikhaanam - I read" },
          { phonetic: "neveshtan", english: "To write", example: "man minevisam - I write" },
          { phonetic: "pooshidan", english: "To wear", example: "man mipoosham - I wear" },
          { phonetic: "shoshtan", english: "To wash", example: "man mishooram - I wash" },
          { phonetic: "neshastan", english: "To sit", example: "man mineshinam - I sit" },
          { phonetic: "kharidan", english: "To buy", example: "man mikharam - I buy" },
          { phonetic: "porsidan", english: "To ask", example: "man miporsam - I ask" },
          { phonetic: "residan", english: "To arrive", example: "man miresam - I arrive" },
        ],
      },
      {
        category: {
          name: "Action Verbs",
          slug: "action-verbs",
          description: "Physical actions and movements",
          icon: "🏃",
          difficultyLevel: 3,
        },
        verbs: [
          { phonetic: "zadan", english: "To hit/play/put", example: "man mizanam - I hit" },
          { phonetic: "bordan", english: "To take/win", example: "man mibaram - I take" },
          { phonetic: "avardan", english: "To bring", example: "man miavaram - I bring" },
          { phonetic: "bastan", english: "To close", example: "man mibandam - I close" },
          { phonetic: "baaz kardan", english: "To open", example: "man baaz mikonam - I open" },
          { phonetic: "boridan", english: "To cut", example: "man miboram - I cut" },
          { phonetic: "andakhtan", english: "To throw", example: "man miandaazam - I throw" },
          { phonetic: "keshidan", english: "To pull/draw", example: "man mikesham - I pull" },
          { phonetic: "oftadan", english: "To fall", example: "man mioftam - I fall" },
          { phonetic: "davidan", english: "To run", example: "man midavam - I run" },
        ],
      },
      {
        category: {
          name: "Kardan Verbs (Part 1)",
          slug: "kardan-verbs-1",
          description: "Common verbs formed with kardan (to do)",
          icon: "🔧",
          difficultyLevel: 3,
        },
        verbs: [
          { phonetic: "kaar kardan", english: "To work", example: "man kaar mikonam - I work" },
          { phonetic: "fekr kardan", english: "To think", example: "man fekr mikonam - I think" },
          { phonetic: "safar kardan", english: "To travel", example: "man safar mikonam - I travel" },
          { phonetic: "varzesh kardan", english: "To exercise", example: "man varzesh mikonam - I exercise" },
          { phonetic: "aashpazi kardan", english: "To cook", example: "man aashpazi mikonam - I cook" },
          { phonetic: "goosh kardan", english: "To listen", example: "man goosh mikonam - I listen" },
          { phonetic: "tamoom kardan", english: "To finish", example: "man tamoom mikonam - I finish" },
          { phonetic: "shoroo kardan", english: "To start", example: "man shoroo mikonam - I start" },
          { phonetic: "zendegi kardan", english: "To live", example: "man zendegi mikonam - I live" },
          { phonetic: "komak kardan", english: "To help", example: "man komak mikonam - I help" },
        ],
      },
      {
        category: {
          name: "Kardan Verbs (Part 2)",
          slug: "kardan-verbs-2",
          description: "More verbs formed with kardan (to do)",
          icon: "🔧",
          difficultyLevel: 3,
        },
        verbs: [
          { phonetic: "baazi kardan", english: "To play (game)", example: "man baazi mikonam - I play" },
          { phonetic: "sohbat kardan", english: "To speak/talk", example: "man sohbat mikonam - I talk" },
          { phonetic: "estefaade kardan", english: "To use", example: "man estefaade mikonam - I use" },
          { phonetic: "dorost kardan", english: "To make/fix", example: "man dorost mikonam - I make" },
          { phonetic: "ezaafe kardan", english: "To add", example: "man ezaafe mikonam - I add" },
          { phonetic: "tamir kardan", english: "To repair", example: "man tamir mikonam - I repair" },
          { phonetic: "peydaa kardan", english: "To find", example: "man peydaa mikonam - I find" },
          { phonetic: "garm kardan", english: "To heat", example: "man garm mikonam - I heat" },
        ],
      },
      {
        category: {
          name: "Shodan Verbs",
          slug: "shodan-verbs",
          description: "Common verbs formed with shodan (to become)",
          icon: "🔄",
          difficultyLevel: 3,
        },
        verbs: [
          { phonetic: "amaade shodan", english: "To get ready", example: "man amaade misham - I get ready" },
          { phonetic: "asabaani shodan", english: "To get angry", example: "man asabaani misham - I get angry" },
          { phonetic: "gij shodan", english: "To get confused", example: "man gij misham - I get confused" },
          { phonetic: "baste shodan", english: "To be closed", example: "dar baste shod - door got closed" },
          { phonetic: "baaz shodan", english: "To be opened", example: "dar baaz shod - door got opened" },
          { phonetic: "savaar shodan", english: "To get on (vehicle)", example: "man savaar misham - I get on" },
          { phonetic: "piaade shodan", english: "To get off", example: "man piaade misham - I get off" },
          { phonetic: "movaffagh shodan", english: "To succeed", example: "man movaffagh misham - I succeed" },
          { phonetic: "ghabool shodan", english: "To be accepted", example: "man ghabool shodam - I was accepted" },
        ],
      },
      {
        category: {
          name: "Daashtan Verbs",
          slug: "daashtan-verbs",
          description: "Common verbs formed with daashtan (to have)",
          icon: "📦",
          difficultyLevel: 3,
        },
        verbs: [
          { phonetic: "doost daashtan", english: "To like/love", example: "man doost daaram - I like" },
          { phonetic: "alaaghe daashtan", english: "To be interested", example: "man alaaghe daaram - I am interested" },
          { phonetic: "niaz daashtan", english: "To need", example: "man niaz daaram - I need" },
          { phonetic: "vaght daashtan", english: "To have time", example: "man vaght daaram - I have time" },
          { phonetic: "ajale daashtan", english: "To be in a hurry", example: "man ajale daaram - I'm in a hurry" },
        ],
      },
      {
        category: {
          name: "Zadan & Gereftan Verbs",
          slug: "zadan-gereftan-verbs",
          description: "Verbs with zadan (hit/play) and gereftan (take)",
          icon: "🎵",
          difficultyLevel: 3,
        },
        verbs: [
          { phonetic: "harf zadan", english: "To speak/talk", example: "man harf mizanam - I speak" },
          { phonetic: "mesvaak zadan", english: "To brush teeth", example: "man mesvaak mizanam - I brush" },
          { phonetic: "chart zadan", english: "To nap", example: "man chart mizanam - I nap" },
          { phonetic: "ham zadan", english: "To stir", example: "man ham mizanam - I stir" },
          { phonetic: "doosh gereftan", english: "To shower", example: "man doosh migiram - I shower" },
          { phonetic: "yaad gereftan", english: "To learn", example: "man yaad migiram - I learn" },
          { phonetic: "jashn gereftan", english: "To celebrate", example: "man jashn migiram - I celebrate" },
        ],
      },
    ];

    let totalVerbs = 0;
    let totalCategories = 0;
    let totalLessons = 0;

    // Get highest existing lesson sortOrder to continue numbering
    const existingLessons = await db.select().from(lessons);
    const maxSortOrder = existingLessons.reduce((max, l) => Math.max(max, l.sortOrder), 0);
    let currentSortOrder = maxSortOrder;

    for (const data of verbCategories) {
      // Check if category already exists by slug OR name
      const existingBySlug = await db
        .select()
        .from(wordCategories)
        .where(eq(wordCategories.slug, data.category.slug))
        .limit(1);

      const existingByName = await db
        .select()
        .from(wordCategories)
        .where(eq(wordCategories.name, data.category.name))
        .limit(1);

      let categoryId: string;

      if (existingBySlug.length > 0) {
        categoryId = existingBySlug[0].id;
      } else if (existingByName.length > 0) {
        categoryId = existingByName[0].id;
      } else {
        // Create category
        const [newCategory] = await db
          .insert(wordCategories)
          .values({
            ...data.category,
            sortOrder: data.category.difficultyLevel * 100 + 50,
          })
          .returning();
        categoryId = newCategory.id;
        totalCategories++;
      }

      // Split verbs into chunks of MAX_WORDS_PER_LESSON
      const verbChunks: typeof data.verbs[] = [];
      for (let i = 0; i < data.verbs.length; i += MAX_WORDS_PER_LESSON) {
        verbChunks.push(data.verbs.slice(i, i + MAX_WORDS_PER_LESSON));
      }

      // Create lessons for each chunk
      for (let chunkIndex = 0; chunkIndex < verbChunks.length; chunkIndex++) {
        const chunk = verbChunks[chunkIndex];
        currentSortOrder++;

        // Generate lesson title
        let lessonTitle: string;
        if (verbChunks.length === 1) {
          lessonTitle = `Lesson ${currentSortOrder}: ${data.category.name}`;
        } else {
          lessonTitle = `Lesson ${currentSortOrder}: ${data.category.name} (Part ${chunkIndex + 1})`;
        }

        // Check if lesson already exists
        const existingLesson = await db
          .select()
          .from(lessons)
          .where(eq(lessons.title, lessonTitle))
          .limit(1);

        let lessonId: string;
        if (existingLesson.length > 0) {
          lessonId = existingLesson[0].id;
        } else {
          const [newLesson] = await db
            .insert(lessons)
            .values({
              categoryId: categoryId,
              title: lessonTitle,
              description: data.category.description,
              difficultyLevel: data.category.difficultyLevel,
              sortOrder: currentSortOrder,
            })
            .returning();
          lessonId = newLesson.id;
          totalLessons++;
        }

        // Insert verbs for this chunk
        for (const verb of chunk) {
          // Check if verb already exists
          const existingVerb = await db
            .select()
            .from(vocabulary)
            .where(eq(vocabulary.phonetic, verb.phonetic))
            .limit(1);

          if (existingVerb.length === 0) {
            const [newVerb] = await db
              .insert(vocabulary)
              .values({
                farsiWord: verb.phonetic,
                phonetic: verb.phonetic,
                englishTranslation: verb.english,
                examplePhonetic: verb.example,
                exampleEnglish: "",
                difficultyLevel: data.category.difficultyLevel,
                isActive: true,
              })
              .returning();

            // Link verb to category
            await db.insert(vocabularyCategories).values({
              vocabularyId: newVerb.id,
              categoryId: categoryId,
            });
            totalVerbs++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded expanded verbs`,
      stats: {
        categoriesCreated: totalCategories,
        lessonsCreated: totalLessons,
        verbsAdded: totalVerbs,
      },
    });
  } catch (error) {
    console.error("Error seeding expanded verbs:", error);
    return NextResponse.json(
      { error: "Failed to seed expanded verbs", details: String(error) },
      { status: 500 }
    );
  }
}
