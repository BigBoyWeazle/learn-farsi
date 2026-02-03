import { NextResponse } from "next/server";
import { db } from "@/db";
import { vocabulary, wordCategories, vocabularyCategories, lessons } from "@/db/schema";
import { eq } from "drizzle-orm";

const MAX_WORDS_PER_LESSON = 10;

/**
 * POST /api/admin/seed-vocabulary-expanded
 * Seed expanded vocabulary from the Google Doc content
 * Splits lessons with >10 words into multiple lessons
 * All words use PHONETIC Farsi (Latin script)
 */
export async function POST() {
  try {
    // Define categories with their words
    const categoriesData = [
      // LEVEL 1: Beginner
      {
        category: {
          name: "Introduction & Greetings",
          slug: "introduction-greetings",
          description: "Essential greetings and introduction phrases",
          icon: "👋",
          difficultyLevel: 1,
        },
        words: [
          { phonetic: "salaam", english: "Hello", example: "Salaam, chetori?" },
          { phonetic: "chetori", english: "How are you?", example: "Salaam, chetori?" },
          { phonetic: "khoobam", english: "I am good", example: "Mersi, khoobam" },
          { phonetic: "mersi", english: "Thank you", example: "Mersi az komak-et" },
          { phonetic: "motshakeram", english: "Thank you (formal)", example: "Motshakeram az shomaa" },
          { phonetic: "mamnoon", english: "Thank you", example: "Kheyli mamnoon" },
          { phonetic: "sobh bekheyr", english: "Good morning", example: "Sobh bekheyr, haal-et chetore?" },
          { phonetic: "shab bekheyr", english: "Good night", example: "Shab bekheyr, fardaa mibinamet" },
          { phonetic: "khosh oomadin", english: "Welcome", example: "Khosh oomadin be Iraan" },
          { phonetic: "khosh vaghtam", english: "Nice to meet you", example: "Khosh vaghtam, man Thomas hastam" },
          { phonetic: "befarmaayid", english: "You are welcome / Here you go", example: "Befarmaayid, befarmaayin" },
        ],
      },
      {
        category: {
          name: "Essential Words",
          slug: "essential-words",
          description: "Most common everyday words",
          icon: "⭐",
          difficultyLevel: 1,
        },
        words: [
          { phonetic: "bale", english: "Yes (formal)", example: "Bale, dorost ast" },
          { phonetic: "aare", english: "Yes (informal)", example: "Aare, miaam" },
          { phonetic: "na", english: "No", example: "Na, mamnoon" },
          { phonetic: "khoob", english: "Good", example: "In khoob ast" },
          { phonetic: "ali", english: "Great", example: "Ali bood!" },
          { phonetic: "doroste", english: "Correct", example: "Bale, doroste" },
          { phonetic: "bebakshid", english: "Sorry / Excuse me", example: "Bebakshid, kojaa ast?" },
          { phonetic: "lotfan", english: "Please", example: "Lotfan komak konid" },
          { phonetic: "hamin", english: "That's all", example: "Hamin, mersi" },
          { phonetic: "faghat", english: "Just / Only", example: "Faghat yek taa" },
        ],
      },
      {
        category: {
          name: "Demonstratives",
          slug: "demonstratives",
          description: "This, that, these, those",
          icon: "👆",
          difficultyLevel: 1,
        },
        words: [
          { phonetic: "een", english: "This", example: "Een ketaab ast" },
          { phonetic: "oon", english: "That", example: "Oon chi-e?" },
          { phonetic: "eenhaa", english: "These", example: "Eenhaa ketaab-haa hastand" },
          { phonetic: "oonhaa", english: "Those", example: "Oonhaa doost-haa-ye man hastand" },
        ],
      },
      {
        category: {
          name: "Numbers 1-10",
          slug: "numbers-basic",
          description: "Basic counting from 0 to 10",
          icon: "🔢",
          difficultyLevel: 1,
        },
        words: [
          { phonetic: "sefr", english: "Zero", example: "Sefr taa dah" },
          { phonetic: "yek", english: "One", example: "Yek ketaab" },
          { phonetic: "do", english: "Two", example: "Do taa sib" },
          { phonetic: "se", english: "Three", example: "Se nafar" },
          { phonetic: "chaar", english: "Four", example: "Chaar fasl" },
          { phonetic: "panj", english: "Five", example: "Panj rooz" },
          { phonetic: "shish", english: "Six", example: "Shish taa bach'e" },
          { phonetic: "haft", english: "Seven", example: "Haft o nim" },
          { phonetic: "hasht", english: "Eight", example: "Hasht-e shab" },
          { phonetic: "noh", english: "Nine", example: "Noh saal" },
          { phonetic: "dah", english: "Ten", example: "Dah daghighe" },
        ],
      },

      // LEVEL 2: Elementary
      {
        category: {
          name: "Household Items",
          slug: "household-items",
          description: "Common objects around the house",
          icon: "🏠",
          difficultyLevel: 2,
        },
        words: [
          { phonetic: "kelid", english: "Key", example: "Kelid kojaa-st?" },
          { phonetic: "aayene", english: "Mirror", example: "Aayene tamiz ast" },
          { phonetic: "mesvaak", english: "Toothbrush", example: "Mesvaak-am kojaa-st?" },
          { phonetic: "livaan", english: "Glass", example: "Yek livaan aab" },
          { phonetic: "farsh", english: "Carpet", example: "Farsh ghermez ast" },
          { phonetic: "dar", english: "Door", example: "Dar baaz ast" },
          { phonetic: "panjere", english: "Window", example: "Panjere baste ast" },
          { phonetic: "parde", english: "Curtain", example: "Parde sabz ast" },
          { phonetic: "sandali", english: "Chair", example: "Roo-ye sandali benshin" },
          { phonetic: "miiz", english: "Desk/Table", example: "Ketaab roo-ye miiz ast" },
          { phonetic: "takht-e khaab", english: "Bed", example: "Man roo-ye takht-e khaab mikhaabam" },
          { phonetic: "komod", english: "Closet", example: "Lebaas dar komod ast" },
          { phonetic: "divaar", english: "Wall", example: "Aks roo-ye divaar ast" },
          { phonetic: "satl-e zobaale", english: "Trash can", example: "Kaghaz raa dar satl-e zobaale bendaaz" },
        ],
      },
      {
        category: {
          name: "Food & Drinks",
          slug: "food-drinks",
          description: "Common foods and beverages",
          icon: "🍔",
          difficultyLevel: 2,
        },
        words: [
          { phonetic: "aab", english: "Water", example: "Yek livaan aab mikhaaam" },
          { phonetic: "naan", english: "Bread", example: "Naan taaze ast" },
          { phonetic: "shir", english: "Milk", example: "Shir sard ast" },
          { phonetic: "panir", english: "Cheese", example: "Panir khoshmazze ast" },
          { phonetic: "takhm-e morgh", english: "Egg", example: "Sobhaane takhm-e morgh mikhoram" },
          { phonetic: "goosht", english: "Meat", example: "Goosht garm ast" },
          { phonetic: "sib", english: "Apple", example: "Sib ghermez ast" },
          { phonetic: "mowz", english: "Banana", example: "Mowz zard ast" },
          { phonetic: "porteghaal", english: "Orange", example: "Aab-e porteghaal mikhaaam" },
          { phonetic: "goje", english: "Tomato", example: "Goje taaze ast" },
          { phonetic: "havij", english: "Carrot", example: "Havij naarnji ast" },
          { phonetic: "sib zamini", english: "Potato", example: "Sib zamini mikhaaam" },
          { phonetic: "chaay", english: "Tea", example: "Yek fenjaan chaay lotfan" },
          { phonetic: "ghazaa", english: "Food", example: "Ghazaa khoshmazze ast" },
          { phonetic: "maast", english: "Yoghurt", example: "Maast sard ast" },
          { phonetic: "kare", english: "Butter", example: "Naan baa kare" },
          { phonetic: "shekar", english: "Sugar", example: "Shekar mikhaay?" },
          { phonetic: "namak", english: "Salt", example: "Namak ezaafe kon" },
        ],
      },
      {
        category: {
          name: "Family & People",
          slug: "family-people",
          description: "Family members and people",
          icon: "👨‍👩‍👧",
          difficultyLevel: 2,
        },
        words: [
          { phonetic: "aaghaa", english: "Mister / Sir", example: "Aaghaa-ye Ahmadi" },
          { phonetic: "khanoom", english: "Lady / Ma'am", example: "Khanoom-e Rezayi" },
          { phonetic: "mard", english: "Man", example: "Oon mard ast" },
          { phonetic: "zan", english: "Woman / Wife", example: "Oon zan ast" },
          { phonetic: "pesar", english: "Boy / Son", example: "Pesar-am daaneshjo ast" },
          { phonetic: "dokhtar", english: "Girl / Daughter", example: "Dokhtar-am madrese mire" },
          { phonetic: "madar", english: "Mother", example: "Madar-am Iraani ast" },
          { phonetic: "pedar", english: "Father", example: "Pedar-am mohandas ast" },
          { phonetic: "baraadar", english: "Brother", example: "Baraadar-am bozorg ast" },
          { phonetic: "khaahar", english: "Sister", example: "Khaahar-am koochik ast" },
          { phonetic: "pedar bozorg", english: "Grandfather", example: "Pedar bozorg-am pir ast" },
          { phonetic: "madar bozorg", english: "Grandmother", example: "Madar bozorg-am mehrabaan ast" },
          { phonetic: "amoo", english: "Uncle (dad's side)", example: "Amoo-yam Tehraani ast" },
          { phonetic: "khaale", english: "Aunt (mom's side)", example: "Khaale-am moalem ast" },
          { phonetic: "doost", english: "Friend", example: "Oo doost-e man ast" },
          { phonetic: "hamsaaye", english: "Neighbor", example: "Hamsaaye-haa mehrabaan hastand" },
        ],
      },
      {
        category: {
          name: "Time & Days",
          slug: "time-days",
          description: "Time expressions and days of the week",
          icon: "🕐",
          difficultyLevel: 2,
        },
        words: [
          { phonetic: "sa'at", english: "Clock / Time", example: "Sa'at chand ast?" },
          { phonetic: "rooz", english: "Day", example: "Emrooz rooz-e khoob-i ast" },
          { phonetic: "sobh", english: "Morning", example: "Sobh bidaar misham" },
          { phonetic: "zohr", english: "Noon", example: "Zohr naahaar mikhoram" },
          { phonetic: "asr", english: "Evening", example: "Asr be khoone miram" },
          { phonetic: "shab", english: "Night", example: "Shab mikhaabam" },
          { phonetic: "emrooz", english: "Today", example: "Emrooz chi kaar mikoni?" },
          { phonetic: "dirooz", english: "Yesterday", example: "Dirooz madrese raftam" },
          { phonetic: "fardaa", english: "Tomorrow", example: "Fardaa mibinamet" },
          { phonetic: "hafte", english: "Week", example: "Hafte-ye aayande" },
          { phonetic: "maah", english: "Month", example: "In maah" },
          { phonetic: "saal", english: "Year", example: "Saal-e jadid mobaaarak" },
          { phonetic: "shanbe", english: "Saturday", example: "Shanbe tatil ast" },
          { phonetic: "yek shanbe", english: "Sunday", example: "Yek shanbe kaar mikonam" },
          { phonetic: "do shanbe", english: "Monday", example: "Do shanbe madrese daaram" },
          { phonetic: "jom'e", english: "Friday", example: "Jom'e rooz-e tatil ast" },
        ],
      },
      {
        category: {
          name: "Prepositions",
          slug: "prepositions",
          description: "Location and direction words",
          icon: "📍",
          difficultyLevel: 2,
        },
        words: [
          { phonetic: "dar", english: "In (formal)", example: "Dar khoone hastam" },
          { phonetic: "too-ye", english: "In / Inside", example: "Too-ye otaagh ast" },
          { phonetic: "roo-ye", english: "On", example: "Ketaab roo-ye miiz ast" },
          { phonetic: "zir-e", english: "Under", example: "Gorbe zir-e miiz ast" },
          { phonetic: "kenaar-e", english: "Next to", example: "Kenaar-e dar ast" },
          { phonetic: "jelo-ye", english: "In front of", example: "Jelo-ye khoone" },
          { phonetic: "balaa-ye", english: "Above", example: "Balaa-ye sar-am" },
          { phonetic: "beyn-e", english: "Between", example: "Beyn-e do khoone" },
          { phonetic: "az", english: "From", example: "Az kojaa miaayi?" },
          { phonetic: "be", english: "To", example: "Be khoone miram" },
          { phonetic: "baa", english: "With", example: "Baa doost-am miram" },
          { phonetic: "baraaye", english: "For", example: "Baraaye to" },
          { phonetic: "taa", english: "Until", example: "Az sobh taa shab" },
        ],
      },

      // LEVEL 3: Intermediate
      {
        category: {
          name: "Jobs & Professions",
          slug: "jobs-professions",
          description: "Occupations and work-related vocabulary",
          icon: "💼",
          difficultyLevel: 3,
        },
        words: [
          { phonetic: "kaar", english: "Work / Job", example: "Kaar-am khoob ast" },
          { phonetic: "shogl", english: "Profession", example: "Shogl-et chi-e?" },
          { phonetic: "moalem", english: "Teacher", example: "Man moalem hastam" },
          { phonetic: "mohandes", english: "Engineer", example: "Oo mohandes ast" },
          { phonetic: "pezeshk", english: "Doctor", example: "Pezeshk matab daare" },
          { phonetic: "daaneshjo", english: "University student", example: "Man daaneshjo hastam" },
          { phonetic: "kaarmand", english: "Employee", example: "Kaarmand-e bank hastam" },
          { phonetic: "raanande", english: "Driver", example: "Raanande taxi ast" },
          { phonetic: "aashpaz", english: "Cook / Chef", example: "Aashpaz khoshmazze mizane" },
          { phonetic: "forooshande", english: "Salesperson", example: "Forooshande mehrabaan ast" },
          { phonetic: "parastaar", english: "Nurse", example: "Parastaar dar bimaarestaan kaar mikone" },
          { phonetic: "vakil", english: "Lawyer", example: "Vakil-am khoob ast" },
          { phonetic: "khalabaan", english: "Pilot", example: "Khalabaan havaapeymaa ast" },
          { phonetic: "hasaabdaar", english: "Accountant", example: "Hasaabdaar dar edaare kaar mikone" },
        ],
      },
      {
        category: {
          name: "Colors & Adjectives",
          slug: "colors-adjectives",
          description: "Colors and descriptive words",
          icon: "🎨",
          difficultyLevel: 3,
        },
        words: [
          { phonetic: "ghermez", english: "Red", example: "Sib ghermez ast" },
          { phonetic: "aabi", english: "Blue", example: "Aasmaan aabi ast" },
          { phonetic: "sabz", english: "Green", example: "Barg sabz ast" },
          { phonetic: "zard", english: "Yellow", example: "Mowz zard ast" },
          { phonetic: "sefid", english: "White", example: "Barf sefid ast" },
          { phonetic: "siyaah", english: "Black", example: "Shab siyaah ast" },
          { phonetic: "naarenjii", english: "Orange", example: "Havij naarenjii ast" },
          { phonetic: "bozorg", english: "Big", example: "Khoone bozorg ast" },
          { phonetic: "koochak", english: "Small", example: "Gorbe koochak ast" },
          { phonetic: "zibaa", english: "Beautiful", example: "Gol zibaa ast" },
          { phonetic: "jadid", english: "New", example: "Maashin jadid ast" },
          { phonetic: "ghadimi", english: "Old", example: "Khoone ghadimi ast" },
          { phonetic: "garm", english: "Hot", example: "Havaa garm ast" },
          { phonetic: "sard", english: "Cold", example: "Aab sard ast" },
          { phonetic: "tamiz", english: "Clean", example: "Otaagh tamiz ast" },
          { phonetic: "kasif", english: "Dirty", example: "Lebaas kasif ast" },
          { phonetic: "khoshmazze", english: "Delicious", example: "Ghazaa khoshmazze ast" },
          { phonetic: "bad", english: "Bad", example: "Havaa bad ast" },
        ],
      },
      {
        category: {
          name: "Weather & Seasons",
          slug: "weather-seasons",
          description: "Weather and seasons vocabulary",
          icon: "🌤️",
          difficultyLevel: 3,
        },
        words: [
          { phonetic: "havaa", english: "Weather", example: "Havaa chetore?" },
          { phonetic: "aaftaabi", english: "Sunny", example: "Emrooz aaftaabi ast" },
          { phonetic: "abri", english: "Cloudy", example: "Havaa abri ast" },
          { phonetic: "baaraan", english: "Rain", example: "Baaraan mibaarad" },
          { phonetic: "barf", english: "Snow", example: "Barf mibaarad" },
          { phonetic: "baad", english: "Wind", example: "Baad mivazad" },
          { phonetic: "bahaar", english: "Spring", example: "Bahaar zibaa ast" },
          { phonetic: "taabestan", english: "Summer", example: "Taabestan garm ast" },
          { phonetic: "paayiz", english: "Fall/Autumn", example: "Paayiz barg miofte" },
          { phonetic: "zemestaan", english: "Winter", example: "Zemestaan sard ast" },
        ],
      },
      {
        category: {
          name: "Animals",
          slug: "animals",
          description: "Common animals",
          icon: "🐾",
          difficultyLevel: 3,
        },
        words: [
          { phonetic: "heyvaan", english: "Animal", example: "Heyvaan-haa zibaa hastand" },
          { phonetic: "gorbe", english: "Cat", example: "Gorbe koochak ast" },
          { phonetic: "sag", english: "Dog", example: "Sag bozorg ast" },
          { phonetic: "parande", english: "Bird", example: "Parande parvaaz mikone" },
          { phonetic: "maahi", english: "Fish", example: "Maahi dar aab ast" },
          { phonetic: "asb", english: "Horse", example: "Asb davidan mikone" },
          { phonetic: "gaav", english: "Cow", example: "Gaav shir mide" },
          { phonetic: "shir", english: "Lion", example: "Shir ghavi ast" },
          { phonetic: "fil", english: "Elephant", example: "Fil bozorg ast" },
          { phonetic: "moorche", english: "Ant", example: "Moorche koochak ast" },
          { phonetic: "parvaane", english: "Butterfly", example: "Parvaane zibaa ast" },
          { phonetic: "laakposht", english: "Turtle", example: "Laakposht aaheste mire" },
        ],
      },
      {
        category: {
          name: "Countries & Travel",
          slug: "countries-travel",
          description: "Countries, nationalities, and travel vocabulary",
          icon: "✈️",
          difficultyLevel: 3,
        },
        words: [
          { phonetic: "keshvar", english: "Country", example: "Keshvar-e to kojaa-st?" },
          { phonetic: "shahr", english: "City", example: "Tehraaan shahr-e bozorg ast" },
          { phonetic: "safar", english: "Travel / Trip", example: "Man safar doost daaram" },
          { phonetic: "iraan", english: "Iran", example: "Iraan keshvar-e zibaa ast" },
          { phonetic: "iraani", english: "Iranian", example: "Man iraani hastam" },
          { phonetic: "amricaa", english: "America", example: "Amricaa door ast" },
          { phonetic: "engelis", english: "England", example: "Engelis dar Oroopaa ast" },
          { phonetic: "zabaan", english: "Language", example: "Zabaan-e faarsi yad migiram" },
          { phonetic: "mosaafer", english: "Traveler / Passenger", example: "Mosaafer-haa montazer hastand" },
          { phonetic: "havaapeymaa", english: "Airplane", example: "Baa havaapeymaa miram" },
          { phonetic: "ghataar", english: "Train", example: "Ghataar sari ast" },
          { phonetic: "otoboos", english: "Bus", example: "Baa otoboos miram" },
          { phonetic: "taaksi", english: "Taxi", example: "Taaksi gereftam" },
        ],
      },
      {
        category: {
          name: "Body Parts",
          slug: "body-parts",
          description: "Parts of the body",
          icon: "🫀",
          difficultyLevel: 3,
        },
        words: [
          { phonetic: "sar", english: "Head", example: "Sar-am dard mikone" },
          { phonetic: "cheshm", english: "Eye", example: "Cheshm-haa-yam aabi ast" },
          { phonetic: "goosh", english: "Ear", example: "Goosh-am khoob mishnavad" },
          { phonetic: "dast", english: "Hand", example: "Dast-haa-yam tamiz ast" },
          { phonetic: "paa", english: "Foot / Leg", example: "Paa-yam dard mikone" },
          { phonetic: "moo", english: "Hair", example: "Moo-haa-yam meshki ast" },
          { phonetic: "sorat", english: "Face", example: "Sorat-ash zibaa ast" },
          { phonetic: "badan", english: "Body", example: "Badan saalem ast" },
          { phonetic: "zaanoo", english: "Knee", example: "Zaanoo-yam dard mikone" },
          { phonetic: "kamar", english: "Waist / Back", example: "Kamar-am dard mikone" },
          { phonetic: "angosht", english: "Finger", example: "Panj angosht daaram" },
        ],
      },
      {
        category: {
          name: "Question Words",
          slug: "question-words",
          description: "Interrogative pronouns and question words",
          icon: "❓",
          difficultyLevel: 3,
        },
        words: [
          { phonetic: "chi", english: "What", example: "Chi mikhaay?" },
          { phonetic: "ki", english: "Who", example: "Ki aamad?" },
          { phonetic: "kojaa", english: "Where", example: "Kojaa miri?" },
          { phonetic: "key", english: "When", example: "Key miaayi?" },
          { phonetic: "cheraa", english: "Why", example: "Cheraa nayaamadi?" },
          { phonetic: "chetore", english: "How", example: "Chetore haal-et?" },
          { phonetic: "chand", english: "How much / How many", example: "Chand taa mikhaay?" },
          { phonetic: "kodaam", english: "Which", example: "Kodaam yeki?" },
        ],
      },
      {
        category: {
          name: "Adverbs & Conjunctions",
          slug: "adverbs-conjunctions",
          description: "Common adverbs and connecting words",
          icon: "🔗",
          difficultyLevel: 3,
        },
        words: [
          { phonetic: "va", english: "And", example: "Man va to" },
          { phonetic: "yaa", english: "Or", example: "Chaay yaa ghahve?" },
          { phonetic: "ammaa", english: "But", example: "Khoob ast ammaa geraan" },
          { phonetic: "chon", english: "Because", example: "Nayaamadam chon mariz boodam" },
          { phonetic: "hamishe", english: "Always", example: "Hamishe sobh bidaar misham" },
          { phonetic: "hichvaght", english: "Never", example: "Hichvaght dirr nemiyaam" },
          { phonetic: "gaaahi", english: "Sometimes", example: "Gaaahi film mibinam" },
          { phonetic: "alaan", english: "Now / Right now", example: "Alaan miaam" },
          { phonetic: "halaa", english: "Now", example: "Halaa chi kaar mikoni?" },
          { phonetic: "dobaare", english: "Again", example: "Dobaare begoo" },
          { phonetic: "ham", english: "Also / Too", example: "Man ham miaam" },
          { phonetic: "kheyli", english: "Very / A lot", example: "Kheyli khoob ast" },
          { phonetic: "kam", english: "A little / Few", example: "Kami aab mikhaaam" },
          { phonetic: "ziyaad", english: "A lot / Many", example: "Ziyaad nakhor" },
        ],
      },
    ];

    let totalWords = 0;
    let totalCategories = 0;
    let totalLessons = 0;
    let lessonNumber = 1;

    // Get highest existing lesson sortOrder to continue numbering
    const existingLessons = await db.select().from(lessons);
    const maxSortOrder = existingLessons.reduce((max, l) => Math.max(max, l.sortOrder), 0);
    let currentSortOrder = maxSortOrder;

    for (const data of categoriesData) {
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
            sortOrder: data.category.difficultyLevel * 100,
          })
          .returning();
        categoryId = newCategory.id;
        totalCategories++;
      }

      // Split words into chunks of MAX_WORDS_PER_LESSON
      const wordChunks: typeof data.words[] = [];
      for (let i = 0; i < data.words.length; i += MAX_WORDS_PER_LESSON) {
        wordChunks.push(data.words.slice(i, i + MAX_WORDS_PER_LESSON));
      }

      // Create lessons for each chunk
      for (let chunkIndex = 0; chunkIndex < wordChunks.length; chunkIndex++) {
        const chunk = wordChunks[chunkIndex];
        currentSortOrder++;

        // Generate lesson title
        let lessonTitle: string;
        if (wordChunks.length === 1) {
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

        // Insert words for this chunk
        for (const word of chunk) {
          // Check if word already exists
          const existingWord = await db
            .select()
            .from(vocabulary)
            .where(eq(vocabulary.phonetic, word.phonetic))
            .limit(1);

          if (existingWord.length === 0) {
            const [newWord] = await db
              .insert(vocabulary)
              .values({
                farsiWord: word.phonetic,
                phonetic: word.phonetic,
                englishTranslation: word.english,
                examplePhonetic: word.example,
                exampleEnglish: "",
                difficultyLevel: data.category.difficultyLevel,
                isActive: true,
              })
              .returning();

            // Link word to category
            await db.insert(vocabularyCategories).values({
              vocabularyId: newWord.id,
              categoryId: categoryId,
            });
            totalWords++;
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded expanded vocabulary`,
      stats: {
        categoriesCreated: totalCategories,
        lessonsCreated: totalLessons,
        wordsAdded: totalWords,
      },
    });
  } catch (error) {
    console.error("Error seeding expanded vocabulary:", error);
    return NextResponse.json(
      { error: "Failed to seed expanded vocabulary", details: String(error) },
      { status: 500 }
    );
  }
}
