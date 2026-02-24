import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { vocabulary, wordCategories, vocabularyCategories, lessons } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/admin/seed-vocabulary-organized
 * Seed vocabulary with organized 4-level structure
 * Part 1/Part 2 lessons are spaced across levels for natural progression
 * Each word includes: phonetic, farsi script, english, example with translations
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Define the 4-level lesson structure
    // Each word has: phonetic, farsi (Arabic script), english, example, exampleFarsi, exampleEnglish
    const organizedLessons = [
      // ============ LEVEL 1: BEGINNER (Lessons 1-10) ============
      // Ultra-simple words for absolute beginners - max 5 words per lesson
      {
        level: 1,
        category: {
          name: "First Words",
          slug: "first-words",
          description: "Your very first Farsi words",
          icon: "🌟",
        },
        title: "First Words",
        words: [
          { phonetic: "salaam", farsi: "سلام", english: "Hello", example: "salaam!", exampleFarsi: "سلام!", exampleEnglish: "Hello!" },
          { phonetic: "mersi", farsi: "مرسی", english: "Thanks", example: "mersi!", exampleFarsi: "مرسی!", exampleEnglish: "Thanks!" },
          { phonetic: "baleh", farsi: "بله", english: "Yes", example: "baleh!", exampleFarsi: "بله!", exampleEnglish: "Yes!" },
          { phonetic: "na", farsi: "نه", english: "No", example: "na!", exampleFarsi: "نه!", exampleEnglish: "No!" },
          { phonetic: "khob", farsi: "خوب", english: "Good/OK", example: "khob!", exampleFarsi: "خوب!", exampleEnglish: "Good!/OK!" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Simple Adjectives",
          slug: "simple-adjectives",
          description: "Basic describing words",
          icon: "✨",
        },
        title: "Simple Words",
        words: [
          { phonetic: "bad", farsi: "بد", english: "Bad", example: "bad nist", exampleFarsi: "بد نیست", exampleEnglish: "Not bad" },
          { phonetic: "bozorg", farsi: "بزرگ", english: "Big", example: "bozorg-e", exampleFarsi: "بزرگه", exampleEnglish: "It's big" },
          { phonetic: "koochak", farsi: "کوچک", english: "Small", example: "koochak-e", exampleFarsi: "کوچکه", exampleEnglish: "It's small" },
          { phonetic: "zibaa", farsi: "زیبا", english: "Beautiful", example: "zibaa-st", exampleFarsi: "زیباست", exampleEnglish: "It's beautiful" },
          { phonetic: "tazeh", farsi: "تازه", english: "Fresh/New", example: "tazeh-e", exampleFarsi: "تازه‌ست", exampleEnglish: "It's fresh" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Numbers Basic",
          slug: "numbers-basic",
          description: "Counting 1-5",
          icon: "🔢",
        },
        title: "Numbers 1-5",
        words: [
          { phonetic: "yek", farsi: "یک", english: "One / 1", example: "yek!", exampleFarsi: "یک!", exampleEnglish: "One!" },
          { phonetic: "do", farsi: "دو", english: "Two / 2", example: "do taa", exampleFarsi: "دو تا", exampleEnglish: "Two (of them)" },
          { phonetic: "se", farsi: "سه", english: "Three / 3", example: "se taa", exampleFarsi: "سه تا", exampleEnglish: "Three (of them)" },
          { phonetic: "chahaar", farsi: "چهار", english: "Four / 4", example: "chahaar taa", exampleFarsi: "چهار تا", exampleEnglish: "Four (of them)" },
          { phonetic: "panj", farsi: "پنج", english: "Five / 5", example: "panj taa", exampleFarsi: "پنج تا", exampleEnglish: "Five (of them)" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Simple Nouns",
          slug: "simple-nouns",
          description: "Everyday objects",
          icon: "📦",
        },
        title: "Simple Things",
        words: [
          { phonetic: "aab", farsi: "آب", english: "Water", example: "aab mikham", exampleFarsi: "آب می‌خوام", exampleEnglish: "I want water" },
          { phonetic: "naan", farsi: "نان", english: "Bread", example: "naan daari?", exampleFarsi: "نان داری؟", exampleEnglish: "Do you have bread?" },
          { phonetic: "khaneh", farsi: "خانه", english: "House", example: "khaneh-e man", exampleFarsi: "خانه‌ی من", exampleEnglish: "My house" },
          { phonetic: "ketab", farsi: "کتاب", english: "Book", example: "in ketab-e", exampleFarsi: "این کتابه", exampleEnglish: "This is a book" },
          { phonetic: "maashin", farsi: "ماشین", english: "Car", example: "maashin daari?", exampleFarsi: "ماشین داری؟", exampleEnglish: "Do you have a car?" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Family Basic",
          slug: "family-basic",
          description: "Core family words",
          icon: "👨‍👩‍👧",
        },
        title: "Family (Part 1)",
        words: [
          { phonetic: "man", farsi: "من", english: "I/Me", example: "man hastam", exampleFarsi: "من هستم", exampleEnglish: "I am" },
          { phonetic: "to", farsi: "تو", english: "You", example: "to hasti", exampleFarsi: "تو هستی", exampleEnglish: "You are" },
          { phonetic: "pedar", farsi: "پدر", english: "Father", example: "pedar-e man", exampleFarsi: "پدر من", exampleEnglish: "My father" },
          { phonetic: "maadar", farsi: "مادر", english: "Mother", example: "maadar-e man", exampleFarsi: "مادر من", exampleEnglish: "My mother" },
          { phonetic: "doost", farsi: "دوست", english: "Friend", example: "doost-e man", exampleFarsi: "دوست من", exampleEnglish: "My friend" },
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
          { phonetic: "sefid", farsi: "سفید", english: "White", example: "sefid-e", exampleFarsi: "سفیده", exampleEnglish: "It's white" },
          { phonetic: "siyaah", farsi: "سیاه", english: "Black", example: "siyaah-e", exampleFarsi: "سیاهه", exampleEnglish: "It's black" },
          { phonetic: "ghermez", farsi: "قرمز", english: "Red", example: "ghermez-e", exampleFarsi: "قرمزه", exampleEnglish: "It's red" },
          { phonetic: "aabi", farsi: "آبی", english: "Blue", example: "aabi-e", exampleFarsi: "آبیه", exampleEnglish: "It's blue" },
          { phonetic: "sabz", farsi: "سبز", english: "Green", example: "sabz-e", exampleFarsi: "سبزه", exampleEnglish: "It's green" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Demonstratives",
          slug: "demonstratives",
          description: "This and that",
          icon: "👆",
        },
        title: "This & That",
        words: [
          { phonetic: "in", farsi: "این", english: "This", example: "in chi-e?", exampleFarsi: "این چیه؟", exampleEnglish: "What is this?" },
          { phonetic: "aan", farsi: "آن", english: "That", example: "aan chi-e?", exampleFarsi: "آن چیه؟", exampleEnglish: "What is that?" },
          { phonetic: "injaa", farsi: "اینجا", english: "Here", example: "injaa-st", exampleFarsi: "اینجاست", exampleEnglish: "It's here" },
          { phonetic: "aanjaa", farsi: "آنجا", english: "There", example: "aanjaa-st", exampleFarsi: "آنجاست", exampleEnglish: "It's there" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Food Basics",
          slug: "food-basics",
          description: "Simple food words",
          icon: "🍽️",
        },
        title: "Food (Part 1)",
        words: [
          { phonetic: "chaay", farsi: "چای", english: "Tea", example: "chaay mikhai?", exampleFarsi: "چای می‌خوای؟", exampleEnglish: "Do you want tea?" },
          { phonetic: "sib", farsi: "سیب", english: "Apple", example: "sib daari?", exampleFarsi: "سیب داری؟", exampleEnglish: "Do you have an apple?" },
          { phonetic: "shir", farsi: "شیر", english: "Milk", example: "shir mikham", exampleFarsi: "شیر می‌خوام", exampleEnglish: "I want milk" },
          { phonetic: "berenj", farsi: "برنج", english: "Rice", example: "berenj daari?", exampleFarsi: "برنج داری؟", exampleEnglish: "Do you have rice?" },
          { phonetic: "morgh", farsi: "مرغ", english: "Chicken", example: "morgh mikham", exampleFarsi: "مرغ می‌خوام", exampleEnglish: "I want chicken" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Question Words",
          slug: "question-words",
          description: "Simple question words",
          icon: "❓",
        },
        title: "Questions (Part 1)",
        words: [
          { phonetic: "chi", farsi: "چی", english: "What", example: "chi mikhai?", exampleFarsi: "چی می‌خوای؟", exampleEnglish: "What do you want?" },
          { phonetic: "ki", farsi: "کی", english: "Who", example: "ki-e?", exampleFarsi: "کیه؟", exampleEnglish: "Who is it?" },
          { phonetic: "kojaa", farsi: "کجا", english: "Where", example: "kojaa-st?", exampleFarsi: "کجاست؟", exampleEnglish: "Where is it?" },
          { phonetic: "cheraa", farsi: "چرا", english: "Why", example: "cheraa?", exampleFarsi: "چرا؟", exampleEnglish: "Why?" },
        ],
      },
      {
        level: 1,
        category: {
          name: "Basic Actions",
          slug: "basic-actions",
          description: "Simple action words",
          icon: "🎯",
        },
        title: "Basic Actions",
        words: [
          { phonetic: "biyaa", farsi: "بیا", english: "Come!", example: "biyaa injaa", exampleFarsi: "بیا اینجا", exampleEnglish: "Come here" },
          { phonetic: "boro", farsi: "برو", english: "Go!", example: "boro!", exampleFarsi: "برو!", exampleEnglish: "Go!" },
          { phonetic: "bekhab", farsi: "بخواب", english: "Sleep!", example: "bekhab!", exampleFarsi: "بخواب!", exampleEnglish: "Sleep!" },
          { phonetic: "bokhor", farsi: "بخور", english: "Eat!", example: "bokhor!", exampleFarsi: "بخور!", exampleEnglish: "Eat!" },
          { phonetic: "benosh", farsi: "بنوش", english: "Drink!", example: "benosh!", exampleFarsi: "بنوش!", exampleEnglish: "Drink!" },
        ],
      },

      // ============ LEVEL 2: ELEMENTARY (Lessons 11-20) ============
      {
        level: 2,
        category: {
          name: "Greetings",
          slug: "greetings",
          description: "Common greetings and farewells",
          icon: "👋",
        },
        title: "Greetings (Part 1)",
        words: [
          { phonetic: "khodaa haafez", farsi: "خداحافظ", english: "Goodbye", example: "khodaa haafez!", exampleFarsi: "خداحافظ!", exampleEnglish: "Goodbye!" },
          { phonetic: "sobh bekheyr", farsi: "صبح بخیر", english: "Good morning", example: "sobh bekheyr!", exampleFarsi: "صبح بخیر!", exampleEnglish: "Good morning!" },
          { phonetic: "shab bekheyr", farsi: "شب بخیر", english: "Good night", example: "shab bekheyr!", exampleFarsi: "شب بخیر!", exampleEnglish: "Good night!" },
          { phonetic: "lotfan", farsi: "لطفاً", english: "Please", example: "lotfan!", exampleFarsi: "لطفاً!", exampleEnglish: "Please!" },
          { phonetic: "bebakhshid", farsi: "ببخشید", english: "Excuse me/Sorry", example: "bebakhshid!", exampleFarsi: "ببخشید!", exampleEnglish: "Excuse me!" },
        ],
      },
      {
        level: 2,
        category: {
          name: "Greetings",
          slug: "greetings",
          description: "Common greetings and farewells",
          icon: "👋",
        },
        title: "Greetings (Part 2)",
        words: [
          { phonetic: "haalat chetore?", farsi: "حالت چطوره؟", english: "How are you?", example: "salaam, haalat chetore?", exampleFarsi: "سلام، حالت چطوره؟", exampleEnglish: "Hi, how are you?" },
          { phonetic: "khoobam", farsi: "خوبم", english: "I'm good", example: "mersi, khoobam", exampleFarsi: "مرسی، خوبم", exampleEnglish: "Thanks, I'm good" },
          { phonetic: "mamnoon", farsi: "ممنون", english: "Thank you", example: "mamnoon!", exampleFarsi: "ممنون!", exampleEnglish: "Thank you!", isFormal: true },
          { phonetic: "khahesh mikonam", farsi: "خواهش می‌کنم", english: "You're welcome", example: "khahesh mikonam!", exampleFarsi: "خواهش می‌کنم!", exampleEnglish: "You're welcome!" },
          { phonetic: "khosh aamadid", farsi: "خوش آمدید", english: "Welcome", example: "khosh aamadid!", exampleFarsi: "خوش آمدید!", exampleEnglish: "Welcome!" },
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
          { phonetic: "shesh", farsi: "شش", english: "Six / 6", example: "shesh maah", exampleFarsi: "شش ماه", exampleEnglish: "Six months" },
          { phonetic: "haft", farsi: "هفت", english: "Seven / 7", example: "haft rooz", exampleFarsi: "هفت روز", exampleEnglish: "Seven days" },
          { phonetic: "hasht", farsi: "هشت", english: "Eight / 8", example: "hasht saat", exampleFarsi: "هشت ساعت", exampleEnglish: "Eight hours" },
          { phonetic: "noh", farsi: "نُه", english: "Nine / 9", example: "noh nafar", exampleFarsi: "نُه نفر", exampleEnglish: "Nine people" },
          { phonetic: "dah", farsi: "ده", english: "Ten / 10", example: "dah tomaan", exampleFarsi: "ده تومان", exampleEnglish: "Ten tomans" },
        ],
      },
      {
        level: 2,
        category: {
          name: "Essential Verbs",
          slug: "essential-verbs",
          description: "Core verbs you need",
          icon: "🎯",
        },
        title: "Core Verbs (Part 1)",
        words: [
          { phonetic: "boodan", farsi: "بودن", english: "To be", example: "man hastam", exampleFarsi: "من هستم", exampleEnglish: "I am" },
          { phonetic: "daashtan", farsi: "داشتن", english: "To have", example: "man daaram", exampleFarsi: "من دارم", exampleEnglish: "I have" },
          { phonetic: "raftan", farsi: "رفتن", english: "To go", example: "man miram", exampleFarsi: "من می‌رم", exampleEnglish: "I go" },
          { phonetic: "aamadan", farsi: "آمدن", english: "To come", example: "man miaam", exampleFarsi: "من می‌آم", exampleEnglish: "I come" },
          { phonetic: "kardan", farsi: "کردن", english: "To do/make", example: "man mikonam", exampleFarsi: "من می‌کنم", exampleEnglish: "I do" },
        ],
      },
      {
        level: 2,
        category: {
          name: "Essential Verbs",
          slug: "essential-verbs",
          description: "Core verbs you need",
          icon: "🎯",
        },
        title: "Core Verbs (Part 2)",
        words: [
          { phonetic: "khordan", farsi: "خوردن", english: "To eat", example: "man mikhoram", exampleFarsi: "من می‌خورم", exampleEnglish: "I eat" },
          { phonetic: "nooshidan", farsi: "نوشیدن", english: "To drink", example: "chaay minoosham", exampleFarsi: "چای می‌نوشم", exampleEnglish: "I drink tea" },
          { phonetic: "didan", farsi: "دیدن", english: "To see", example: "man mibinam", exampleFarsi: "من می‌بینم", exampleEnglish: "I see" },
          { phonetic: "goftan", farsi: "گفتن", english: "To say/tell", example: "man migam", exampleFarsi: "من می‌گم", exampleEnglish: "I say" },
          { phonetic: "dadan", farsi: "دادن", english: "To give", example: "man midam", exampleFarsi: "من می‌دم", exampleEnglish: "I give" },
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
        title: "Fruits",
        words: [
          { phonetic: "miveh", farsi: "میوه", english: "Fruit", example: "miveh mikhai?", exampleFarsi: "میوه می‌خوای؟", exampleEnglish: "Do you want fruit?" },
          { phonetic: "porteghal", farsi: "پرتقال", english: "Orange", example: "porteghal daari?", exampleFarsi: "پرتقال داری؟", exampleEnglish: "Do you have an orange?" },
          { phonetic: "mooz", farsi: "موز", english: "Banana", example: "mooz mikham", exampleFarsi: "موز می‌خوام", exampleEnglish: "I want a banana" },
          { phonetic: "angoor", farsi: "انگور", english: "Grapes", example: "angoor daari?", exampleFarsi: "انگور داری؟", exampleEnglish: "Do you have grapes?" },
          { phonetic: "hendooneh", farsi: "هندوانه", english: "Watermelon", example: "hendooneh mikham", exampleFarsi: "هندوانه می‌خوام", exampleEnglish: "I want watermelon" },
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
          { phonetic: "emrooz", farsi: "امروز", english: "Today", example: "emrooz chetore?", exampleFarsi: "امروز چطوره؟", exampleEnglish: "How is today?" },
          { phonetic: "dirooz", farsi: "دیروز", english: "Yesterday", example: "dirooz raftam", exampleFarsi: "دیروز رفتم", exampleEnglish: "I went yesterday" },
          { phonetic: "fardaa", farsi: "فردا", english: "Tomorrow", example: "fardaa miaay?", exampleFarsi: "فردا می‌آی؟", exampleEnglish: "Are you coming tomorrow?" },
          { phonetic: "haalaa", farsi: "حالا", english: "Now", example: "haalaa boro", exampleFarsi: "حالا برو", exampleEnglish: "Go now" },
          { phonetic: "baadan", farsi: "بعداً", english: "Later", example: "baadan miam", exampleFarsi: "بعداً می‌آم", exampleEnglish: "I'll come later" },
          { phonetic: "ghabl", farsi: "قبل", english: "Before", example: "ghabl az in", exampleFarsi: "قبل از این", exampleEnglish: "Before this" },
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
          { phonetic: "takht", farsi: "تخت", english: "Bed", example: "takht-e do nafareh", exampleFarsi: "تخت دو نفره", exampleEnglish: "Double bed" },
          { phonetic: "farsh", farsi: "فرش", english: "Carpet/Rug", example: "farsh-e irani", exampleFarsi: "فرش ایرانی", exampleEnglish: "Persian carpet" },
          { phonetic: "āyeneh", farsi: "آینه", english: "Mirror", example: "āyeneh-ye bozorg", exampleFarsi: "آینه‌ی بزرگ", exampleEnglish: "Large mirror" },
          { phonetic: "cheraagh", farsi: "چراغ", english: "Light/Lamp", example: "cheraagh-o roshan kon", exampleFarsi: "چراغ رو روشن کن", exampleEnglish: "Turn on the light" },
          { phonetic: "yakhchaal", farsi: "یخچال", english: "Refrigerator", example: "too yakhchaal-e", exampleFarsi: "تو یخچاله", exampleEnglish: "It's in the fridge" },
          { phonetic: "gaaz", farsi: "گاز", english: "Stove/Gas", example: "gaaz-o roshan kon", exampleFarsi: "گاز رو روشن کن", exampleEnglish: "Turn on the stove" },
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
          { phonetic: "dar", farsi: "در", english: "In/At", example: "dar khaneh", exampleFarsi: "در خانه", exampleEnglish: "At home" },
          { phonetic: "ruye", farsi: "روی", english: "On/On top of", example: "ruye miz", exampleFarsi: "روی میز", exampleEnglish: "On the table" },
          { phonetic: "zir-e", farsi: "زیر", english: "Under", example: "zir-e miz", exampleFarsi: "زیر میز", exampleEnglish: "Under the table" },
          { phonetic: "kenaar-e", farsi: "کنار", english: "Next to/Beside", example: "kenaar-e man", exampleFarsi: "کنار من", exampleEnglish: "Next to me" },
          { phonetic: "baa", farsi: "با", english: "With", example: "baa man biyaa", exampleFarsi: "با من بیا", exampleEnglish: "Come with me" },
          { phonetic: "bi", farsi: "بی", english: "Without", example: "bi shekar", exampleFarsi: "بی شکر", exampleEnglish: "Without sugar" },
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
          { phonetic: "khaabidan", farsi: "خوابیدن", english: "To sleep", example: "man mikhaabam", exampleFarsi: "من می‌خوابم", exampleEnglish: "I sleep" },
          { phonetic: "bidaar shodan", farsi: "بیدار شدن", english: "To wake up", example: "man bidaar misham", exampleFarsi: "من بیدار می‌شم", exampleEnglish: "I wake up" },
          { phonetic: "khaandan", farsi: "خواندن", english: "To read", example: "man mikhaanam", exampleFarsi: "من می‌خوانم", exampleEnglish: "I read" },
          { phonetic: "neveshtan", farsi: "نوشتن", english: "To write", example: "man minevisam", exampleFarsi: "من می‌نویسم", exampleEnglish: "I write" },
          { phonetic: "kaar kardan", farsi: "کار کردن", english: "To work", example: "man kaar mikonam", exampleFarsi: "من کار می‌کنم", exampleEnglish: "I work" },
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
          { phonetic: "zard", farsi: "زرد", english: "Yellow", example: "gol-e zard", exampleFarsi: "گل زرد", exampleEnglish: "Yellow flower" },
          { phonetic: "narenji", farsi: "نارنجی", english: "Orange (color)", example: "rang-e narenji", exampleFarsi: "رنگ نارنجی", exampleEnglish: "Orange color" },
          { phonetic: "banafshe", farsi: "بنفش", english: "Purple", example: "gol-e banafshe", exampleFarsi: "گل بنفش", exampleEnglish: "Purple flower" },
          { phonetic: "ghahvei", farsi: "قهوه‌ای", english: "Brown", example: "kafsh-e ghahvei", exampleFarsi: "کفش قهوه‌ای", exampleEnglish: "Brown shoes" },
          { phonetic: "soorati", farsi: "صورتی", english: "Pink", example: "gol-e soorati", exampleFarsi: "گل صورتی", exampleEnglish: "Pink flower" },
          { phonetic: "toosi", farsi: "طوسی", english: "Gray", example: "aasmaan-e toosi", exampleFarsi: "آسمان طوسی", exampleEnglish: "Gray sky" },
        ],
      },
      {
        level: 2,
        category: {
          name: "Family Basic",
          slug: "family-basic",
          description: "Extended family members",
          icon: "👨‍👩‍👧",
        },
        title: "Family (Part 2)",
        words: [
          { phonetic: "baraadar", farsi: "برادر", english: "Brother", example: "baraadar-e man", exampleFarsi: "برادر من", exampleEnglish: "My brother" },
          { phonetic: "khaahar", farsi: "خواهر", english: "Sister", example: "khaahar-e man", exampleFarsi: "خواهر من", exampleEnglish: "My sister" },
          { phonetic: "pesar", farsi: "پسر", english: "Son/Boy", example: "pesar-e man", exampleFarsi: "پسر من", exampleEnglish: "My son" },
          { phonetic: "dokhtar", farsi: "دختر", english: "Daughter/Girl", example: "dokhtar-e man", exampleFarsi: "دختر من", exampleEnglish: "My daughter" },
          { phonetic: "bache", farsi: "بچه", english: "Child", example: "bache daari?", exampleFarsi: "بچه داری؟", exampleEnglish: "Do you have children?" },
        ],
      },
      {
        level: 2,
        category: {
          name: "Family Basic",
          slug: "family-basic",
          description: "Extended family members",
          icon: "👨‍👩‍👧",
        },
        title: "Family (Part 3)",
        words: [
          { phonetic: "shohar", farsi: "شوهر", english: "Husband", example: "shohar-e man", exampleFarsi: "شوهر من", exampleEnglish: "My husband" },
          { phonetic: "zan", farsi: "زن", english: "Wife/Woman", example: "zan-e man", exampleFarsi: "زن من", exampleEnglish: "My wife" },
          { phonetic: "khanevadeh", farsi: "خانواده", english: "Family", example: "khanevadeh-ye man", exampleFarsi: "خانواده‌ی من", exampleEnglish: "My family" },
          { phonetic: "maadarbozorg", farsi: "مادربزرگ", english: "Grandmother", example: "maadarbozorg-e man", exampleFarsi: "مادربزرگ من", exampleEnglish: "My grandmother" },
          { phonetic: "pedarbozorg", farsi: "پدربزرگ", english: "Grandfather", example: "pedarbozorg-e man", exampleFarsi: "پدربزرگ من", exampleEnglish: "My grandfather" },
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
        title: "Drinks & Beverages",
        words: [
          { phonetic: "ghahveh", farsi: "قهوه", english: "Coffee", example: "ghahveh mikhai?", exampleFarsi: "قهوه می‌خوای؟", exampleEnglish: "Do you want coffee?" },
          { phonetic: "aab miveh", farsi: "آب میوه", english: "Juice", example: "aab miveh mikhai?", exampleFarsi: "آب میوه می‌خوای؟", exampleEnglish: "Do you want juice?" },
          { phonetic: "ghand", farsi: "قند", english: "Sugar cube", example: "ghand mikhay?", exampleFarsi: "قند می‌خوای؟", exampleEnglish: "Do you want sugar?" },
          { phonetic: "shekar", farsi: "شکر", english: "Sugar", example: "bi shekar lotfan", exampleFarsi: "بی شکر لطفاً", exampleEnglish: "Without sugar please" },
          { phonetic: "nooshaabe", farsi: "نوشابه", english: "Soda/Soft drink", example: "nooshaabe daari?", exampleFarsi: "نوشابه داری؟", exampleEnglish: "Do you have soda?" },
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
          { phonetic: "doktor", farsi: "دکتر", english: "Doctor", example: "doktor hastam", exampleFarsi: "دکتر هستم", exampleEnglish: "I am a doctor" },
          { phonetic: "moalem", farsi: "معلم", english: "Teacher", example: "moalem-e khoob", exampleFarsi: "معلم خوب", exampleEnglish: "Good teacher" },
          { phonetic: "mohandis", farsi: "مهندس", english: "Engineer", example: "mohandis hastam", exampleFarsi: "مهندس هستم", exampleEnglish: "I am an engineer" },
          { phonetic: "raanandeh", farsi: "راننده", english: "Driver", example: "raanandeh-ye taaksi", exampleFarsi: "راننده‌ی تاکسی", exampleEnglish: "Taxi driver" },
          { phonetic: "forooshandeh", farsi: "فروشنده", english: "Seller/Salesperson", example: "forooshandeh-ye maghazeh", exampleFarsi: "فروشنده‌ی مغازه", exampleEnglish: "Store seller" },
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
          { phonetic: "shanbeh", farsi: "شنبه", english: "Saturday", example: "shanbeh kaar mikonam", exampleFarsi: "شنبه کار می‌کنم", exampleEnglish: "I work on Saturday" },
          { phonetic: "yekshanbeh", farsi: "یکشنبه", english: "Sunday", example: "yekshanbeh azad-am", exampleFarsi: "یکشنبه آزادم", exampleEnglish: "I'm free on Sunday" },
          { phonetic: "doshanbeh", farsi: "دوشنبه", english: "Monday", example: "doshanbeh miam", exampleFarsi: "دوشنبه می‌آم", exampleEnglish: "I'll come Monday" },
          { phonetic: "seshanbeh", farsi: "سه‌شنبه", english: "Tuesday", example: "seshanbeh kaar daaram", exampleFarsi: "سه‌شنبه کار دارم", exampleEnglish: "I have work Tuesday" },
          { phonetic: "chaharshanbeh", farsi: "چهارشنبه", english: "Wednesday", example: "chaharshanbeh azad-am", exampleFarsi: "چهارشنبه آزادم", exampleEnglish: "I'm free Wednesday" },
          { phonetic: "panjshanbeh", farsi: "پنج‌شنبه", english: "Thursday", example: "panjshanbeh miram", exampleFarsi: "پنج‌شنبه می‌رم", exampleEnglish: "I'm going Thursday" },
          { phonetic: "jomeh", farsi: "جمعه", english: "Friday", example: "jomeh tatil-e", exampleFarsi: "جمعه تعطیله", exampleEnglish: "Friday is a holiday" },
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
          { phonetic: "zadan", farsi: "زدن", english: "To hit/play/put", example: "man mizanam", exampleFarsi: "من می‌زنم", exampleEnglish: "I hit" },
          { phonetic: "bordan", farsi: "بردن", english: "To take/win", example: "man mibaram", exampleFarsi: "من می‌برم", exampleEnglish: "I take" },
          { phonetic: "avardan", farsi: "آوردن", english: "To bring", example: "man miaram", exampleFarsi: "من می‌آرم", exampleEnglish: "I bring" },
          { phonetic: "bastan", farsi: "بستن", english: "To close", example: "dar-o beband", exampleFarsi: "در رو ببند", exampleEnglish: "Close the door" },
          { phonetic: "baaz kardan", farsi: "باز کردن", english: "To open", example: "dar-o baaz kon", exampleFarsi: "در رو باز کن", exampleEnglish: "Open the door" },
          { phonetic: "davidan", farsi: "دویدن", english: "To run", example: "man midavam", exampleFarsi: "من می‌دوم", exampleEnglish: "I run" },
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
          { phonetic: "sag", farsi: "سگ", english: "Dog", example: "sag daaram", exampleFarsi: "سگ دارم", exampleEnglish: "I have a dog" },
          { phonetic: "gorbeh", farsi: "گربه", english: "Cat", example: "gorbeh-ye sefid", exampleFarsi: "گربه‌ی سفید", exampleEnglish: "White cat" },
          { phonetic: "gav", farsi: "گاو", english: "Cow", example: "gav shir mideh", exampleFarsi: "گاو شیر می‌ده", exampleEnglish: "Cow gives milk" },
          { phonetic: "goosefand", farsi: "گوسفند", english: "Sheep", example: "goosefand-e sefid", exampleFarsi: "گوسفند سفید", exampleEnglish: "White sheep" },
          { phonetic: "asb", farsi: "اسب", english: "Horse", example: "asb savari", exampleFarsi: "اسب سواری", exampleEnglish: "Horse riding" },
          { phonetic: "parandeh", farsi: "پرنده", english: "Bird", example: "parandeh parvaz mikoneh", exampleFarsi: "پرنده پرواز می‌کنه", exampleEnglish: "The bird flies" },
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
          { phonetic: "baraye", farsi: "برای", english: "For", example: "baraye to", exampleFarsi: "برای تو", exampleEnglish: "For you" },
          { phonetic: "az", farsi: "از", english: "From", example: "az kojaa?", exampleFarsi: "از کجا؟", exampleEnglish: "From where?" },
          { phonetic: "be", farsi: "به", english: "To", example: "be khaneh", exampleFarsi: "به خانه", exampleEnglish: "To home" },
          { phonetic: "taa", farsi: "تا", english: "Until", example: "taa fardaa", exampleFarsi: "تا فردا", exampleEnglish: "Until tomorrow" },
          { phonetic: "joloye", farsi: "جلوی", english: "In front of", example: "joloye khaneh", exampleFarsi: "جلوی خانه", exampleEnglish: "In front of the house" },
          { phonetic: "poshte", farsi: "پشت", english: "Behind", example: "poshte dar", exampleFarsi: "پشت در", exampleEnglish: "Behind the door" },
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
          { phonetic: "fekr kardan", farsi: "فکر کردن", english: "To think", example: "man fekr mikonam", exampleFarsi: "من فکر می‌کنم", exampleEnglish: "I think" },
          { phonetic: "safar kardan", farsi: "سفر کردن", english: "To travel", example: "man safar mikonam", exampleFarsi: "من سفر می‌کنم", exampleEnglish: "I travel" },
          { phonetic: "varzesh kardan", farsi: "ورزش کردن", english: "To exercise", example: "man varzesh mikonam", exampleFarsi: "من ورزش می‌کنم", exampleEnglish: "I exercise" },
          { phonetic: "aashpazi kardan", farsi: "آشپزی کردن", english: "To cook", example: "man aashpazi mikonam", exampleFarsi: "من آشپزی می‌کنم", exampleEnglish: "I cook" },
          { phonetic: "goosh kardan", farsi: "گوش کردن", english: "To listen", example: "man goosh mikonam", exampleFarsi: "من گوش می‌کنم", exampleEnglish: "I listen" },
          { phonetic: "komak kardan", farsi: "کمک کردن", english: "To help", example: "man komak mikonam", exampleFarsi: "من کمک می‌کنم", exampleEnglish: "I help" },
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
          { phonetic: "havaa", farsi: "هوا", english: "Weather/Air", example: "havaa chetore?", exampleFarsi: "هوا چطوره؟", exampleEnglish: "How's the weather?" },
          { phonetic: "garm", farsi: "گرم", english: "Hot/Warm", example: "havaa garm-e", exampleFarsi: "هوا گرمه", exampleEnglish: "It's hot" },
          { phonetic: "sard", farsi: "سرد", english: "Cold", example: "havaa sard-e", exampleFarsi: "هوا سرده", exampleEnglish: "It's cold" },
          { phonetic: "aftaabi", farsi: "آفتابی", english: "Sunny", example: "emrooz aftaabi-e", exampleFarsi: "امروز آفتابیه", exampleEnglish: "Today is sunny" },
          { phonetic: "baarooni", farsi: "بارونی", english: "Rainy", example: "havaa baarooni-e", exampleFarsi: "هوا بارونیه", exampleEnglish: "It's rainy" },
          { phonetic: "barf", farsi: "برف", english: "Snow", example: "barf miad", exampleFarsi: "برف می‌آد", exampleEnglish: "It's snowing" },
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
          { phonetic: "chetoor", farsi: "چطور", english: "How", example: "chetoor hasti?", exampleFarsi: "چطور هستی؟", exampleEnglish: "How are you?" },
          { phonetic: "chand", farsi: "چند", english: "How many/How much", example: "chand taa?", exampleFarsi: "چند تا؟", exampleEnglish: "How many?" },
          { phonetic: "chand vaght", farsi: "چند وقت", english: "How long", example: "chand vaght?", exampleFarsi: "چند وقت؟", exampleEnglish: "How long?" },
          { phonetic: "kodoom", farsi: "کدوم", english: "Which", example: "kodoom yeki?", exampleFarsi: "کدوم یکی؟", exampleEnglish: "Which one?" },
          { phonetic: "aayaa", farsi: "آیا", english: "Is it?/Do you? (question marker)", example: "aayaa miaay?", exampleFarsi: "آیا می‌آی؟", exampleEnglish: "Are you coming?" },
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
          { phonetic: "sar", farsi: "سر", english: "Head", example: "saram dard mikoneh", exampleFarsi: "سرم درد می‌کنه", exampleEnglish: "My head hurts" },
          { phonetic: "cheshm", farsi: "چشم", english: "Eye", example: "cheshm-e aabi", exampleFarsi: "چشم آبی", exampleEnglish: "Blue eyes" },
          { phonetic: "goosh", farsi: "گوش", english: "Ear", example: "goosh-e man", exampleFarsi: "گوش من", exampleEnglish: "My ear" },
          { phonetic: "bini", farsi: "بینی", english: "Nose", example: "bini-ye bozorg", exampleFarsi: "بینی بزرگ", exampleEnglish: "Big nose" },
          { phonetic: "dahaan", farsi: "دهان", english: "Mouth", example: "dahanat-o baz kon", exampleFarsi: "دهنت رو باز کن", exampleEnglish: "Open your mouth" },
          { phonetic: "dast", farsi: "دست", english: "Hand/Arm", example: "dast-e man", exampleFarsi: "دست من", exampleEnglish: "My hand" },
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
          { phonetic: "paraastar", farsi: "پرستار", english: "Nurse", example: "paraastar-e bimarestan", exampleFarsi: "پرستار بیمارستان", exampleEnglish: "Hospital nurse" },
          { phonetic: "aashpaz", farsi: "آشپز", english: "Cook/Chef", example: "aashpaz-e restooraan", exampleFarsi: "آشپز رستوران", exampleEnglish: "Restaurant chef" },
          { phonetic: "kaargar", farsi: "کارگر", english: "Worker", example: "kaargar-e sakhtemani", exampleFarsi: "کارگر ساختمانی", exampleEnglish: "Construction worker" },
          { phonetic: "kaarmanad", farsi: "کارمند", english: "Employee/Office worker", example: "kaarmanad-e dolat", exampleFarsi: "کارمند دولت", exampleEnglish: "Government employee" },
          { phonetic: "honarmand", farsi: "هنرمند", english: "Artist", example: "honarmand-e mashoor", exampleFarsi: "هنرمند مشهور", exampleEnglish: "Famous artist" },
          { phonetic: "vakil", farsi: "وکیل", english: "Lawyer", example: "vakil-e man", exampleFarsi: "وکیل من", exampleEnglish: "My lawyer" },
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
          { phonetic: "fil", farsi: "فیل", english: "Elephant", example: "fil bozorg-e", exampleFarsi: "فیل بزرگه", exampleEnglish: "The elephant is big" },
          { phonetic: "shir", farsi: "شیر", english: "Lion", example: "shir-e vahshi", exampleFarsi: "شیر وحشی", exampleEnglish: "Wild lion" },
          { phonetic: "khers", farsi: "خرس", english: "Bear", example: "khers-e ghahvei", exampleFarsi: "خرس قهوه‌ای", exampleEnglish: "Brown bear" },
          { phonetic: "maar", farsi: "مار", english: "Snake", example: "maar khatarnak-e", exampleFarsi: "مار خطرناکه", exampleEnglish: "Snake is dangerous" },
          { phonetic: "khargoosh", farsi: "خرگوش", english: "Rabbit", example: "khargoosh-e sefid", exampleFarsi: "خرگوش سفید", exampleEnglish: "White rabbit" },
          { phonetic: "moosh", farsi: "موش", english: "Mouse", example: "moosh koochak-e", exampleFarsi: "موش کوچکه", exampleEnglish: "The mouse is small" },
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
          { phonetic: "iraan", farsi: "ایران", english: "Iran", example: "man az iraan hastam", exampleFarsi: "من از ایران هستم", exampleEnglish: "I am from Iran" },
          { phonetic: "keshvar", farsi: "کشور", english: "Country", example: "keshvar-e zibaa", exampleFarsi: "کشور زیبا", exampleEnglish: "Beautiful country" },
          { phonetic: "shahr", farsi: "شهر", english: "City", example: "shahr-e bozorg", exampleFarsi: "شهر بزرگ", exampleEnglish: "Big city" },
          { phonetic: "safar", farsi: "سفر", english: "Trip/Travel", example: "safar-e khoob", exampleFarsi: "سفر خوب", exampleEnglish: "Good trip" },
          { phonetic: "forodgah", farsi: "فرودگاه", english: "Airport", example: "be forodgah miram", exampleFarsi: "به فرودگاه می‌رم", exampleEnglish: "I'm going to the airport" },
          { phonetic: "hotel", farsi: "هتل", english: "Hotel", example: "hotel kojast?", exampleFarsi: "هتل کجاست؟", exampleEnglish: "Where is the hotel?" },
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
          { phonetic: "pasport", farsi: "پاسپورت", english: "Passport", example: "pasport-et kojast?", exampleFarsi: "پاسپورتت کجاست؟", exampleEnglish: "Where is your passport?" },
          { phonetic: "viizaa", farsi: "ویزا", english: "Visa", example: "viizaa daari?", exampleFarsi: "ویزا داری؟", exampleEnglish: "Do you have a visa?" },
          { phonetic: "bilet", farsi: "بلیط", english: "Ticket", example: "bilet-e havapeymaa", exampleFarsi: "بلیط هواپیما", exampleEnglish: "Airplane ticket" },
          { phonetic: "chamedaan", farsi: "چمدان", english: "Suitcase", example: "chamedaan-am sangin-e", exampleFarsi: "چمدانم سنگینه", exampleEnglish: "My suitcase is heavy" },
          { phonetic: "gardeshgar", farsi: "گردشگر", english: "Tourist", example: "gardeshgar-e khareji", exampleFarsi: "گردشگر خارجی", exampleEnglish: "Foreign tourist" },
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
          { phonetic: "paa", farsi: "پا", english: "Foot/Leg", example: "paam dard mikoneh", exampleFarsi: "پام درد می‌کنه", exampleEnglish: "My leg hurts" },
          { phonetic: "angosht", farsi: "انگشت", english: "Finger/Toe", example: "angosht-e man", exampleFarsi: "انگشت من", exampleEnglish: "My finger" },
          { phonetic: "del", farsi: "دل", english: "Heart/Stomach", example: "delam dard mikoneh", exampleFarsi: "دلم درد می‌کنه", exampleEnglish: "My stomach hurts" },
          { phonetic: "kamar", farsi: "کمر", english: "Waist/Back", example: "kamaram dard mikoneh", exampleFarsi: "کمرم درد می‌کنه", exampleEnglish: "My back hurts" },
          { phonetic: "moo", farsi: "مو", english: "Hair", example: "moo-ye siyaah", exampleFarsi: "موی سیاه", exampleEnglish: "Black hair" },
          { phonetic: "dandaan", farsi: "دندان", english: "Tooth", example: "dandaanam dard mikoneh", exampleFarsi: "دندانم درد می‌کنه", exampleEnglish: "My tooth hurts" },
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
          { phonetic: "baazi kardan", farsi: "بازی کردن", english: "To play (game)", example: "man baazi mikonam", exampleFarsi: "من بازی می‌کنم", exampleEnglish: "I play" },
          { phonetic: "sohbat kardan", farsi: "صحبت کردن", english: "To speak/talk", example: "man sohbat mikonam", exampleFarsi: "من صحبت می‌کنم", exampleEnglish: "I talk" },
          { phonetic: "estefaade kardan", farsi: "استفاده کردن", english: "To use", example: "man estefaade mikonam", exampleFarsi: "من استفاده می‌کنم", exampleEnglish: "I use" },
          { phonetic: "dorost kardan", farsi: "درست کردن", english: "To make/fix", example: "man dorost mikonam", exampleFarsi: "من درست می‌کنم", exampleEnglish: "I make" },
          { phonetic: "tamoom kardan", farsi: "تمام کردن", english: "To finish", example: "man tamoom mikonam", exampleFarsi: "من تمام می‌کنم", exampleEnglish: "I finish" },
          { phonetic: "shoroo kardan", farsi: "شروع کردن", english: "To start", example: "man shoroo mikonam", exampleFarsi: "من شروع می‌کنم", exampleEnglish: "I start" },
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
          { phonetic: "amaade shodan", farsi: "آماده شدن", english: "To get ready", example: "man amaade misham", exampleFarsi: "من آماده می‌شم", exampleEnglish: "I get ready" },
          { phonetic: "asabaani shodan", farsi: "عصبانی شدن", english: "To get angry", example: "man asabaani shodam", exampleFarsi: "من عصبانی شدم", exampleEnglish: "I got angry" },
          { phonetic: "khaste shodan", farsi: "خسته شدن", english: "To get tired", example: "man khaste shodam", exampleFarsi: "من خسته شدم", exampleEnglish: "I got tired" },
          { phonetic: "gom shodan", farsi: "گم شدن", english: "To get lost", example: "man gom shodam", exampleFarsi: "من گم شدم", exampleEnglish: "I got lost" },
          { phonetic: "aashenaa shodan", farsi: "آشنا شدن", english: "To get acquainted", example: "aashenaa shodim", exampleFarsi: "آشنا شدیم", exampleEnglish: "We got acquainted" },
          { phonetic: "shoro shodan", farsi: "شروع شدن", english: "To start (intransitive)", example: "film shoro shod", exampleFarsi: "فیلم شروع شد", exampleEnglish: "The movie started" },
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
          { phonetic: "doost daashtan", farsi: "دوست داشتن", english: "To like/love", example: "man doost daaram", exampleFarsi: "من دوست دارم", exampleEnglish: "I like/love" },
          { phonetic: "niaz daashtan", farsi: "نیاز داشتن", english: "To need", example: "man niaz daaram", exampleFarsi: "من نیاز دارم", exampleEnglish: "I need" },
          { phonetic: "vaght daashtan", farsi: "وقت داشتن", english: "To have time", example: "man vaght daaram", exampleFarsi: "من وقت دارم", exampleEnglish: "I have time" },
          { phonetic: "ajale daashtan", farsi: "عجله داشتن", english: "To be in a hurry", example: "man ajale daaram", exampleFarsi: "من عجله دارم", exampleEnglish: "I'm in a hurry" },
          { phonetic: "alaaghe daashtan", farsi: "علاقه داشتن", english: "To be interested", example: "man alaaghe daaram", exampleFarsi: "من علاقه دارم", exampleEnglish: "I am interested" },
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
          { phonetic: "kheyli", farsi: "خیلی", english: "Very/A lot", example: "kheyli khob", exampleFarsi: "خیلی خوب", exampleEnglish: "Very good" },
          { phonetic: "kam", farsi: "کم", english: "Little/Few", example: "kam-e", exampleFarsi: "کمه", exampleEnglish: "It's little" },
          { phonetic: "ziyaad", farsi: "زیاد", english: "Much/Many", example: "ziyaad-e", exampleFarsi: "زیاده", exampleEnglish: "It's a lot" },
          { phonetic: "hamishe", farsi: "همیشه", english: "Always", example: "hamishe miam", exampleFarsi: "همیشه می‌آم", exampleEnglish: "I always come" },
          { phonetic: "hichvaght", farsi: "هیچوقت", english: "Never", example: "hichvaght naraftam", exampleFarsi: "هیچوقت نرفتم", exampleEnglish: "I never went" },
          { phonetic: "gahi", farsi: "گاهی", english: "Sometimes", example: "gahi miam", exampleFarsi: "گاهی می‌آم", exampleEnglish: "I sometimes come" },
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
          { phonetic: "va", farsi: "و", english: "And", example: "man va to", exampleFarsi: "من و تو", exampleEnglish: "Me and you" },
          { phonetic: "yaa", farsi: "یا", english: "Or", example: "chaay yaa ghahveh?", exampleFarsi: "چای یا قهوه؟", exampleEnglish: "Tea or coffee?" },
          { phonetic: "amma", farsi: "اما", english: "But", example: "mikham, amma nemitonam", exampleFarsi: "می‌خوام، اما نمی‌تونم", exampleEnglish: "I want to, but I can't" },
          { phonetic: "chon", farsi: "چون", english: "Because", example: "chon khaste-am", exampleFarsi: "چون خسته‌ام", exampleEnglish: "Because I'm tired" },
          { phonetic: "agar", farsi: "اگر", english: "If", example: "agar biaay", exampleFarsi: "اگر بیای", exampleEnglish: "If you come" },
          { phonetic: "vaghti", farsi: "وقتی", english: "When", example: "vaghti oomadi", exampleFarsi: "وقتی اومدی", exampleEnglish: "When you came" },
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
              farsiWord: word.farsi,
              phonetic: word.phonetic,
              englishTranslation: word.english,
              exampleFarsi: word.exampleFarsi,
              examplePhonetic: word.example,
              exampleEnglish: word.exampleEnglish,
              difficultyLevel: lessonData.level,
              isFormal: "isFormal" in word ? (word as { isFormal?: boolean }).isFormal : false,
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
