import { NextResponse } from "next/server";
import { db } from "@/db";
import { vocabulary, wordCategories, vocabularyCategories, lessons } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/admin/seed-vocabulary-organized
 * Seed vocabulary with organized 4-level structure
 * Part 1/Part 2 lessons are spaced across levels for natural progression
 */
export async function POST() {
  try {
    // Define the 4-level lesson structure
    // Each lesson has: title, category info, words, level (1-4)
    const organizedLessons = [
      // ============ LEVEL 1: BEGINNER (Lessons 1-10) ============
      {
        level: 1,
        category: {
          name: "Introduction & Greetings",
          slug: "introduction-greetings",
          description: "Essential greetings and introduction phrases",
          icon: "👋",
        },
        title: "Greetings (Part 1)",
        words: [
          { phonetic: "salaam", english: "Hello/Peace", example: "salaam, chetori? - Hello, how are you?" },
          { phonetic: "khodaa haafez", english: "Goodbye", example: "khodaa haafez, ta fardaa - Goodbye, until tomorrow" },
          { phonetic: "sobh bekheyr", english: "Good morning", example: "sobh bekheyr! - Good morning!" },
          { phonetic: "shab bekheyr", english: "Good night", example: "shab bekheyr, khob bekhab - Good night, sleep well" },
          { phonetic: "mersi", english: "Thank you (informal)", example: "mersi, kheyli lotf daari - Thanks, you're very kind" },
          { phonetic: "mamnoon", english: "Thank you (formal)", example: "mamnoon az komaketuun - Thank you for your help" },
          { phonetic: "khahesh mikonam", english: "You're welcome / Please", example: "khahesh mikonam, ghabel nadaasht - You're welcome" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Essential Words",
          slug: "essential-words",
          description: "Most common everyday words",
          icon: "⭐",
        },
        title: "Essential Words",
        words: [
          { phonetic: "baleh", english: "Yes", example: "baleh, dorost-e - Yes, that's right" },
          { phonetic: "na", english: "No", example: "na, nemikham - No, I don't want" },
          { phonetic: "lotfan", english: "Please", example: "lotfan komak konid - Please help" },
          { phonetic: "bebakhshid", english: "Excuse me / Sorry", example: "bebakhshid, in kojast? - Excuse me, where is this?" },
          { phonetic: "khob", english: "Good/Well/OK", example: "khob, bashe - OK, fine" },
          { phonetic: "bad", english: "Bad", example: "havaa bad-e - The weather is bad" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Demonstratives",
          slug: "demonstratives",
          description: "This, that, these, those",
          icon: "👆",
        },
        title: "Demonstratives",
        words: [
          { phonetic: "in", english: "This", example: "in ketab-e - This is a book" },
          { phonetic: "aan", english: "That", example: "aan khaneh-e - That is a house" },
          { phonetic: "inhaa", english: "These", example: "inhaa sib hastand - These are apples" },
          { phonetic: "aanhaa", english: "Those", example: "aanhaa maashin hastand - Those are cars" },
          { phonetic: "injaa", english: "Here", example: "biyaa injaa - Come here" },
          { phonetic: "aanjaa", english: "There", example: "boro aanjaa - Go there" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Numbers Basic",
          slug: "numbers-basic",
          description: "Basic counting from 1 to 10",
          icon: "🔢",
        },
        title: "Numbers 1-5",
        words: [
          { phonetic: "yek", english: "One (1)", example: "yek nafar - One person" },
          { phonetic: "do", english: "Two (2)", example: "do taa sib - Two apples" },
          { phonetic: "se", english: "Three (3)", example: "se rooz - Three days" },
          { phonetic: "chahaar", english: "Four (4)", example: "chahaar nafar - Four people" },
          { phonetic: "panj", english: "Five (5)", example: "panj daghighe - Five minutes" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Household Items",
          slug: "household-items",
          description: "Common household objects",
          icon: "🏠",
        },
        title: "Household (Part 1)",
        words: [
          { phonetic: "khaneh", english: "House/Home", example: "khaneh-ye man - My house" },
          { phonetic: "dar", english: "Door", example: "dar-o baz kon - Open the door" },
          { phonetic: "panjareh", english: "Window", example: "panjareh baaz-e - The window is open" },
          { phonetic: "otaagh", english: "Room", example: "otaagh-e khab - Bedroom" },
          { phonetic: "miz", english: "Table", example: "ruye miz - On the table" },
          { phonetic: "sandali", english: "Chair", example: "beneshin ruye sandali - Sit on the chair" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Essential Verbs",
          slug: "essential-verbs",
          description: "The most common verbs",
          icon: "🎯",
        },
        title: "Basic Verbs (Part 1)",
        words: [
          { phonetic: "boodan", english: "To be", example: "man hastam - I am" },
          { phonetic: "daashtan", english: "To have", example: "man daaram - I have" },
          { phonetic: "raftan", english: "To go", example: "man miravam - I go" },
          { phonetic: "aamadan", english: "To come", example: "man miaam - I come" },
          { phonetic: "kardan", english: "To do/make", example: "man mikonam - I do" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Food & Drinks",
          slug: "food-drinks",
          description: "Common foods and beverages",
          icon: "🍽️",
        },
        title: "Food Basics (Part 1)",
        words: [
          { phonetic: "aab", english: "Water", example: "aab mikham - I want water" },
          { phonetic: "naan", english: "Bread", example: "naan-e tazeh - Fresh bread" },
          { phonetic: "berenj", english: "Rice", example: "berenj baa morgh - Rice with chicken" },
          { phonetic: "goosht", english: "Meat", example: "goosht-e gav - Beef" },
          { phonetic: "morgh", english: "Chicken", example: "morgh-e kababi - Grilled chicken" },
          { phonetic: "maahi", english: "Fish", example: "maahi-ye tazeh - Fresh fish" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Colors Basic",
          slug: "colors-basic",
          description: "Basic colors",
          icon: "🎨",
        },
        title: "Colors (Part 1)",
        words: [
          { phonetic: "sefid", english: "White", example: "lebas-e sefid - White clothes" },
          { phonetic: "siyaah", english: "Black", example: "maashin-e siyaah - Black car" },
          { phonetic: "ghermez", english: "Red", example: "sib-e ghermez - Red apple" },
          { phonetic: "aabi", english: "Blue", example: "aasman-e aabi - Blue sky" },
          { phonetic: "sabz", english: "Green", example: "chaay-e sabz - Green tea" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Family Basic",
          slug: "family-basic",
          description: "Immediate family members",
          icon: "👨‍👩‍👧",
        },
        title: "Family (Part 1)",
        words: [
          { phonetic: "pedar", english: "Father", example: "pedar-e man - My father" },
          { phonetic: "maadar", english: "Mother", example: "maadar-e man - My mother" },
          { phonetic: "baraadar", english: "Brother", example: "baraadar-e bozorg - Older brother" },
          { phonetic: "khaahar", english: "Sister", example: "khaahar-e koochak - Younger sister" },
          { phonetic: "khanevadeh", english: "Family", example: "khanevadeh-ye man - My family" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Question Words",
          slug: "question-words",
          description: "Basic question words",
          icon: "❓",
        },
        title: "Questions (Part 1)",
        words: [
          { phonetic: "che", english: "What", example: "che mikhai? - What do you want?" },
          { phonetic: "ki", english: "Who", example: "ki hasti? - Who are you?" },
          { phonetic: "kojaa", english: "Where", example: "kojaa miri? - Where are you going?" },
          { phonetic: "key", english: "When", example: "key miaai? - When are you coming?" },
          { phonetic: "cheraa", english: "Why", example: "cheraa narafti? - Why didn't you go?" },
        ],
      },

      // ============ LEVEL 2: ELEMENTARY (Lessons 11-20) ============
      {
        level: 2,
        category: {
          name: "Introduction & Greetings",
          slug: "introduction-greetings",
          description: "Essential greetings and introduction phrases",
          icon: "👋",
        },
        title: "Greetings (Part 2)",
        words: [
          { phonetic: "haalat chetore?", english: "How are you? (informal)", example: "salaam, haalat chetore? - Hi, how are you?" },
          { phonetic: "haal-e shomaa chetore?", english: "How are you? (formal)", example: "haal-e shomaa chetore? - How are you?" },
          { phonetic: "khoobam", english: "I'm good", example: "mersi, khoobam - Thanks, I'm good" },
          { phonetic: "bad nistam", english: "I'm not bad", example: "bad nistam, mersi - Not bad, thanks" },
          { phonetic: "khosh aamadid", english: "Welcome", example: "be khaneh khosh aamadid - Welcome home" },
          { phonetic: "khoda negahdaar", english: "May God protect you (goodbye)", example: "khoda negahdaar ta fardaa - Goodbye until tomorrow" },
          { phonetic: "ghorbanat beram", english: "I sacrifice myself for you (affectionate)", example: "ghorbanat beram azizam - My dear" },
        ],
      },
      {
        level: 2,
        category: {
          name: "Numbers Basic",
          slug: "numbers-basic",
          description: "Basic counting from 1 to 10",
          icon: "🔢",
        },
        title: "Numbers 6-10",
        words: [
          { phonetic: "shesh", english: "Six (6)", example: "shesh maah - Six months" },
          { phonetic: "haft", english: "Seven (7)", example: "haft rooz - Seven days" },
          { phonetic: "hasht", english: "Eight (8)", example: "hasht saat - Eight hours" },
          { phonetic: "noh", english: "Nine (9)", example: "noh nafar - Nine people" },
          { phonetic: "dah", english: "Ten (10)", example: "dah tomaan - Ten tomans" },
        ],
      },
      {
        level: 2,
        category: {
          name: "Food & Drinks",
          slug: "food-drinks",
          description: "Common foods and beverages",
          icon: "🍽️",
        },
        title: "Food (Part 2)",
        words: [
          { phonetic: "sabzi", english: "Vegetables/Herbs", example: "sabzi tazeh - Fresh vegetables" },
          { phonetic: "miveh", english: "Fruit", example: "miveh-ye shirin - Sweet fruit" },
          { phonetic: "sib", english: "Apple", example: "sib-e ghermez - Red apple" },
          { phonetic: "porteghal", english: "Orange", example: "aab-e porteghal - Orange juice" },
          { phonetic: "mooz", english: "Banana", example: "mooz-e rasideh - Ripe banana" },
          { phonetic: "angoor", english: "Grapes", example: "angoor-e shirin - Sweet grapes" },
        ],
      },
      {
        level: 2,
        category: {
          name: "Essential Verbs",
          slug: "essential-verbs",
          description: "The most common verbs",
          icon: "🎯",
        },
        title: "Basic Verbs (Part 2)",
        words: [
          { phonetic: "khordan", english: "To eat", example: "man mikhoram - I eat" },
          { phonetic: "nooshidan", english: "To drink", example: "chaay minoosham - I drink tea" },
          { phonetic: "didan", english: "To see", example: "man mibinam - I see" },
          { phonetic: "shenidan", english: "To hear", example: "man mishenavam - I hear" },
          { phonetic: "goftan", english: "To say/tell", example: "man miguyam - I say" },
          { phonetic: "dadan", english: "To give", example: "man midam - I give" },
        ],
      },
      {
        level: 2,
        category: {
          name: "Time & Days",
          slug: "time-days",
          description: "Days and time expressions",
          icon: "📅",
        },
        title: "Time (Part 1)",
        words: [
          { phonetic: "emrooz", english: "Today", example: "emrooz chand-e? - What day is today?" },
          { phonetic: "dirooz", english: "Yesterday", example: "dirooz raftam - I went yesterday" },
          { phonetic: "fardaa", english: "Tomorrow", example: "fardaa miaay? - Are you coming tomorrow?" },
          { phonetic: "haalaa", english: "Now", example: "haalaa boro - Go now" },
          { phonetic: "baad", english: "Later/After", example: "baadan miam - I'll come later" },
          { phonetic: "ghabl", english: "Before", example: "ghabl az in - Before this" },
        ],
      },
      {
        level: 2,
        category: {
          name: "Household Items",
          slug: "household-items",
          description: "Common household objects",
          icon: "🏠",
        },
        title: "Household (Part 2)",
        words: [
          { phonetic: "takht", english: "Bed", example: "takht-e do nafareh - Double bed" },
          { phonetic: "farsh", english: "Carpet/Rug", example: "farsh-e irani - Persian carpet" },
          { phonetic: "aaineh", english: "Mirror", example: "aaineh-ye bozorg - Large mirror" },
          { phonetic: "cheraagh", english: "Light/Lamp", example: "cheraagh-o roshan kon - Turn on the light" },
          { phonetic: "yakhchaal", english: "Refrigerator", example: "too yakhchaal-e - It's in the fridge" },
          { phonetic: "gaaz", english: "Stove/Gas", example: "gaaz-o roshan kon - Turn on the stove" },
        ],
      },
      {
        level: 2,
        category: {
          name: "Prepositions",
          slug: "prepositions",
          description: "Common prepositions",
          icon: "📍",
        },
        title: "Prepositions (Part 1)",
        words: [
          { phonetic: "dar", english: "In/At", example: "dar khaneh - At home" },
          { phonetic: "ruye", english: "On/On top of", example: "ruye miz - On the table" },
          { phonetic: "zir-e", english: "Under", example: "zir-e miz - Under the table" },
          { phonetic: "kenaar-e", english: "Next to/Beside", example: "kenaar-e man - Next to me" },
          { phonetic: "ba", english: "With", example: "ba man biyaa - Come with me" },
          { phonetic: "bi", english: "Without", example: "bi shekkar - Without sugar" },
        ],
      },
      {
        level: 2,
        category: {
          name: "Daily Activity Verbs",
          slug: "daily-verbs",
          description: "Verbs for everyday activities",
          icon: "☀️",
        },
        title: "Daily Verbs (Part 1)",
        words: [
          { phonetic: "khaabidan", english: "To sleep", example: "man mikhaabam - I sleep" },
          { phonetic: "bidaar shodan", english: "To wake up", example: "man bidaar misham - I wake up" },
          { phonetic: "khaandan", english: "To read", example: "man mikhaanam - I read" },
          { phonetic: "neveshtan", english: "To write", example: "man minevisam - I write" },
          { phonetic: "kaar kardan", english: "To work", example: "man kaar mikonam - I work" },
        ],
      },
      {
        level: 2,
        category: {
          name: "Colors Basic",
          slug: "colors-basic",
          description: "Basic colors",
          icon: "🎨",
        },
        title: "Colors (Part 2)",
        words: [
          { phonetic: "zard", english: "Yellow", example: "gol-e zard - Yellow flower" },
          { phonetic: "narenji", english: "Orange (color)", example: "rang-e narenji - Orange color" },
          { phonetic: "banafshe", english: "Purple", example: "gol-e banafshe - Violet flower" },
          { phonetic: "ghahvei", english: "Brown", example: "kafsh-e ghahvei - Brown shoes" },
          { phonetic: "soorati", english: "Pink", example: "gol-e soorati - Pink flower" },
          { phonetic: "toosi", english: "Gray", example: "aasmaan-e toosi - Gray sky" },
        ],
      },
      {
        level: 2,
        category: {
          name: "Family Basic",
          slug: "family-basic",
          description: "Immediate family members",
          icon: "👨‍👩‍👧",
        },
        title: "Family (Part 2)",
        words: [
          { phonetic: "pesar", english: "Son/Boy", example: "pesar-e man - My son" },
          { phonetic: "dokhtar", english: "Daughter/Girl", example: "dokhtar-e man - My daughter" },
          { phonetic: "shohar", english: "Husband", example: "shohar-e man - My husband" },
          { phonetic: "zan", english: "Wife/Woman", example: "zan-e man - My wife" },
          { phonetic: "bache", english: "Child", example: "bache-haa kojand? - Where are the children?" },
          { phonetic: "doost", english: "Friend", example: "doost-e man - My friend" },
        ],
      },

      // ============ LEVEL 3: PRE-INTERMEDIATE (Lessons 21-30) ============
      {
        level: 3,
        category: {
          name: "Food & Drinks",
          slug: "food-drinks",
          description: "Common foods and beverages",
          icon: "🍽️",
        },
        title: "Food (Part 3)",
        words: [
          { phonetic: "chaay", english: "Tea", example: "chaay-e daaghmikhay? - Do you want hot tea?" },
          { phonetic: "ghahveh", english: "Coffee", example: "ghahveh-ye talkh - Bitter coffee" },
          { phonetic: "shir", english: "Milk", example: "shir-e sard - Cold milk" },
          { phonetic: "aab miveh", english: "Juice", example: "aab miveh mikhai? - Do you want juice?" },
          { phonetic: "nooshidani", english: "Beverage/Drink", example: "nooshidani chemikhay? - What drink do you want?" },
          { phonetic: "ghand", english: "Sugar cube", example: "ghand mikhay? - Do you want sugar?" },
          { phonetic: "shekar", english: "Sugar", example: "bi shekar lotfan - Without sugar please" },
        ],
      },
      {
        level: 3,
        category: {
          name: "Jobs & Professions",
          slug: "jobs-professions",
          description: "Common jobs and professions",
          icon: "💼",
        },
        title: "Jobs (Part 1)",
        words: [
          { phonetic: "doktor", english: "Doctor", example: "doktor hastam - I am a doctor" },
          { phonetic: "moalem", english: "Teacher", example: "moalem-e khobi-e - He/She is a good teacher" },
          { phonetic: "mohandis", english: "Engineer", example: "mohandis-e naramafzaar - Software engineer" },
          { phonetic: "vakil", english: "Lawyer", example: "vakil-e man - My lawyer" },
          { phonetic: "raanandeh", english: "Driver", example: "raanandeh-ye taaksi - Taxi driver" },
          { phonetic: "forooshandeh", english: "Seller/Salesperson", example: "forooshandeh-ye maghazeh - Store seller" },
        ],
      },
      {
        level: 3,
        category: {
          name: "Time & Days",
          slug: "time-days",
          description: "Days and time expressions",
          icon: "📅",
        },
        title: "Days of the Week",
        words: [
          { phonetic: "shanbeh", english: "Saturday", example: "shanbeh kaar mikonam - I work on Saturday" },
          { phonetic: "yekshanbeh", english: "Sunday", example: "yekshanbeh tatil-e - Sunday is a holiday" },
          { phonetic: "doshanbeh", english: "Monday", example: "doshanbeh miam - I'll come Monday" },
          { phonetic: "seshanbeh", english: "Tuesday", example: "seshanbeh jalaseh daarim - We have a meeting Tuesday" },
          { phonetic: "chaharshanbeh", english: "Wednesday", example: "chaharshanbeh azad-am - I'm free Wednesday" },
          { phonetic: "panjshanbeh", english: "Thursday", example: "panjshanbeh miram - I'm going Thursday" },
          { phonetic: "jomeh", english: "Friday", example: "jomeh tatil-e - Friday is holiday" },
        ],
      },
      {
        level: 3,
        category: {
          name: "Action Verbs",
          slug: "action-verbs",
          description: "Physical actions and movements",
          icon: "🏃",
        },
        title: "Action Verbs",
        words: [
          { phonetic: "zadan", english: "To hit/play/put", example: "man mizanam - I hit" },
          { phonetic: "bordan", english: "To take/win", example: "man mibaram - I take" },
          { phonetic: "avardan", english: "To bring", example: "man miavaram - I bring" },
          { phonetic: "bastan", english: "To close", example: "man mibandam - I close" },
          { phonetic: "baaz kardan", english: "To open", example: "man baaz mikonam - I open" },
          { phonetic: "davidan", english: "To run", example: "man midavam - I run" },
        ],
      },
      {
        level: 3,
        category: {
          name: "Animals",
          slug: "animals",
          description: "Common animals",
          icon: "🐾",
        },
        title: "Animals (Part 1)",
        words: [
          { phonetic: "sag", english: "Dog", example: "sag daaram - I have a dog" },
          { phonetic: "gorbeh", english: "Cat", example: "gorbeh-ye sefid - White cat" },
          { phonetic: "morgh", english: "Chicken/Hen", example: "morgh tokhm mizaareh - The hen lays eggs" },
          { phonetic: "gav", english: "Cow", example: "gav shir mideh - Cow gives milk" },
          { phonetic: "goosefand", english: "Sheep", example: "goosefand-e sefid - White sheep" },
          { phonetic: "asb", english: "Horse", example: "asb savari - Horse riding" },
        ],
      },
      {
        level: 3,
        category: {
          name: "Prepositions",
          slug: "prepositions",
          description: "Common prepositions",
          icon: "📍",
        },
        title: "Prepositions (Part 2)",
        words: [
          { phonetic: "baraye", english: "For", example: "baraye to - For you" },
          { phonetic: "az", english: "From", example: "az kojaa? - From where?" },
          { phonetic: "be", english: "To", example: "be khaneh - To home" },
          { phonetic: "taa", english: "Until", example: "taa fardaa - Until tomorrow" },
          { phonetic: "barabar-e", english: "In front of", example: "barabar-e khaneh - In front of the house" },
          { phonetic: "posht-e", english: "Behind", example: "posht-e dar - Behind the door" },
        ],
      },
      {
        level: 3,
        category: {
          name: "Kardan Verbs",
          slug: "kardan-verbs",
          description: "Common verbs formed with kardan",
          icon: "🔧",
        },
        title: "Kardan Verbs (Part 1)",
        words: [
          { phonetic: "fekr kardan", english: "To think", example: "man fekr mikonam - I think" },
          { phonetic: "safar kardan", english: "To travel", example: "man safar mikonam - I travel" },
          { phonetic: "varzesh kardan", english: "To exercise", example: "man varzesh mikonam - I exercise" },
          { phonetic: "aashpazi kardan", english: "To cook", example: "man aashpazi mikonam - I cook" },
          { phonetic: "goosh kardan", english: "To listen", example: "man goosh mikonam - I listen" },
          { phonetic: "komak kardan", english: "To help", example: "man komak mikonam - I help" },
        ],
      },
      {
        level: 3,
        category: {
          name: "Weather",
          slug: "weather",
          description: "Weather and seasons",
          icon: "🌤️",
        },
        title: "Weather & Seasons",
        words: [
          { phonetic: "havaa", english: "Weather/Air", example: "havaa chetore? - How's the weather?" },
          { phonetic: "garm", english: "Hot/Warm", example: "havaa garm-e - It's hot" },
          { phonetic: "sard", english: "Cold", example: "havaa sard-e - It's cold" },
          { phonetic: "aftaabi", english: "Sunny", example: "emrooz aftaabi-e - Today is sunny" },
          { phonetic: "baarooni", english: "Rainy", example: "havaa baarooni-e - It's rainy" },
          { phonetic: "barf", english: "Snow", example: "barf miad - It's snowing" },
        ],
      },
      {
        level: 3,
        category: {
          name: "Question Words",
          slug: "question-words",
          description: "Question words",
          icon: "❓",
        },
        title: "Questions (Part 2)",
        words: [
          { phonetic: "chetoor", english: "How", example: "chetoor hasti? - How are you?" },
          { phonetic: "chand", english: "How many/How much", example: "chand taa? - How many?" },
          { phonetic: "chand vaght", english: "How long", example: "chand vaght? - How long?" },
          { phonetic: "kodoom", english: "Which", example: "kodoom yeki? - Which one?" },
          { phonetic: "aayaa", english: "Is it?/Do you? (question marker)", example: "aayaa miaay? - Are you coming?" },
        ],
      },
      {
        level: 3,
        category: {
          name: "Body Parts",
          slug: "body-parts",
          description: "Parts of the body",
          icon: "🫀",
        },
        title: "Body Parts (Part 1)",
        words: [
          { phonetic: "sar", english: "Head", example: "saram dard mikoneh - My head hurts" },
          { phonetic: "cheshm", english: "Eye", example: "cheshm-e aabi - Blue eyes" },
          { phonetic: "goosh", english: "Ear", example: "goosh-e man - My ear" },
          { phonetic: "bini", english: "Nose", example: "bini-ye bozorg - Big nose" },
          { phonetic: "dahaan", english: "Mouth", example: "dahanat-o baz kon - Open your mouth" },
          { phonetic: "dast", english: "Hand/Arm", example: "dast-e man - My hand" },
        ],
      },

      // ============ LEVEL 4: INTERMEDIATE (Lessons 31-40) ============
      {
        level: 4,
        category: {
          name: "Jobs & Professions",
          slug: "jobs-professions",
          description: "Common jobs and professions",
          icon: "💼",
        },
        title: "Jobs (Part 2)",
        words: [
          { phonetic: "paraastar", english: "Nurse", example: "paraastar-e bimarestan - Hospital nurse" },
          { phonetic: "aashpaz", english: "Cook/Chef", example: "aashpaz-e restooraan - Restaurant chef" },
          { phonetic: "kaargar", english: "Worker", example: "kaargar-e sakhtemani - Construction worker" },
          { phonetic: "kaarmanad", english: "Employee/Office worker", example: "kaarmanad-e dolat - Government employee" },
          { phonetic: "honarmand", english: "Artist", example: "honarmand-e mashoor - Famous artist" },
          { phonetic: "varzeshkaar", english: "Athlete", example: "varzeshkaar-e herfeii - Professional athlete" },
        ],
      },
      {
        level: 4,
        category: {
          name: "Animals",
          slug: "animals",
          description: "Common animals",
          icon: "🐾",
        },
        title: "Animals (Part 2)",
        words: [
          { phonetic: "parandeh", english: "Bird", example: "parandeh parvaz mikoneh - The bird flies" },
          { phonetic: "fil", english: "Elephant", example: "fil bozorg-e - The elephant is big" },
          { phonetic: "shir", english: "Lion", example: "shir-e vahshi - Wild lion" },
          { phonetic: "khers", english: "Bear", example: "khers-e ghahvei - Brown bear" },
          { phonetic: "maar", english: "Snake", example: "maar-e sami - Poisonous snake" },
          { phonetic: "maahi", english: "Fish", example: "maahi too aab-e - The fish is in water" },
        ],
      },
      {
        level: 4,
        category: {
          name: "Countries & Travel",
          slug: "countries-travel",
          description: "Countries and travel vocabulary",
          icon: "✈️",
        },
        title: "Countries & Travel (Part 1)",
        words: [
          { phonetic: "iraan", english: "Iran", example: "man az iraan hastam - I am from Iran" },
          { phonetic: "keshvar", english: "Country", example: "keshvar-e zibaa - Beautiful country" },
          { phonetic: "shahr", english: "City", example: "shahr-e bozorg - Big city" },
          { phonetic: "safar", english: "Trip/Travel", example: "safar-e khoob - Good trip" },
          { phonetic: "forodgah", english: "Airport", example: "be forodgah miram - I'm going to the airport" },
          { phonetic: "hotel", english: "Hotel", example: "hotel kojast? - Where is the hotel?" },
        ],
      },
      {
        level: 4,
        category: {
          name: "Countries & Travel",
          slug: "countries-travel",
          description: "Countries and travel vocabulary",
          icon: "✈️",
        },
        title: "Countries & Travel (Part 2)",
        words: [
          { phonetic: "pasport", english: "Passport", example: "pasport-et kojast? - Where is your passport?" },
          { phonetic: "viizaa", english: "Visa", example: "viizaa daari? - Do you have a visa?" },
          { phonetic: "bilet", english: "Ticket", example: "bilet-e havapeymaa - Airplane ticket" },
          { phonetic: "chamedaan", english: "Suitcase", example: "chamedaan-am sangin-e - My suitcase is heavy" },
          { phonetic: "gardeshgar", english: "Tourist", example: "gardeshgar-e khareji - Foreign tourist" },
        ],
      },
      {
        level: 4,
        category: {
          name: "Body Parts",
          slug: "body-parts",
          description: "Parts of the body",
          icon: "🫀",
        },
        title: "Body Parts (Part 2)",
        words: [
          { phonetic: "paa", english: "Foot/Leg", example: "paam dard mikoneh - My leg hurts" },
          { phonetic: "angosht", english: "Finger/Toe", example: "angosht-e man - My finger" },
          { phonetic: "del", english: "Heart/Stomach", example: "delam dard mikoneh - My stomach hurts" },
          { phonetic: "kamar", english: "Waist/Back", example: "kamaram dard mikoneh - My back hurts" },
          { phonetic: "moo", english: "Hair", example: "moo-ye siyaah - Black hair" },
          { phonetic: "dandaan", english: "Tooth", example: "dandaanam dard mikoneh - My tooth hurts" },
        ],
      },
      {
        level: 4,
        category: {
          name: "Kardan Verbs",
          slug: "kardan-verbs",
          description: "Common verbs formed with kardan",
          icon: "🔧",
        },
        title: "Kardan Verbs (Part 2)",
        words: [
          { phonetic: "baazi kardan", english: "To play (game)", example: "man baazi mikonam - I play" },
          { phonetic: "sohbat kardan", english: "To speak/talk", example: "man sohbat mikonam - I talk" },
          { phonetic: "estefaade kardan", english: "To use", example: "man estefaade mikonam - I use" },
          { phonetic: "dorost kardan", english: "To make/fix", example: "man dorost mikonam - I make" },
          { phonetic: "tamoom kardan", english: "To finish", example: "man tamoom mikonam - I finish" },
          { phonetic: "shoroo kardan", english: "To start", example: "man shoroo mikonam - I start" },
        ],
      },
      {
        level: 4,
        category: {
          name: "Shodan Verbs",
          slug: "shodan-verbs",
          description: "Common verbs formed with shodan",
          icon: "🔄",
        },
        title: "Shodan Verbs",
        words: [
          { phonetic: "amaade shodan", english: "To get ready", example: "man amaade misham - I get ready" },
          { phonetic: "asabaani shodan", english: "To get angry", example: "man asabaani misham - I get angry" },
          { phonetic: "khaste shodan", english: "To get tired", example: "man khaste shodam - I got tired" },
          { phonetic: "gom shodan", english: "To get lost", example: "man gom shodam - I got lost" },
          { phonetic: "aashenaashodan", english: "To get acquainted", example: "aashenaa shodim - We got acquainted" },
          { phonetic: "shoro shodan", english: "To start (intransitive)", example: "film shoro shod - The movie started" },
        ],
      },
      {
        level: 4,
        category: {
          name: "Daashtan Verbs",
          slug: "daashtan-verbs",
          description: "Common verbs formed with daashtan",
          icon: "📦",
        },
        title: "Daashtan Verbs",
        words: [
          { phonetic: "doost daashtan", english: "To like/love", example: "man doost daaram - I like" },
          { phonetic: "niaz daashtan", english: "To need", example: "man niaz daaram - I need" },
          { phonetic: "vaght daashtan", english: "To have time", example: "man vaght daaram - I have time" },
          { phonetic: "ajale daashtan", english: "To be in a hurry", example: "man ajale daaram - I'm in a hurry" },
          { phonetic: "alaaghe daashtan", english: "To be interested", example: "man alaaghe daaram - I am interested" },
        ],
      },
      {
        level: 4,
        category: {
          name: "Adverbs & Conjunctions",
          slug: "adverbs-conjunctions",
          description: "Common adverbs and conjunctions",
          icon: "🔗",
        },
        title: "Adverbs & Conjunctions (Part 1)",
        words: [
          { phonetic: "kheyli", english: "Very/A lot", example: "kheyli khob - Very good" },
          { phonetic: "kam", english: "Little/Few", example: "kam-e - It's little" },
          { phonetic: "ziyaad", english: "Much/Many", example: "ziyaad-e - It's a lot" },
          { phonetic: "hamishe", english: "Always", example: "hamishe miam - I always come" },
          { phonetic: "hichvaght", english: "Never", example: "hichvaght naraftam - I never went" },
          { phonetic: "gahi", english: "Sometimes", example: "gahi miam - I sometimes come" },
        ],
      },
      {
        level: 4,
        category: {
          name: "Adverbs & Conjunctions",
          slug: "adverbs-conjunctions",
          description: "Common adverbs and conjunctions",
          icon: "🔗",
        },
        title: "Adverbs & Conjunctions (Part 2)",
        words: [
          { phonetic: "va", english: "And", example: "man va to - Me and you" },
          { phonetic: "yaa", english: "Or", example: "chaay yaa ghahveh? - Tea or coffee?" },
          { phonetic: "amma", english: "But", example: "mikham, amma nemitonam - I want to, but I can't" },
          { phonetic: "chon", english: "Because", example: "chon khaste-am - Because I'm tired" },
          { phonetic: "agar", english: "If", example: "agar biaay - If you come" },
          { phonetic: "vaghti", english: "When", example: "vaghti oomadi - When you came" },
        ],
      },
    ];

    let totalWords = 0;
    let totalCategories = 0;
    let totalLessons = 0;
    let lessonNumber = 0;

    for (const lessonData of organizedLessons) {
      lessonNumber++;

      // Check if category exists
      let existingCategory = await db
        .select()
        .from(wordCategories)
        .where(eq(wordCategories.slug, lessonData.category.slug))
        .limit(1);

      if (existingCategory.length === 0) {
        existingCategory = await db
          .select()
          .from(wordCategories)
          .where(eq(wordCategories.name, lessonData.category.name))
          .limit(1);
      }

      let categoryId: string;

      if (existingCategory.length > 0) {
        categoryId = existingCategory[0].id;
      } else {
        const [newCategory] = await db
          .insert(wordCategories)
          .values({
            ...lessonData.category,
            difficultyLevel: lessonData.level,
            sortOrder: lessonData.level * 100,
          })
          .returning();
        categoryId = newCategory.id;
        totalCategories++;
      }

      // Create the lesson title
      const lessonTitle = `Lesson ${lessonNumber}: ${lessonData.title}`;

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
            description: lessonData.category.description,
            difficultyLevel: lessonData.level,
            sortOrder: lessonNumber,
          })
          .returning();
        lessonId = newLesson.id;
        totalLessons++;
      }

      // Insert words
      for (const word of lessonData.words) {
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
              difficultyLevel: lessonData.level,
              isActive: true,
            })
            .returning();

          await db.insert(vocabularyCategories).values({
            vocabularyId: newWord.id,
            categoryId: categoryId,
          });
          totalWords++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded organized vocabulary`,
      stats: {
        categoriesCreated: totalCategories,
        lessonsCreated: totalLessons,
        wordsAdded: totalWords,
        totalLessons: lessonNumber,
      },
    });
  } catch (error) {
    console.error("Error seeding organized vocabulary:", error);
    return NextResponse.json(
      { error: "Failed to seed organized vocabulary", details: String(error) },
      { status: 500 }
    );
  }
}
