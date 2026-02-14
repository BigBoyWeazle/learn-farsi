"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { getNextLessonId } from "@/lib/lesson-progress";
import { getCurrentLevel, getNextLevel, getLevelProgress, getXPToNextLevel } from "@/lib/levels";
import { Caveat } from "next/font/google";

const caveat = Caveat({ subsets: ["latin"] });

interface Lesson {
  id: string;
  title: string;
  sortOrder: number;
}

interface UserStats {
  currentLevel: number;
  totalWordsLearned: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: string | null;
  totalXP: number;
}

interface ActivityCounts {
  vocabCompleted: number;
  grammarCompleted: number;
  practiceSessionsCompleted: number;
  totalActivities: number;
}

export default function DashboardClient() {
  const { data: session } = useSession();
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const [activity, setActivity] = useState<ActivityCounts | null>(null);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const isGuest = !session?.user;

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Always fetch lessons (public API)
        const lessonsRes = await fetch("/api/lessons");
        const lessonsData = await lessonsRes.json();
        const allLessons: Lesson[] = lessonsData.lessons || [];
        const nextId = getNextLessonId(allLessons);
        setNextLessonId(nextId);

        // Only fetch user-specific data if logged in
        if (!isGuest) {
          const [statsRes, activityRes] = await Promise.all([
            fetch("/api/user/stats"),
            fetch("/api/user/activity"),
          ]);

          if (statsRes.ok) {
            const stats = await statsRes.json();
            setUserStats(stats);
          }

          if (activityRes.ok) {
            const activityData = await activityRes.json();
            setActivity(activityData);
          }
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [isGuest]);

  return (
    <div className="space-y-8">
      {/* Beta Banner */}
      <div className="bg-persian-gold-100 border-2 border-persian-gold-400 rounded-lg px-4 py-3 flex items-center gap-3">
        <span className="bg-persian-gold-500 text-white text-xs font-bold px-2 py-1 rounded">BETA</span>
        <p className="text-persian-gold-800 text-sm font-medium">
          Learn Farsi is currently in beta. We&apos;re actively adding new content and features. <Link href="/contact" className="underline hover:text-persian-gold-900">Share your feedback!</Link>
        </p>
      </div>

      {/* Guest Sign-In Banner */}
      {isGuest && (
        <div className="bg-gradient-to-r from-persian-red-500 to-persian-red-600 text-white rounded-2xl px-6 py-5 shadow-xl border-3 border-persian-red-700">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold mb-1">Save your progress!</h3>
              <p className="text-persian-beige-200 text-sm">
                Sign in to track your streaks, earn XP, level up, and keep your progress across devices.
              </p>
            </div>
            <div className="flex-shrink-0 flex flex-col items-center sm:items-end gap-2">
              <Link
                href="/login"
                className="px-6 py-2.5 bg-white text-persian-red-500 rounded-lg font-bold text-sm hover:bg-persian-beige-100 transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform"
              >
                Sign In Free
              </Link>
              {/* Hand-drawn arrow annotation */}
              <div className="flex items-center gap-1">
                <svg width="28" height="24" viewBox="0 0 28 24" fill="none" className="text-persian-gold-300 flex-shrink-0">
                  <path d="M4 20C6 14 12 8 20 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M16 2L21 3L18 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className={`${caveat.className} text-persian-gold-300 text-lg whitespace-nowrap`} style={{ transform: "rotate(-2deg)" }}>
                  Sign up & help us grow!
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Header */}
      <div>
        {session?.user?.name && (
          <p className="text-xl text-persian-red-700 font-semibold mb-1">
            Hi {session.user.name.split(" ")[0]}! 👋
          </p>
        )}
        <h2 className="text-2xl font-bold text-persian-red-500 mb-2">
          Welcome to Learn Farsi!
        </h2>
        <p className="text-persian-red-700 font-medium">
          Learn Farsi step-by-step with structured lessons.
        </p>
      </div>

      {/* Lessons / Grammar / Alphabet */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/dashboard/lessons"
          className="bg-persian-red-500 hover:bg-persian-red-600 text-white rounded-xl p-6 shadow-lg transition-all hover:shadow-xl border-3 border-persian-red-700"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 overflow-hidden flex-shrink-0"><Image src="/multiplebooks_icon.png" alt="Books" width={80} height={80} className="w-full h-full object-cover scale-125" /></div>
            <div>
              <h3 className="text-xl font-bold">Vocabulary</h3>
              <p className="text-persian-beige-200 text-sm">Learn new words and phrases</p>
            </div>
          </div>
        </Link>
        <Link
          href="/dashboard/grammar"
          className="bg-persian-gold-500 hover:bg-persian-gold-600 text-white rounded-xl p-6 shadow-lg transition-all hover:shadow-xl border-3 border-persian-gold-700"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 overflow-hidden flex-shrink-0"><Image src="/bookicon.png" alt="Book" width={80} height={80} className="w-full h-full object-cover scale-125" /></div>
            <div>
              <h3 className="text-xl font-bold">Grammar</h3>
              <p className="text-persian-gold-100 text-sm">Master Farsi grammar rules</p>
            </div>
          </div>
        </Link>
        <Link
          href="/dashboard/alphabet"
          className="bg-[#4aa6a6] hover:bg-[#3d8a8a] text-white rounded-xl p-6 shadow-lg transition-all hover:shadow-xl border-3 border-[#3d8a8a]"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 overflow-hidden flex-shrink-0"><Image src="/pencilicon.png" alt="Alphabet" width={80} height={80} className="w-full h-full object-cover scale-125" /></div>
            <div>
              <h3 className="text-xl font-bold">Alphabet</h3>
              <p className="text-teal-100 text-sm">Learn all 32 Persian letters</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Persian Title & Level Progress */}
      {!loading && userStats && (() => {
        const currentLevel = getCurrentLevel(userStats.totalXP);
        const nextLevel = getNextLevel(userStats.totalXP);
        const progress = getLevelProgress(userStats.totalXP);
        const xpToNext = getXPToNextLevel(userStats.totalXP);

        return (
          <div className="bg-gradient-to-r from-persian-red-500 to-persian-red-600 rounded-xl shadow-xl p-3 sm:p-4 text-white border-3 border-persian-red-700">
            <div className="flex flex-col md:flex-row md:items-center gap-3 sm:gap-4">
              {/* Current Title */}
              <div className="flex-1">
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-lg sm:text-2xl font-bold">{currentLevel.title}</span>
                  <span className="text-sm sm:text-base text-persian-beige-200">Lv. {currentLevel.level}</span>
                  <span className="text-base sm:text-lg font-bold text-persian-gold-300" dir="rtl">{currentLevel.titlePersian}</span>
                </div>
                <div className="text-xs text-persian-beige-200 italic">
                  {currentLevel.titlePhonetic}
                </div>
              </div>

              {/* Progress to Next Level */}
              {nextLevel && (
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">Next: {nextLevel.title}</span>
                    <span className="font-bold">{xpToNext} XP to go</span>
                  </div>
                  <div className="h-2.5 sm:h-3 bg-persian-red-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-persian-gold-400 to-persian-gold-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-0.5 text-persian-beige-200">
                    <span>{currentLevel.xpRequired} XP</span>
                    <span>{nextLevel.xpRequired} XP</span>
                  </div>
                </div>
              )}

              {/* Max Level Badge */}
              {!nextLevel && (
                <div className="flex-1 flex items-center justify-center gap-2">
                  <span className="text-2xl">👑</span>
                  <div>
                    <div className="text-sm font-bold text-persian-gold-300">Maximum Level!</div>
                    <div className="text-xs text-persian-beige-200">True master of Farsi</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Progress Stats - 4 compact cards */}
      {!loading && userStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
          <div className="bg-white border-2 border-persian-red-500 rounded-lg p-2.5 sm:p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl">🔥</span>
              <div>
                <div className="text-lg sm:text-xl font-bold text-persian-red-500 leading-tight">
                  {userStats.currentStreak}
                </div>
                <div className="text-xs text-persian-red-700 font-semibold">Streak</div>
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-persian-gold-500 rounded-lg p-2.5 sm:p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl">🏆</span>
              <div>
                <div className="text-lg sm:text-xl font-bold text-persian-gold-600 leading-tight">
                  {userStats.longestStreak}
                </div>
                <div className="text-xs text-persian-gold-700 font-semibold">Record Streak</div>
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-[#4aa6a6] rounded-lg p-2.5 sm:p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl">✅</span>
              <div>
                <div className="text-lg sm:text-xl font-bold text-[#4aa6a6] leading-tight">
                  {activity?.totalActivities ?? 0}
                </div>
                <div className="text-xs text-[#3d8a8a] font-semibold">Completed</div>
              </div>
            </div>
          </div>
          <div className="bg-white border-2 border-persian-red-500 rounded-lg p-2.5 sm:p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl">⭐</span>
              <div>
                <div className="text-lg sm:text-xl font-bold text-persian-red-500 leading-tight">
                  {userStats.totalXP}
                </div>
                <div className="text-xs text-persian-red-700 font-semibold">Total XP</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lessons CTA */}
      {!loading && nextLessonId && (
        <div className="bg-persian-red-500 rounded-2xl shadow-xl p-8 text-white border-4 border-persian-red-700">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">
                Continue Learning
              </h3>
              <p className="text-white mb-4">
                Pick up where you left off with structured lessons
              </p>
              <Link
                href={`/dashboard/lessons/${nextLessonId}`}
                className="inline-flex items-center px-6 py-3 bg-persian-beige-200 text-persian-red-500 rounded-lg hover:bg-white transition-colors font-bold shadow-lg hover:shadow-xl"
              >
                <span className="inline-block w-6 h-6 overflow-hidden align-middle mr-2"><Image src="/multiplebooks_icon.png" alt="Books" width={40} height={40} className="w-full h-full object-cover scale-125" /></span>
                Continue Next Lesson
              </Link>
            </div>
            <div className="hidden md:block w-24 h-24 overflow-hidden"><Image src="/bookicon.png" alt="Book" width={160} height={160} className="w-full h-full object-cover scale-125" /></div>
          </div>
        </div>
      )}

      {/* Practice CTA */}
      <div className="bg-persian-beige-200 rounded-2xl shadow-xl p-8 border-4 border-persian-red-500">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2 text-persian-red-500">
              Daily Practice
            </h3>
            <p className="text-persian-red-700 mb-4 font-medium">
              Review words with spaced repetition to boost retention
            </p>
            <Link
              href="/dashboard/practice"
              className="inline-flex items-center px-6 py-3 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-bold shadow-lg hover:shadow-xl"
            >
              <span className="inline-block w-6 h-6 overflow-hidden align-middle mr-2"><Image src="/targeticon.png" alt="Target" width={40} height={40} className="w-full h-full object-cover scale-125" /></span>
              Start Daily Practice
            </Link>
          </div>
          <div className="hidden md:block w-24 h-24 overflow-hidden"><Image src="/targeticon.png" alt="Target" width={160} height={160} className="w-full h-full object-cover scale-125" /></div>
        </div>
      </div>

    </div>
  );
}
