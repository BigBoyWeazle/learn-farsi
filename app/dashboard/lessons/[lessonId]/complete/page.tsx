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
      <div className="max-w-2xl mx-auto py-4 sm:py-8 px-2 sm:px-0">
        <div className="bg-white border-3 border-persian-red-500 shadow-2xl rounded-2xl p-5 sm:p-8 text-center">
          <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 overflow-hidden"><Image src="/multiplebooks_icon.png" alt="Books" width={100} height={100} className="w-full h-full object-cover scale-125" /></div>
          <h2 className="text-lg sm:text-xl font-bold text-persian-red-500 mb-2 sm:mb-3">
            No Session Data
          </h2>
          <p className="text-persian-red-700 font-medium mb-3 sm:mb-4 text-sm">
            Complete a lesson practice to see your results here.
          </p>
          <Link
            href={`/dashboard/lessons/${lessonId}`}
            className="inline-block px-5 py-2.5 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-semibold text-sm"
          >
            Back to Lesson
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 px-2 sm:px-0">
      <div className="bg-white border-3 border-persian-red-500 shadow-2xl rounded-2xl p-4 sm:p-8 text-center">
        {/* Celebration/Try Again Icon + Title */}
        <div className={`text-4xl sm:text-6xl mb-2 sm:mb-3 ${isPassed ? 'animate-bounce' : ''}`}>
          {isPassed ? '🎉' : <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto overflow-hidden"><Image src="/bookicon.png" alt="Book" width={120} height={120} className="w-full h-full object-cover scale-125" /></div>}
        </div>
        <h1 className="text-xl sm:text-3xl font-bold text-persian-red-500 mb-0.5 sm:mb-1">
          {isPassed ? 'Lesson Completed!' : 'Keep Practicing!'}
        </h1>
        <p className="text-sm sm:text-base text-persian-red-700 font-medium mb-3 sm:mb-5">
          {isPassed
            ? "Great job! You've mastered this lesson!"
            : 'You need 80% or higher to complete this lesson'}
        </p>

        {/* Score Display */}
        <div className={`rounded-xl p-3 sm:p-5 mb-3 sm:mb-5 ${
          isPassed
            ? 'bg-emerald-50 border-2 border-emerald-500'
            : 'bg-amber-50 border-2 border-amber-500'
        }`}>
          {/* Score + Stats row */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-2 sm:mb-3">
            <div>
              <div className={`text-3xl sm:text-5xl font-bold ${
                isPassed ? 'text-emerald-600' : 'text-amber-600'
              }`}>
                {score}%
              </div>
              <div className="text-xs sm:text-sm font-semibold text-persian-red-700">Score</div>
            </div>
            <div className="h-10 sm:h-14 w-px bg-persian-red-200" />
            <div>
              <div className="text-lg sm:text-2xl font-bold text-persian-red-700">
                {stats.correct}/{stats.total}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-persian-red-600">Correct</div>
            </div>
          </div>

          {/* Assessment Breakdown */}
          <div className="flex justify-center gap-3 sm:gap-5 text-xs">
            {stats.easy > 0 && <span className="text-sky-600 font-bold">{stats.easy} Easy</span>}
            {stats.good > 0 && <span className="text-emerald-600 font-bold">{stats.good} Good</span>}
            {stats.hard > 0 && <span className="text-amber-600 font-bold">{stats.hard} Hard</span>}
            {stats.again > 0 && <span className="text-rose-600 font-bold">{stats.again} Again</span>}
          </div>

          {/* XP Earned */}
          <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-persian-red-200">
            <div className="text-sm sm:text-lg font-bold text-persian-red-500">
              +{stats.easy * 5 + stats.good * 3 + stats.hard * 2 + stats.again * 1} XP earned
            </div>
          </div>
        </div>

        {/* Streak Display */}
        {streakUpdate && (
          <div className="mb-3 sm:mb-5 p-2.5 sm:p-3 bg-amber-50 rounded-lg border-2 border-amber-400">
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-lg sm:text-xl">🔥</div>
                <div className="text-base sm:text-lg font-bold text-amber-700">{streakUpdate.currentStreak}</div>
                <div className="text-xs text-amber-600 font-medium">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl">🏆</div>
                <div className="text-base sm:text-lg font-bold text-amber-700">{streakUpdate.longestStreak}</div>
                <div className="text-xs text-amber-600 font-medium">Record</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl">⭐</div>
                <div className="text-base sm:text-lg font-bold text-amber-700">{streakUpdate.totalXP}</div>
                <div className="text-xs text-amber-600 font-medium">Total XP</div>
              </div>
            </div>
            {streakUpdate.isNewStreak && (
              <p className="text-amber-700 font-bold text-center mt-1.5 text-xs sm:text-sm">
                New streak started! Keep it going!
              </p>
            )}
          </div>
        )}

        {/* Encouragement Message */}
        <div className="mb-3 sm:mb-5">
          {isPassed ? (
            <p className="text-persian-red-700 text-sm font-medium">
              You can now move on to the next lesson or review this one anytime.
            </p>
          ) : (
            <p className="text-persian-red-700 text-sm font-medium">
              You scored {score}%. Review the words and try again to reach 80%!
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 sm:space-y-3">
          {isPassed ? (
            <>
              <Link
                href="/dashboard/lessons"
                className="block w-full py-2.5 sm:py-3 px-4 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl"
              >
                Continue to Next Lesson <span className="btn-arrow">→</span>
              </Link>
              <Link
                href={`/dashboard/lessons/${lessonId}`}
                className="block w-full py-2 px-4 text-persian-red-600 hover:text-persian-red-700 transition-colors text-sm font-medium"
              >
                Review This Lesson
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/dashboard/lessons/${lessonId}`}
                className="block w-full py-2.5 sm:py-3 px-4 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-all text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl"
              >
                Review & Try Again <span className="btn-arrow">→</span>
              </Link>
              <Link
                href="/dashboard/lessons"
                className="block w-full py-2 px-4 text-persian-red-600 hover:text-persian-red-700 transition-colors text-sm font-medium"
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
