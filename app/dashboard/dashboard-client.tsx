"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getNextLessonId, getCompletedLessonIds } from "@/lib/lesson-progress";
import { getUserStats } from "@/lib/user-stats";

interface Lesson {
  id: string;
  title: string;
  sortOrder: number;
}

export default function DashboardClient() {
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const [lessonsCompleted, setLessonsCompleted] = useState(0);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Fetch all lessons
        const response = await fetch("/api/lessons");
        const data = await response.json();
        const allLessons: Lesson[] = data.lessons || [];

        // Get progress from localStorage
        const completedIds = getCompletedLessonIds();
        const nextId = getNextLessonId(allLessons);
        const stats = getUserStats();

        setNextLessonId(nextId);
        setLessonsCompleted(completedIds.length);
        setUserStats(stats);
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
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-persian-red-500 mb-2">
          Welcome to Learn Farsi!
        </h2>
        <p className="text-persian-red-700 font-medium">
          Continue your Farsi learning journey
        </p>
      </div>

      {/* Progress Stats */}
      {!loading && userStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border-3 border-persian-red-500 rounded-lg p-6 shadow-xl">
            <div className="text-3xl mb-2">🔥</div>
            <div className="text-2xl font-bold text-persian-red-500">
              {userStats.currentStreak}
            </div>
            <div className="text-sm text-persian-red-700 font-semibold">Day Streak</div>
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
                View All Letters
              </Link>
              <Link
                href="/dashboard/alphabet/practice"
                className="inline-flex items-center px-6 py-3 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-bold shadow-lg hover:shadow-xl"
              >
                Practice Alphabet
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
