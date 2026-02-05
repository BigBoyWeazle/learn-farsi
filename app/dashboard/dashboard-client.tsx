"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { getNextLessonId, getCompletedLessonIds } from "@/lib/lesson-progress";
import { getCurrentLevel, getNextLevel, getLevelProgress, getXPToNextLevel } from "@/lib/levels";

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

export default function DashboardClient() {
  const { data: session } = useSession();
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Fetch all lessons
        const lessonsResponse = await fetch("/api/lessons");
        const lessonsData = await lessonsResponse.json();
        const allLessons: Lesson[] = lessonsData.lessons || [];

        // Get progress from localStorage (for now - can be migrated to DB later)
        const completedIds = getCompletedLessonIds();
        const nextId = getNextLessonId(allLessons);

        // Fetch user stats from API (stored in database per user)
        const statsResponse = await fetch("/api/user/stats");
        if (statsResponse.ok) {
          const stats = await statsResponse.json();
          setUserStats(stats);
        }

        setNextLessonId(nextId);
        setLessonsCompleted(completedIds.length);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Beta Banner */}
      <div className="bg-persian-gold-100 border-2 border-persian-gold-400 rounded-lg px-4 py-3 flex items-center gap-3">
        <span className="bg-persian-gold-500 text-white text-xs font-bold px-2 py-1 rounded">BETA</span>
        <p className="text-persian-gold-800 text-sm font-medium">
          Learn Farsi is currently in beta. We&apos;re actively adding new content and features. <Link href="/contact" className="underline hover:text-persian-gold-900">Share your feedback!</Link>
        </p>
      </div>

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

      {/* Lessons / Grammar Toggle */}
      <div className="flex gap-4">
        <Link
          href="/dashboard/lessons"
          className="flex-1 bg-persian-red-500 hover:bg-persian-red-600 text-white rounded-xl p-6 shadow-lg transition-all hover:shadow-xl border-3 border-persian-red-700"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">📚</span>
            <div>
              <h3 className="text-xl font-bold">Vocabulary Lessons</h3>
              <p className="text-persian-beige-200 text-sm">Learn new words and phrases</p>
            </div>
          </div>
        </Link>
        <Link
          href="/dashboard/grammar"
          className="flex-1 bg-persian-gold-500 hover:bg-persian-gold-600 text-white rounded-xl p-6 shadow-lg transition-all hover:shadow-xl border-3 border-persian-gold-700"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl">📖</span>
            <div>
              <h3 className="text-xl font-bold">Grammar Lessons</h3>
              <p className="text-persian-gold-100 text-sm">Master Farsi grammar rules</p>
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
          <div className="bg-gradient-to-r from-persian-red-500 to-persian-red-600 rounded-2xl shadow-xl p-6 text-white border-4 border-persian-red-700">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {/* Current Title */}
              <div className="flex-1">
                <div className="text-sm font-medium text-persian-beige-200 mb-1">Your Title</div>
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-3xl font-bold">{currentLevel.title}</span>
                  <span className="text-xl text-persian-beige-200">Level {currentLevel.level}</span>
                </div>
                <div className="text-2xl font-bold text-persian-gold-300" dir="rtl">
                  {currentLevel.titlePersian}
                </div>
                <div className="text-sm text-persian-beige-200 italic">
                  {currentLevel.titlePhonetic}
                </div>
              </div>

              {/* Progress to Next Level */}
              {nextLevel && (
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">Progress to {nextLevel.title}</span>
                    <span className="font-bold">{xpToNext} XP to go</span>
                  </div>
                  <div className="h-4 bg-persian-red-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-persian-gold-400 to-persian-gold-500 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-persian-beige-200">
                    <span>{currentLevel.xpRequired} XP</span>
                    <span>{nextLevel.xpRequired} XP</span>
                  </div>
                </div>
              )}

              {/* Max Level Badge */}
              {!nextLevel && (
                <div className="flex-1 text-center">
                  <div className="text-4xl mb-2">👑</div>
                  <div className="text-lg font-bold text-persian-gold-300">Maximum Level Achieved!</div>
                  <div className="text-sm text-persian-beige-200">You are a true master of Farsi</div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Progress Stats - Now with 4 cards including Record Streak */}
      {!loading && userStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border-3 border-persian-red-500 rounded-lg p-6 shadow-xl">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-persian-red-500">
              {userStats.currentStreak}
            </div>
            <div className="text-sm text-persian-red-700 font-semibold">Current Streak</div>
          </div>
          <div className="bg-white border-3 border-persian-gold-500 rounded-lg p-6 shadow-xl">
            <div className="text-3xl mb-2">🏆</div>
            <div className="text-2xl font-bold text-persian-gold-600">
              {userStats.longestStreak}
            </div>
            <div className="text-sm text-persian-gold-700 font-semibold">Record Streak</div>
          </div>
          <div className="bg-white border-3 border-[#4aa6a6] rounded-lg p-6 shadow-xl">
            <div className="text-3xl mb-2">✅</div>
            <div className="text-2xl font-bold text-[#4aa6a6]">
              {lessonsCompleted}
            </div>
            <div className="text-sm text-[#3d8a8a] font-semibold">Lessons Completed</div>
          </div>
          <div className="bg-white border-3 border-persian-red-500 rounded-lg p-6 shadow-xl">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold text-persian-red-500">
              {userStats.totalXP}
            </div>
            <div className="text-sm text-persian-red-700 font-semibold">Total XP</div>
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
                <span className="mr-2">📚</span>
                Continue Next Lesson
              </Link>
            </div>
            <div className="hidden md:block text-8xl">📖</div>
          </div>
        </div>
      )}

      {/* All Lessons Link */}
      <div className="bg-white border-3 border-persian-red-500 rounded-lg p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-persian-red-500 mb-1">
              Browse All Lessons
            </h3>
            <p className="text-sm text-persian-red-700 font-medium">
              View your progress and access all available lessons
            </p>
          </div>
          <Link
            href="/dashboard/lessons"
            className="px-6 py-3 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-bold shadow-md"
          >
            View Lessons <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>

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
              <span className="mr-2">🎯</span>
              Start Daily Practice
            </Link>
          </div>
          <div className="hidden md:block text-8xl">🎯</div>
        </div>
      </div>

      {/* Alphabet Section */}
      <div className="bg-white border-3 border-persian-gold-500 rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2 text-persian-red-500">
              Persian Alphabet
            </h3>
            <p className="text-persian-red-700 mb-4 font-medium">
              Learn all 32 letters of the Persian alphabet with interactive practice
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/dashboard/alphabet"
                className="inline-flex items-center px-6 py-3 bg-persian-gold-500 text-white rounded-lg hover:bg-persian-gold-600 transition-colors font-bold shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">📖</span>
                View All Letters
              </Link>
              <Link
                href="/dashboard/alphabet/practice"
                className="inline-flex items-center px-6 py-3 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-bold shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">✏️</span>
                Practice Alphabet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
