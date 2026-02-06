import Link from "next/link";
import Image from "next/image";
import { Footer } from "@/components/footer";
import { auth } from "@/auth";
import { db } from "@/db";
import { lessons } from "@/db/schema";
import { eq, count } from "drizzle-orm";

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

  return (
    <div className="min-h-screen bg-persian-beige-200 dark:bg-[#654321] transition-colors">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <Image
              src="/pomegranate.png"
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

          <p className="text-xl md:text-2xl text-persian-red-800 dark:text-persian-beige-200 mb-12 max-w-3xl mx-auto font-medium">
            Master Persian vocabulary through{" "}
            <span className="text-persian-red-500 font-bold">
              structured lessons
            </span>{" "}
            and{" "}
            <span className="text-persian-red-500 font-bold">
              daily practice
            </span>{" "}
            — completely free!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href={isLoggedIn ? "/dashboard/lessons" : "/login"}
              className="px-8 py-4 bg-persian-red-500 text-white rounded-xl hover:bg-persian-red-600 transition-all shadow-xl hover:shadow-2xl text-lg font-bold hover:scale-105 transform"
            >
              {isLoggedIn ? "Continue Learning" : "Start Learning"} <span className="btn-arrow">→</span>
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard/practice" : "/login"}
              className="px-8 py-4 bg-white dark:bg-persian-beige-800 text-persian-red-500 dark:text-persian-red-400 border-3 border-persian-red-500 dark:border-persian-red-400 rounded-xl hover:bg-persian-beige-100 dark:hover:bg-persian-beige-700 transition-all shadow-lg text-lg font-bold"
            >
              {isLoggedIn ? "Practice Mode" : "Try Practice Mode"}
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-persian-beige-800 rounded-2xl p-6 border-3 border-persian-red-500 dark:border-persian-red-700 shadow-xl transition-all hover:shadow-2xl hover:scale-105">
              <div className="text-4xl mb-2">📚</div>
              <div className="text-3xl font-bold text-persian-red-500">{lessonCount}</div>
              <div className="text-persian-red-700 dark:text-persian-beige-200 font-semibold">
                Structured Lessons
              </div>
            </div>
            <div className="bg-white dark:bg-persian-beige-800 rounded-2xl p-6 border-3 border-persian-red-500 dark:border-persian-beige-600 shadow-xl transition-all hover:shadow-2xl hover:scale-105">
              <div className="text-4xl mb-2">🎯</div>
              <div className="text-3xl font-bold text-persian-red-500">
                Free
              </div>
              <div className="text-persian-red-700 dark:text-persian-beige-200 font-semibold">
                Forever
              </div>
            </div>
            <div className="bg-white dark:bg-persian-beige-800 rounded-2xl p-6 border-3 border-persian-red-500 dark:border-persian-red-700 shadow-xl transition-all hover:shadow-2xl hover:scale-105">
              <div className="text-4xl mb-2">🔥</div>
              <div className="text-3xl font-bold text-persian-red-500">
                Daily
              </div>
              <div className="text-persian-red-700 dark:text-persian-beige-200 font-semibold">
                Practice Streaks
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-persian-beige-100 dark:bg-[#654321] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-persian-red-500">
            Two Ways to Learn
          </h2>
          <p className="text-center text-persian-red-700 dark:text-persian-beige-200 mb-16 text-lg font-medium">
            Choose the learning style that works best for you
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Structured Lessons */}
            <div className="bg-persian-red-500 rounded-3xl p-8 text-white shadow-2xl hover:scale-105 transition-transform border-4 border-persian-red-700">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="text-3xl font-bold mb-4">Structured Lessons</h3>
              <p className="text-persian-red-100 mb-6 text-lg">
                Follow a curated curriculum from beginner to advanced
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-persian-gold-300 text-xl">✓</span>
                  <span>Progressive difficulty levels</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-persian-gold-300 text-xl">✓</span>
                  <span>Organized by themes (greetings, food, family)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-persian-gold-300 text-xl">✓</span>
                  <span>Unlock lessons as you progress</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-persian-gold-300 text-xl">✓</span>
                  <span>80% mastery to advance</span>
                </li>
              </ul>

              <Link
                href={isLoggedIn ? "/dashboard/lessons" : "/login"}
                className="block w-full py-3 bg-white text-persian-red-500 rounded-xl hover:bg-persian-beige-100 transition-colors text-center font-bold text-lg shadow-lg"
              >
                Browse Lessons <span className="btn-arrow">→</span>
              </Link>
            </div>

            {/* Daily Practice */}
            <div className="bg-persian-beige-200 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-transform border-4 border-persian-red-500">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-3xl font-bold mb-4 text-persian-red-500">
                Daily Practice
              </h3>
              <p className="text-persian-red-700 mb-6 text-lg font-medium">
                Smart spaced repetition keeps vocabulary fresh in your memory
              </p>

              <ul className="space-y-3 mb-8 text-persian-red-800">
                <li className="flex items-start gap-3">
                  <span className="text-persian-red-500 text-xl font-bold">
                    ✓
                  </span>
                  <span className="font-medium">
                    Spaced repetition algorithm
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-persian-red-500 text-xl font-bold">
                    ✓
                  </span>
                  <span className="font-medium">
                    Focus on words you struggle with
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-persian-red-500 text-xl font-bold">
                    ✓
                  </span>
                  <span className="font-medium">
                    Build daily practice streaks 🔥
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-persian-red-500 text-xl font-bold">
                    ✓
                  </span>
                  <span className="font-medium">
                    Track your progress with XP
                  </span>
                </li>
              </ul>

              <Link
                href={isLoggedIn ? "/dashboard/practice" : "/login"}
                className="block w-full py-3 bg-persian-red-500 text-white rounded-xl hover:bg-persian-red-600 transition-colors text-center font-bold text-lg shadow-lg"
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
            Master the 32 letters of the Persian alphabet with interactive lessons and practice exercises
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={isLoggedIn ? "/dashboard/alphabet" : "/login"}
              className="px-8 py-4 bg-persian-gold-500 text-white rounded-xl hover:bg-persian-gold-600 transition-all shadow-xl hover:shadow-2xl text-lg font-bold hover:scale-105 transform"
            >
              <span className="mr-2">📖</span>
              View All Letters
            </Link>
            <Link
              href={isLoggedIn ? "/dashboard/alphabet/practice" : "/login"}
              className="px-8 py-4 bg-persian-red-500 text-white rounded-xl hover:bg-persian-red-600 transition-all shadow-xl hover:shadow-2xl text-lg font-bold hover:scale-105 transform"
            >
              <span className="mr-2">✏️</span>
              Practice Alphabet
            </Link>
          </div>
        </div>
      </section>

      {/* About / Story Section */}
      <section className="py-20 bg-persian-beige-100 dark:bg-[#543210] transition-colors">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-persian-red-500">
            Our Story
          </h2>

          <div className="bg-white dark:bg-persian-beige-800 rounded-3xl p-6 md:p-8 shadow-xl border-3 border-persian-red-200 dark:border-persian-red-700 group">
            <div className="flex flex-col items-center gap-6">
              {/* Photo */}
              <div className="flex-shrink-0">
                <Image
                  src="/ProfileFotoTVW.JPG"
                  alt="Thomas van Welsenes"
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-persian-red-500 shadow-lg object-cover w-[120px] h-[120px] transition-transform duration-300 hover:scale-110"
                />
              </div>

              {/* Story */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-persian-red-600 dark:text-persian-gold-400 mb-4">
                  Hi, I&apos;m Thomas<span className="inline-block group-hover:animate-wave">👋</span>!
                </h3>
                <div className="space-y-3 text-persian-red-800 dark:text-persian-beige-200 leading-relaxed text-sm">
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
                      🇮🇷 Learn Farsi
                    </span>
                    , a simple, accessible way for anyone to learn daily Farsi
                    words and immerse themselves in the beauty of Persian
                    language and culture.
                  </p>
                </div>

                {/* Buy Me a Coffee Button */}
                <div className="mt-6">
                  <a
                    href="https://buymeacoffee.com/thomasvanwelsenes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-persian-gold-500 hover:bg-persian-gold-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <span className="text-xl">☕</span>
                    <span>Buy Me a Coffee</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teacher Support Section */}
      <section className="py-20 bg-persian-beige-200 dark:bg-[#654321] transition-colors">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 text-persian-red-500">
            Coming Soon: Native Teacher Support
          </h2>
          <p className="text-persian-red-700 dark:text-persian-beige-200 mb-6 text-lg font-medium max-w-2xl mx-auto">
            We&apos;re working on partnering with native Persian speakers and
            experienced Farsi teachers to bring you authentic pronunciation
            guides, cultural insights, and verified content.
          </p>
          <p className="text-persian-red-600 dark:text-persian-beige-300 mb-8">
            Are you a Farsi teacher or native speaker? We&apos;d love to
            collaborate with you!
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-persian-red-500 hover:bg-persian-red-600 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <span className="text-xl">✉️</span>
            <span>Want to Contribute? Get in Touch</span>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-persian-red-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {isLoggedIn ? "Continue Your Farsi Journey" : "Start Your Farsi Journey Today"}
          </h2>
          <p className="text-xl text-white mb-8 font-medium">
            {isLoggedIn
              ? "Pick up where you left off and keep improving!"
              : "Join learners and master Persian easily through daily lessons"}
          </p>
          <Link
            href={isLoggedIn ? "/dashboard" : "/login"}
            className="inline-block px-12 py-4 bg-persian-beige-200 text-persian-red-500 rounded-xl hover:bg-white transition-all text-xl font-bold shadow-2xl hover:scale-105 transform border-3 border-white"
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
