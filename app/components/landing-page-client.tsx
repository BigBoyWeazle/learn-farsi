"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./theme-toggle";
import { ThemeProvider } from "./theme-provider";

function LandingContent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-persian-beige-50 via-white to-persian-red-50 dark:from-persian-beige-900 dark:via-persian-beige-800 dark:to-persian-red-900 bg-persian-pattern transition-colors">
      {/* Navigation */}
      <nav className="bg-persian-beige-50/90 dark:bg-persian-beige-900/90 backdrop-blur-sm border-b border-persian-red-200 dark:border-persian-red-700 sticky top-0 z-50 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-2xl sm:text-3xl">🇮🇷</div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-persian-red-600 to-persian-red-800 bg-clip-text text-transparent">
                Farsi Vocabulary
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <ThemeToggle />
              <Link
                href="/dashboard"
                className="px-4 sm:px-6 py-2 bg-persian-red-600 text-white rounded-lg hover:bg-persian-red-700 transition-all shadow-md hover:shadow-lg font-semibold text-sm sm:text-base"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 flex justify-center gap-4 text-6xl">
            <span className="animate-bounce">🌟</span>
            <span className="animate-bounce inline-block w-14 h-14 overflow-hidden" style={{animationDelay: '0.1s'}}><Image src="/multiplebooks_icon.png" alt="Books" width={80} height={80} className="w-full h-full object-cover scale-125" /></span>
            <span className="animate-bounce" style={{animationDelay: '0.2s'}}>✨</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-persian-red-600 via-persian-red-700 to-persian-gold-600 bg-clip-text text-transparent">
              Learn Farsi
            </span>
            <br />
            <span className="text-gray-800 dark:text-persian-beige-100">The Smart Way</span>
          </h1>

          <p className="text-xl md:text-2xl text-persian-beige-800 dark:text-persian-beige-200 mb-12 max-w-3xl mx-auto">
            Master Persian vocabulary through <span className="text-persian-red-600 dark:text-persian-red-400 font-semibold">structured lessons</span> and <span className="text-persian-red-600 dark:text-persian-red-400 font-semibold">daily practice</span> — completely free!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/dashboard/lessons"
              className="px-8 py-4 bg-persian-red-600 text-white rounded-xl hover:bg-persian-red-700 transition-all shadow-xl hover:shadow-2xl text-lg font-bold hover:scale-105 transform"
            >
              Start Learning <span className="btn-arrow">→</span>
            </Link>
            <Link
              href="/dashboard/practice"
              className="px-8 py-4 bg-white dark:bg-persian-beige-800 text-persian-red-600 dark:text-persian-red-400 border-2 border-persian-red-600 dark:border-persian-red-400 rounded-xl hover:bg-persian-red-50 dark:hover:bg-persian-beige-700 transition-all shadow-lg text-lg font-bold"
            >
              Try Practice Mode
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/90 dark:bg-persian-beige-800/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-persian-red-200 dark:border-persian-red-700 shadow-lg transition-colors">
              <div className="w-12 h-12 mx-auto mb-2 overflow-hidden"><Image src="/multiplebooks_icon.png" alt="Books" width={80} height={80} className="w-full h-full object-cover scale-125" /></div>
              <div className="text-3xl font-bold text-persian-red-600 dark:text-persian-red-400">7</div>
              <div className="text-persian-beige-800 dark:text-persian-beige-200 font-medium">Structured Lessons</div>
            </div>
            <div className="bg-white/90 dark:bg-persian-beige-800/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-persian-beige-300 dark:border-persian-beige-600 shadow-lg transition-colors">
              <div className="w-12 h-12 mx-auto mb-2 overflow-hidden"><Image src="/targeticon.png" alt="Target" width={80} height={80} className="w-full h-full object-cover scale-125" /></div>
              <div className="text-3xl font-bold text-persian-red-600 dark:text-persian-red-400">Free</div>
              <div className="text-persian-beige-800 dark:text-persian-beige-200 font-medium">Forever</div>
            </div>
            <div className="bg-white/90 dark:bg-persian-beige-800/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-persian-red-200 dark:border-persian-red-700 shadow-lg transition-colors">
              <div className="w-12 h-12 mx-auto mb-2 overflow-hidden"><Image src="/fireicon.png" alt="Fire" width={80} height={80} className="w-full h-full object-cover scale-125" /></div>
              <div className="text-3xl font-bold text-persian-red-600 dark:text-persian-red-400">Daily</div>
              <div className="text-persian-beige-800 dark:text-persian-beige-200 font-medium">Practice Streaks</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-persian-beige-50/50 dark:bg-persian-beige-900/30 backdrop-blur-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4 text-persian-red-700 dark:text-persian-red-400">
            Two Ways to Learn
          </h2>
          <p className="text-center text-persian-beige-800 dark:text-persian-beige-200 mb-16 text-lg">
            Choose the learning style that works best for you
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Structured Lessons */}
            <div className="bg-gradient-to-br from-persian-red-500 to-persian-red-700 rounded-3xl p-8 text-white shadow-2xl hover:scale-105 transition-transform">
              <div className="w-16 h-16 mb-4 overflow-hidden"><Image src="/bookicon.png" alt="Book" width={120} height={120} className="w-full h-full object-cover scale-125" /></div>
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
                href="/dashboard/lessons"
                className="block w-full py-3 bg-white text-persian-red-600 rounded-xl hover:bg-persian-red-50 transition-colors text-center font-bold text-lg shadow-lg"
              >
                Browse Lessons <span className="btn-arrow">→</span>
              </Link>
            </div>

            {/* Daily Practice */}
            <div className="bg-gradient-to-br from-persian-beige-400 to-persian-beige-600 rounded-3xl p-8 text-white shadow-2xl hover:scale-105 transition-transform">
              <div className="w-16 h-16 mb-4 overflow-hidden"><Image src="/targeticon.png" alt="Target" width={120} height={120} className="w-full h-full object-cover scale-125" /></div>
              <h3 className="text-3xl font-bold mb-4">Daily Practice</h3>
              <p className="text-persian-beige-100 mb-6 text-lg">
                Smart spaced repetition keeps vocabulary fresh in your memory
              </p>

              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-persian-red-200 text-xl">✓</span>
                  <span>Spaced repetition algorithm</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-persian-red-200 text-xl">✓</span>
                  <span>Focus on words you struggle with</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-persian-red-200 text-xl">✓</span>
                  <span>Build daily practice streaks <span className="inline-block w-5 h-5 overflow-hidden align-middle"><Image src="/fireicon.png" alt="Fire" width={40} height={40} className="w-full h-full object-cover scale-125" /></span></span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-persian-red-200 text-xl">✓</span>
                  <span>Track your progress with XP</span>
                </li>
              </ul>

              <Link
                href="/dashboard/practice"
                className="block w-full py-3 bg-white text-persian-beige-700 rounded-xl hover:bg-persian-beige-50 transition-colors text-center font-bold text-lg shadow-lg"
              >
                Start Practicing <span className="btn-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-persian-red-600 to-persian-red-800">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Start Your Farsi Journey Today
          </h2>
          <p className="text-xl text-persian-beige-100 mb-8">
            Join learners mastering Persian vocabulary the smart way
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-12 py-4 bg-persian-beige-50 text-persian-red-700 rounded-xl hover:bg-white transition-all text-xl font-bold shadow-2xl hover:scale-105 transform"
          >
            Get Started Free <span className="btn-arrow">→</span>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-persian-beige-900 dark:bg-persian-beige-950 text-white py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="text-3xl">🇮🇷</div>
            <h3 className="text-2xl font-bold">Farsi Vocabulary</h3>
          </div>
          <p className="text-persian-beige-300 dark:text-persian-beige-400 mb-4">
            Learn Persian vocabulary through structured lessons and daily practice
          </p>
          <p className="text-persian-beige-400 dark:text-persian-beige-500 text-sm">
            © 2026 Farsi Vocabulary. Built with ❤️ for language learners.
          </p>
        </div>
      </footer>
    </div>
  );
}

export function LandingPageClient() {
  return (
    <ThemeProvider>
      <LandingContent />
    </ThemeProvider>
  );
}
