"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface SessionStats {
  total: number;
  easy: number;
  good: number;
  hard: number;
  again: number;
  correct: number;
  incorrect: number;
}

interface StreakUpdate {
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  isNewStreak: boolean;
}

export default function LessonCompletePage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;

  const [stats, setStats] = useState<SessionStats | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isPassed, setIsPassed] = useState(false);
  const [streakUpdate, setStreakUpdate] = useState<StreakUpdate | null>(null);

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem("sessionStats");
    const savedScore = localStorage.getItem("lessonScore");
    const savedLessonId = localStorage.getItem("lessonId");

    // Verify this is the correct lesson (only redirect if there's a mismatch, not if data is missing)
    if (savedLessonId && savedLessonId !== lessonId) {
      router.push(`/dashboard/lessons/${lessonId}`);
      return;
    }

    if (savedStats && savedScore) {
      const parsedStats = JSON.parse(savedStats);
      const parsedScore = parseInt(savedScore, 10);

      setStats(parsedStats);
      setScore(parsedScore);
      setIsPassed(parsedScore >= 80);

      // Clear the session data
      localStorage.removeItem("sessionStats");
      localStorage.removeItem("lessonScore");
      localStorage.removeItem("lessonId");

      // Calculate XP earned (same as practice)
      const xpEarned =
        parsedStats.easy * 5 +
        parsedStats.good * 3 +
        parsedStats.hard * 2 +
        parsedStats.again * 1;

      // Update XP and streak via API
      fetch("/api/user/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xpEarned }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            setStreakUpdate(data);
          }
        })
        .catch((err) => console.error("Error updating stats:", err));
    }
  }, [lessonId, router]);

  if (!stats) {
    return (
      <div className="max-w-2xl mx-auto py-6 sm:py-12 px-2 sm:px-0">
        <div className="bg-white border-3 border-persian-red-500 shadow-2xl rounded-2xl p-5 sm:p-12 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 overflow-hidden"><Image src="/multiplebooks_icon.png" alt="Books" width={100} height={100} className="w-full h-full object-cover scale-125" /></div>
          <h2 className="text-xl sm:text-2xl font-bold text-persian-red-500 mb-3 sm:mb-4">
            No Session Data
          </h2>
          <p className="text-persian-red-700 font-medium mb-4 sm:mb-6 text-sm sm:text-base">
            Complete a lesson practice to see your results here.
          </p>
          <Link
            href={`/dashboard/lessons/${lessonId}`}
            className="inline-block px-6 py-3 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-semibold"
          >
            Back to Lesson
          </Link>
        </div>
      </div>
    );
  }

  const accuracyPercent = stats.total > 0
    ? Math.round((stats.correct / stats.total) * 100)
    : 0;

  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-12 px-2 sm:px-0">
      <div className="bg-white border-3 border-persian-red-500 shadow-2xl rounded-2xl p-5 sm:p-12 text-center">
        {/* Celebration/Try Again Icon */}
        <div className={`text-5xl sm:text-8xl mb-3 sm:mb-6 ${isPassed ? 'animate-bounce' : ''}`}>
          {isPassed ? '🎉' : <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto overflow-hidden"><Image src="/bookicon.png" alt="Book" width={120} height={120} className="w-full h-full object-cover scale-125" /></div>}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-4xl font-bold text-persian-red-500 mb-1 sm:mb-2">
          {isPassed ? 'Lesson Completed!' : 'Keep Practicing!'}
        </h1>
        <p className="text-base sm:text-xl text-persian-red-700 font-medium mb-4 sm:mb-8">
          {isPassed
            ? "Great job! You've mastered this lesson!"
            : 'You need 80% or higher to complete this lesson'}
        </p>

        {/* Score Display */}
        <div className={`rounded-xl p-4 sm:p-8 mb-4 sm:mb-8 ${
          isPassed
            ? 'bg-emerald-50 border-2 border-emerald-500'
            : 'bg-amber-50 border-2 border-amber-500'
        }`}>
          <div className="mb-3 sm:mb-6">
            <div className={`text-4xl sm:text-6xl font-bold mb-1 sm:mb-2 ${
              isPassed ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {score}%
            </div>
            <div className="text-sm sm:text-lg font-semibold text-persian-red-700">
              Your Score
            </div>
          </div>

          {/* Stats */}
          <div className="mb-3 sm:mb-4">
            <div className="text-lg sm:text-2xl font-bold text-persian-red-700 mb-1 sm:mb-2">
              {stats.total} words practiced
            </div>
            <div className="text-base sm:text-lg font-semibold text-persian-red-600">
              {stats.correct} / {stats.total} correct
            </div>
          </div>

          {/* Assessment Breakdown */}
          <div className="flex justify-center gap-3 sm:gap-6 text-xs sm:text-sm">
            {stats.easy > 0 && (
              <span className="text-sky-600 font-bold">
                {stats.easy} Easy
              </span>
            )}
            {stats.good > 0 && (
              <span className="text-emerald-600 font-bold">
                {stats.good} Good
              </span>
            )}
            {stats.hard > 0 && (
              <span className="text-amber-600 font-bold">
                {stats.hard} Hard
              </span>
            )}
            {stats.again > 0 && (
              <span className="text-rose-600 font-bold">
                {stats.again} Again
              </span>
            )}
          </div>

          {/* XP Earned */}
          <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-persian-red-200">
            <div className="text-base sm:text-xl font-bold text-persian-red-500">
              +{stats.easy * 5 + stats.good * 3 + stats.hard * 2 + stats.again * 1} XP earned
            </div>
          </div>
        </div>

        {/* Streak Display */}
        {streakUpdate && (
          <div className="mb-4 sm:mb-8 p-3 sm:p-4 bg-amber-50 rounded-lg border-2 border-amber-400">
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl">🔥</div>
                <div className="text-lg sm:text-2xl font-bold text-amber-700">{streakUpdate.currentStreak}</div>
                <div className="text-xs sm:text-sm text-amber-600 font-medium">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl">🏆</div>
                <div className="text-lg sm:text-2xl font-bold text-amber-700">{streakUpdate.longestStreak}</div>
                <div className="text-xs sm:text-sm text-amber-600 font-medium">Record</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl">⭐</div>
                <div className="text-lg sm:text-2xl font-bold text-amber-700">{streakUpdate.totalXP}</div>
                <div className="text-xs sm:text-sm text-amber-600 font-medium">Total XP</div>
              </div>
            </div>
            {streakUpdate.isNewStreak && (
              <p className="text-amber-700 font-bold text-center mt-2 sm:mt-3 text-sm sm:text-base">
                New streak started! Keep it going! 💪
              </p>
            )}
          </div>
        )}

        {/* Encouragement Message */}
        <div className="mb-4 sm:mb-8">
          {isPassed ? (
            <div>
              <p className="text-persian-red-700 text-base sm:text-lg font-medium mb-1 sm:mb-2">
                Excellent work! You have completed this lesson.
              </p>
              <p className="text-xs sm:text-sm text-persian-red-600">
                You can now move on to the next lesson or review this one anytime.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-persian-red-700 text-base sm:text-lg font-medium mb-1 sm:mb-2">
                You scored {score}%. Try again to reach 80%!
              </p>
              <p className="text-xs sm:text-sm text-persian-red-600">
                Review the words and practice again. You can do it!
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 sm:space-y-4">
          {isPassed ? (
            <>
              <Link
                href="/dashboard/lessons"
                className="block w-full py-3 sm:py-4 px-4 sm:px-6 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Continue to Next Lesson <span className="btn-arrow">→</span>
              </Link>
              <Link
                href={`/dashboard/lessons/${lessonId}`}
                className="block w-full py-2.5 sm:py-3 px-4 sm:px-6 text-persian-red-600 hover:text-persian-red-700 transition-colors text-sm sm:text-base font-medium"
              >
                Review This Lesson
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/dashboard/lessons/${lessonId}`}
                className="block w-full py-3 sm:py-4 px-4 sm:px-6 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-all text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Review & Try Again <span className="btn-arrow">→</span>
              </Link>
              <Link
                href="/dashboard/lessons"
                className="block w-full py-2.5 sm:py-3 px-4 sm:px-6 text-persian-red-600 hover:text-persian-red-700 transition-colors text-sm sm:text-base font-medium"
              >
                Back to Lessons
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
