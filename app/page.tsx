import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";
import { auth } from "@/auth";
import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["latin"] });
import { db } from "@/db";
import { lessons, users, userStats, userLessonProgress, userGrammarProgress, userProgress } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { AnimatedCounter } from "@/components/animated-counter";

export default async function LandingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user;
  const userName = session?.user?.name || session?.user?.email?.split("@")[0];

  // Fetch the count of active lessons
  const lessonCountResult = await db
    .select({ count: count() })
    .from(lessons)
    .where(eq(lessons.isActive, true));
  const lessonCount = lessonCountResult[0]?.count || 0;

  // Fetch the count of registered users
  const userCountResult = await db
    .select({ count: count() })
    .from(users);
  const userCount = userCountResult[0]?.count || 0;

  // Fetch total XP: max of stored counter vs computed from review history (across all users)
  const [storedXPResult, reviewXPResult] = await Promise.all([
    db
      .select({ total: sql<number>`COALESCE(SUM(${userStats.totalXP}), 0)` })
      .from(userStats),
    db
      .select({ total: sql<number>`COALESCE(SUM(${userProgress.totalCorrect} * 3 + ${userProgress.totalWrong} * 1), 0)` })
      .from(userProgress),
  ]);
  const totalXP = Math.max(
    Number(storedXPResult[0]?.total || 0),
    Number(reviewXPResult[0]?.total || 0)
  );

  // Fetch total lessons completed by all users: attempts (vocab + grammar) + daily practice sessions
  const [vocabResult, grammarResult, practiceResult] = await Promise.all([
    db
      .select({ totalAttempts: sql<number>`COALESCE(SUM(${userLessonProgress.attempts}), 0)` })
      .from(userLessonProgress),
    db
      .select({ totalAttempts: sql<number>`COALESCE(SUM(${userGrammarProgress.attempts}), 0)` })
      .from(userGrammarProgress),
    db
      .select({ totalReviews: sql<number>`COALESCE(SUM(${userProgress.reviewCount}), 0)` })
      .from(userProgress),
  ]);
  const vocabAttempts = Number(vocabResult[0]?.totalAttempts || 0);
  const grammarAttempts = Number(grammarResult[0]?.totalAttempts || 0);
  const practiceSessionsCompleted = Math.floor(Number(practiceResult[0]?.totalReviews || 0) / 10);
  const totalLessonsCompleted = vocabAttempts + grammarAttempts + practiceSessionsCompleted;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Learn Farsi",
    url: "https://learnfarsi.app",
    description:
      "Learn Farsi (Persian) vocabulary, grammar, and alphabet with structured lessons and spaced repetition. Free forever.",
    inLanguage: "en",
    about: {
      "@type": "Language",
      name: "Persian",
      alternateName: "Farsi",
    },
    publisher: {
      "@type": "Organization",
      name: "Learn Farsi",
      url: "https://learnfarsi.app",
    },
  };

  return (
    <div className="min-h-screen bg-persian-beige-200 dark:bg-[#654321] transition-colors">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/pomegranatedrawn.png"
              alt="Pomegranate"
              width={120}
              height={120}
            />
          </div>

          {/* Personalized Greeting for Logged-in Users */}
          {isLoggedIn && userName && (
            <div className="mb-6">
              <span className="inline-block px-6 py-2 bg-persian-gold-500 text-white rounded-full font-bold text-lg shadow-lg">
                👋 Welcome back, {userName}!
              </span>
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-persian-red-500">Learn Farsi</span>
            <span className="ml-3 inline-block align-top bg-persian-gold-500 text-white text-sm md:text-base font-bold px-3 py-1 rounded-lg shadow-lg">BETA</span>
            <br />
            <span
              className="text-persian-red-700 dark:text-persian-beige-100"
              style={{ direction: "rtl" }}
            >
              فارسی بیاموزید
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-persian-red-800 dark:text-persian-beige-200 mb-16 max-w-3xl mx-auto font-medium">
            Learn new Farsi words every day and{" "}
            <span className="text-persian-red-500 font-bold">
              actually remember them
            </span>{" "}
            with smart{" "}
            <span className="text-persian-red-500 font-bold">
              spaced repetition
            </span>, completely{" "}
            <span className="relative inline-block">
              <span className="text-persian-red-500 font-bold">free!</span>
              {/* Hand-drawn underline */}
              <svg className="absolute -bottom-1 left-0 w-full text-persian-gold-500 pointer-events-none" height="6" viewBox="0 0 60 6" fill="none" preserveAspectRatio="none">
                <path d="M0 3C10 0.5 15 5.5 25 3C35 0.5 40 5.5 50 3C55 1 58 4.5 60 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
              <span className="absolute top-[100%] left-[calc(110%-10px)] flex flex-col items-start pointer-events-none">
                <svg width="32" height="28" viewBox="0 0 32 28" fill="none" className="text-persian-gold-500 mt-[10px]">
                  <path d="M28 24C22 18 14 10 6 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M3 8L5 2L10 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={`${caveat.className} text-persian-gold-500 font-bold text-2xl whitespace-nowrap -mt-[10px]`} style={{ transform: "rotate(-3deg)" }}>
                  Forever
                </span>
              </span>
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/dashboard/lessons"
              className="px-8 py-4 bg-persian-red-500 text-white rounded-xl hover:bg-persian-red-600 transition-all shadow-xl hover:shadow-2xl text-lg font-bold hover:scale-105 transform"
            >
              {isLoggedIn ? "Continue Learning" : "Start Learning"} <span className="btn-arrow">→</span>
            </Link>
            <Link
              href="/dashboard/practice"
              className="px-8 py-4 bg-white dark:bg-persian-beige-800 text-persian-red-500 dark:text-persian-red-400 border-3 border-persian-red-500 dark:border-persian-red-400 rounded-xl hover:bg-persian-beige-100 dark:hover:bg-persian-beige-700 transition-all shadow-lg text-lg font-bold"
            >
              {isLoggedIn ? "Practice Mode" : "Try Practice Mode"}
            </Link>
          </div>

          {/* Social Proof + Community Stats */}
          <div className="flex flex-col items-center mb-12">
            <div className="flex flex-wrap justify-center items-center gap-3">
              {userCount > 0 && (
                <Link href="/dashboard" className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 bg-white dark:bg-persian-beige-800 rounded-full shadow-lg border-2 border-persian-gold-400 transition-all duration-200 hover:scale-105 hover:shadow-xl cursor-pointer">
                  <div className="flex -space-x-2 flex-shrink-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-persian-red-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold">F</div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-persian-gold-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">A</div>
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-persian-red-600 border-2 border-white flex items-center justify-center text-white text-xs font-bold">R</div>
                  </div>
                  <span className="text-persian-red-700 dark:text-persian-beige-200 font-semibold text-sm sm:text-lg">
                    Join <span className="text-persian-red-500 font-bold">{userCount}</span> {userCount === 1 ? "learner" : "learners"}
                  </span>
                </Link>
              )}
              {totalXP > 0 && (
                <div className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-persian-beige-800 rounded-full shadow-lg border-2 border-persian-gold-400 transition-all duration-200 hover:scale-105 hover:shadow-xl">
                  <span className="text-xl">⚡</span>
                  <span className="text-persian-red-700 dark:text-persian-beige-200 font-semibold text-sm sm:text-base">
                    <AnimatedCounter target={totalXP} className="text-persian-red-500 font-bold" /> Total XP Earned
                  </span>
                </div>
              )}
              {totalLessonsCompleted > 0 && (
                <div className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-persian-beige-800 rounded-full shadow-lg border-2 border-persian-gold-400 transition-all duration-200 hover:scale-105 hover:shadow-xl">
                  <span className="text-xl">✅</span>
                  <span className="text-persian-red-700 dark:text-persian-beige-200 font-semibold text-sm sm:text-base">
                    <AnimatedCounter target={totalLessonsCompleted} className="text-persian-red-500 font-bold" /> Total Lessons Completed
                  </span>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* Why Learn Farsi Section */}
      <section className="py-16 bg-persian-beige-100 dark:bg-[#543210] transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-persian-red-500">
            Why Learn Farsi?
          </h2>
          <p className="text-center text-persian-red-700 dark:text-persian-beige-200 mb-6 sm:mb-12 text-sm sm:text-lg font-medium">
            Everything you need to learn and remember Farsi words fast and easy!
          </p>
          <div className="grid grid-cols-3 gap-2.5 sm:gap-8 mx-auto md:grid-cols-3">
            <div className="bg-white dark:bg-persian-beige-800 rounded-xl sm:rounded-2xl p-4 sm:p-8 border-2 border-persian-red-500 dark:border-persian-red-700 shadow-xl transition-all hover:shadow-2xl hover:scale-105 text-center">
              <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-2 sm:mb-3 overflow-hidden"><Image src="/multiplebooks_icon.png" alt="Books" width={80} height={80} className="w-full h-full object-cover scale-125" /></div>
              <div className="text-2xl sm:text-4xl font-bold text-persian-red-500 mb-0.5 sm:mb-1">{lessonCount}</div>
              <div className="text-persian-red-700 dark:text-persian-beige-200 font-semibold text-sm sm:text-lg">
                Structured Lessons
              </div>
              <p className="text-persian-red-600 dark:text-persian-beige-300 text-[10px] sm:text-sm mt-0.5 sm:mt-2 hidden sm:block">
                Vocabulary, grammar & alphabet
              </p>
              {/* Hand-drawn arrow annotation */}
              <div className="hidden sm:flex items-center justify-center gap-1 mt-2 sm:mt-3 pointer-events-none">
                <svg width="28" height="24" viewBox="0 0 28 24" fill="none" className="text-persian-gold-500 flex-shrink-0 w-5 h-4 sm:w-7 sm:h-6">
                  <path d="M4 4C8 10 14 16 22 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M18 22L23 21L20 16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={`${caveat.className} text-persian-gold-500 font-bold text-sm sm:text-lg whitespace-nowrap`} style={{ transform: "rotate(-2deg)" }}>
                  And actively adding more!
                </span>
              </div>
            </div>
            <div className="bg-white dark:bg-persian-beige-800 rounded-xl sm:rounded-2xl p-4 sm:p-8 border-2 border-persian-gold-500 dark:border-persian-gold-600 shadow-xl transition-all hover:shadow-2xl hover:scale-105 text-center">
              <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-2 sm:mb-3 overflow-hidden"><Image src="/targeticon.png" alt="Target" width={80} height={80} className="w-full h-full object-cover scale-125" /></div>
              <div className="text-2xl sm:text-4xl font-bold text-persian-red-500 mb-0.5 sm:mb-1">
                Free
              </div>
              <div className="text-persian-red-700 dark:text-persian-beige-200 font-semibold text-sm sm:text-lg">
                Forever
              </div>
              <p className="text-persian-red-600 dark:text-persian-beige-300 text-[10px] sm:text-sm mt-0.5 sm:mt-2 hidden sm:block">
                No subscriptions, no paywalls
              </p>
            </div>
            <div className="bg-white dark:bg-persian-beige-800 rounded-xl sm:rounded-2xl p-4 sm:p-8 border-2 border-persian-red-500 dark:border-persian-red-700 shadow-xl transition-all hover:shadow-2xl hover:scale-105 text-center">
              <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-2 sm:mb-3 overflow-hidden"><Image src="/fireicon.png" alt="Fire" width={80} height={80} className="w-full h-full object-cover scale-125" /></div>
              <div className="text-2xl sm:text-4xl font-bold text-persian-red-500 mb-0.5 sm:mb-1">
                Daily
              </div>
              <div className="text-persian-red-700 dark:text-persian-beige-200 font-semibold text-sm sm:text-lg">
                Practice Streaks
              </div>
              <p className="text-persian-red-600 dark:text-persian-beige-300 text-[10px] sm:text-sm mt-0.5 sm:mt-2 hidden sm:block">
                Spaced repetition that adapts to you
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-persian-beige-100 dark:bg-[#654321] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-persian-red-500">
            Learn & Remember
          </h2>
          <p className="text-center text-persian-red-700 dark:text-persian-beige-200 mb-8 sm:mb-16 text-sm sm:text-lg font-medium">
            Two proven ways to build your Farsi vocabulary and make it stick
          </p>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-12">
            {/* Structured Lessons */}
            <div className="bg-persian-red-500 rounded-xl sm:rounded-3xl p-5 sm:p-8 text-white shadow-2xl hover:scale-105 transition-transform border-2 sm:border-4 border-persian-red-700">
              <div className="w-10 h-10 sm:w-16 sm:h-16 mb-2 sm:mb-4 overflow-hidden"><Image src="/bookicon.png" alt="Book" width={120} height={120} className="w-full h-full object-cover scale-125" /></div>
              <h3 className="text-xl sm:text-3xl font-bold mb-1.5 sm:mb-4">Structured Lessons</h3>
              <p className="text-persian-red-100 mb-3 sm:mb-6 text-sm sm:text-lg">
                Learn new Farsi words through themed lessons, from beginner to advanced
              </p>

              <ul className="space-y-1.5 sm:space-y-3 mb-4 sm:mb-8 text-sm sm:text-base">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-persian-gold-300 text-sm sm:text-xl">✓</span>
                  <span>Learn words at your own pace</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-persian-gold-300 text-sm sm:text-xl">✓</span>
                  <span>Words organized by themes (greetings, food, family)</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-persian-gold-300 text-sm sm:text-xl">✓</span>
                  <span>Unlock lessons as you progress</span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-persian-gold-300 text-sm sm:text-xl">✓</span>
                  <span>80% mastery to advance</span>
                </li>
              </ul>

              <Link
                href="/dashboard/lessons"
                className="block w-full py-2 sm:py-3 bg-white text-persian-red-500 rounded-xl hover:bg-persian-beige-100 transition-colors text-center font-bold text-sm sm:text-lg shadow-lg"
              >
                Browse Lessons <span className="btn-arrow">→</span>
              </Link>
            </div>

            {/* Daily Practice */}
            <div className="bg-persian-beige-200 rounded-xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl hover:scale-105 transition-transform border-2 sm:border-4 border-persian-red-500">
              <div className="w-10 h-10 sm:w-16 sm:h-16 mb-2 sm:mb-4 overflow-hidden"><Image src="/targeticon.png" alt="Target" width={120} height={120} className="w-full h-full object-cover scale-125" /></div>
              <h3 className="text-xl sm:text-3xl font-bold mb-1.5 sm:mb-4 text-persian-red-500">
                Daily Practice
              </h3>
              <p className="text-persian-red-700 mb-3 sm:mb-6 text-sm sm:text-lg font-medium">
                Never forget the words you learn, smart repetition helps you remember them for good
              </p>

              <ul className="space-y-1.5 sm:space-y-3 mb-4 sm:mb-8 text-persian-red-800 text-sm sm:text-base">
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-persian-red-500 text-sm sm:text-xl font-bold">
                    ✓
                  </span>
                  <span className="font-medium">
                    Words repeat at the perfect time to stick
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-persian-red-500 text-sm sm:text-xl font-bold">
                    ✓
                  </span>
                  <span className="font-medium">
                    Extra focus on words you find tricky
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-persian-red-500 text-sm sm:text-xl font-bold">
                    ✓
                  </span>
                  <span className="font-medium">
                    Build daily practice streaks 🔥
                  </span>
                </li>
                <li className="flex items-start gap-2 sm:gap-3">
                  <span className="text-persian-red-500 text-sm sm:text-xl font-bold">
                    ✓
                  </span>
                  <span className="font-medium">
                    Track your progress with XP
                  </span>
                </li>
              </ul>

              <Link
                href="/dashboard/practice"
                className="block w-full py-2 sm:py-3 bg-persian-red-500 text-white rounded-xl hover:bg-persian-red-600 transition-colors text-center font-bold text-sm sm:text-lg shadow-lg"
              >
                Start Practicing <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Persian Alphabet Section */}
      <section className="py-20 bg-persian-beige-200 dark:bg-[#654321] transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 text-persian-red-500">
            Persian Alphabet
          </h2>
          <p className="text-persian-red-700 dark:text-persian-beige-200 mb-8 text-lg font-medium max-w-2xl mx-auto">
            Learn all 32 Persian letters so you can read and recognize Farsi words on your own
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard/alphabet"
              className="px-8 py-4 bg-persian-gold-500 text-white rounded-xl hover:bg-persian-gold-600 transition-all shadow-xl hover:shadow-2xl text-lg font-bold hover:scale-105 transform"
            >
              <span className="inline-block w-6 h-6 overflow-hidden align-middle mr-2"><Image src="/bookicon.png" alt="Book" width={40} height={40} className="w-full h-full object-cover scale-125" /></span>
              View All Letters
            </Link>
            <Link
              href="/dashboard/alphabet/practice"
              className="px-8 py-4 bg-persian-red-500 text-white rounded-xl hover:bg-persian-red-600 transition-all shadow-xl hover:shadow-2xl text-lg font-bold hover:scale-105 transform"
            >
              <span className="inline-block w-6 h-6 overflow-hidden align-middle mr-2"><Image src="/pencilicon.png" alt="Pencil" width={40} height={40} className="w-full h-full object-cover scale-125" /></span>
              Practice Alphabet
            </Link>
          </div>
        </div>
      </section>

      {/* About / Story Section */}
      <section className="py-12 bg-persian-beige-100 dark:bg-[#543210] transition-colors">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-persian-red-500">
            Our Story
          </h2>

          <div className="bg-white dark:bg-persian-beige-800 rounded-2xl p-5 md:p-6 shadow-xl group persian-border">
            <div className="flex flex-col items-center gap-4">
              {/* Photo + Contact annotation */}
              <div className="relative inline-block">
                <Link href="/contact" className="block">
                  <Image
                    src="/ProfileFotoTVW.JPG"
                    alt="Thomas van Welsenes"
                    width={100}
                    height={100}
                    className="rounded-full border-4 border-persian-red-500 shadow-lg object-cover w-[100px] h-[100px] transition-transform duration-300 hover:scale-110"
                  />
                </Link>
                {/* Hand-drawn arrow pointing left toward photo */}
                <div className="absolute top-1/2 left-full -translate-y-1/2 ml-3 flex items-center gap-1 pointer-events-none">
                  <svg width="28" height="24" viewBox="0 0 28 24" fill="none" className="text-persian-gold-500 flex-shrink-0">
                    <path d="M26 16C20 12 14 8 4 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M8 6L3 10L8 14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className={`${caveat.className} text-persian-gold-500 font-bold text-lg whitespace-nowrap`} style={{ transform: "rotate(-3deg)" }}>
                    Contact me!
                  </span>
                </div>
              </div>

              {/* Story */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-persian-red-600 dark:text-persian-gold-400 mb-3">
                  Hi, I&apos;m Thomas<span className="inline-block group-hover:animate-wave">👋</span>!
                </h3>
                <div className="space-y-2.5 text-persian-red-800 dark:text-persian-beige-200 leading-relaxed text-xs sm:text-sm">
                  <p>
                    Born in Scotland 🏴󠁧󠁢󠁳󠁣󠁴󠁿 and raised in the Netherlands 🇳🇱, I have
                    always been drawn to different cultures, languages, and
                    traditions. Persian culture was completely unfamiliar to me,
                    until I met my Persian partner in Amsterdam.
                  </p>
                  <p>
                    Through her, I discovered incredible dishes, unique customs
                    like ta&apos;arof, and the warmth that defines Persian
                    hospitality. That experience sparked a deeper curiosity to
                    further engage with the culture.
                  </p>
                  <p>
                    When I decided to learn Farsi, I quickly realized that it
                    was hard to find free and accessible Farsi lesson, popular
                    platforms like Duolingo don&apos;t even offer Farsi courses!
                    That gap inspired me to create
                    <span className="font-bold text-persian-red-500">
                      {" "}
                      Learn Farsi <img src="/persianflag2.webp" alt="Persian Flag" width={16} height={9} className="inline-block align-middle ml-1 rounded-sm" style={{ imageRendering: "-webkit-optimize-contrast" }} decoding="sync" />
                    </span>
                    , a simple, accessible way for anyone to learn daily Farsi
                    words and immerse themselves in the beauty of Persian
                    language and culture.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Connect With a Teacher Section */}
      <section className="py-10 bg-persian-beige-200 dark:bg-[#654321] transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-persian-gold-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide mb-2">Coming Soon</span>
          <h2 className="text-2xl md:text-3xl font-bold text-persian-red-500 mb-2">
            Connect with a Teacher
          </h2>
          <p className="text-persian-red-700 dark:text-persian-beige-200 text-base font-semibold mb-2">
            Take your Farsi to the next level.
          </p>
          <p className="text-persian-red-700 dark:text-persian-beige-200 mb-5 text-sm font-medium max-w-2xl mx-auto">
            Get personalized guidance from native Farsi speakers and experienced teachers. Whether you need help with pronunciation, grammar, or conversation practice, a dedicated teacher can accelerate your learning journey.
          </p>
          <p className="text-persian-red-600 dark:text-persian-beige-300 text-sm mb-5">
            Are you a Farsi teacher or native speaker? We&apos;d love to
            collaborate with you!
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-persian-red-500 hover:bg-persian-red-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span className="text-base">✉️</span>
            <span>Want to Contribute? Get in Touch</span>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 bg-persian-red-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
            {isLoggedIn ? "Keep Learning New Words" : "Start Learning Farsi Words Today"}
          </h2>
          <p className="text-base text-white mb-5 font-medium">
            {isLoggedIn
              ? "Pick up where you left off, every word counts!"
              : "Learn new Farsi words every day and remember them with smart practice"}
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-3 bg-persian-beige-200 text-persian-red-500 rounded-xl hover:bg-white transition-all text-base font-bold shadow-2xl hover:scale-105 transform border-2 border-white"
          >
            {isLoggedIn ? "Back to Learning" : "Get Started Free"} <span className="btn-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
