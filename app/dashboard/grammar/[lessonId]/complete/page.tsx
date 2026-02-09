"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface SessionStats {
  total: number;
  correct: number;
  incorrect: number;
}

interface StreakUpdate {
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  isNewStreak: boolean;
}

export default function GrammarCompletePage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;

  const [stats, setStats] = useState<SessionStats | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isPassed, setIsPassed] = useState(false);
  const [streakUpdate, setStreakUpdate] = useState<StreakUpdate | null>(null);

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem("grammarSessionStats");
    const savedScore = localStorage.getItem("grammarScore");
    const savedLessonId = localStorage.getItem("grammarLessonId");

    // Verify this is the correct lesson
    if (savedLessonId && savedLessonId !== lessonId) {
      router.push(`/dashboard/grammar/${lessonId}`);
      return;
    }

    if (savedStats && savedScore) {
      const parsedStats = JSON.parse(savedStats);
      const parsedScore = parseInt(savedScore, 10);

      setStats(parsedStats);
      setScore(parsedScore);
      setIsPassed(parsedScore >= 80);

      // Clear the session data
      localStorage.removeItem("grammarSessionStats");
      localStorage.removeItem("grammarScore");
      localStorage.removeItem("grammarLessonId");

      // Calculate XP earned (based on correct answers)
      const xpEarned = parsedStats.correct * 3 + parsedStats.incorrect * 1;

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
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white border-3 border-persian-red-500 shadow-2xl rounded-2xl p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-6 overflow-hidden"><Image src="/bookicon.png" alt="Book" width={100} height={100} className="w-full h-full object-cover scale-125" /></div>
          <h2 className="text-2xl font-bold text-persian-red-500 mb-4">
            No Session Data
          </h2>
          <p className="text-persian-red-700 font-medium mb-6">
            Complete a grammar practice to see your results here.
          </p>
          <Link
            href={`/dashboard/grammar/${lessonId}`}
            className="inline-block px-6 py-3 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-semibold"
          >
            Back to Lesson
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white border-3 border-persian-red-500 shadow-2xl rounded-2xl p-12 text-center">
        {/* Celebration/Try Again Icon */}
        <div className={`text-8xl mb-6 ${isPassed ? 'animate-bounce' : ''}`}>
          {isPassed ? '🎉' : <div className="w-20 h-20 mx-auto overflow-hidden"><Image src="/bookicon.png" alt="Book" width={120} height={120} className="w-full h-full object-cover scale-125" /></div>}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-persian-red-500 mb-2">
          {isPassed ? 'Grammar Lesson Completed!' : 'Keep Practicing!'}
        </h1>
        <p className="text-xl text-persian-red-700 font-medium mb-8">
          {isPassed
            ? "Great job! You've mastered this grammar lesson!"
            : 'You need 80% or higher to complete this lesson'}
        </p>

        {/* Score Display */}
        <div className={`rounded-xl p-8 mb-8 ${
          isPassed
            ? 'bg-emerald-50 border-2 border-emerald-500'
            : 'bg-amber-50 border-2 border-amber-500'
        }`}>
          <div className="mb-6">
            <div className={`text-6xl font-bold mb-2 ${
              isPassed ? 'text-emerald-600' : 'text-amber-600'
            }`}>
              {score}%
            </div>
            <div className="text-lg font-semibold text-persian-red-700">
              Your Score
            </div>
          </div>

          {/* Stats */}
          <div className="mb-4">
            <div className="text-2xl font-bold text-persian-red-700 mb-2">
              {stats.total} exercises completed
            </div>
            <div className="text-lg font-semibold text-persian-red-600">
              {stats.correct} / {stats.total} correct
            </div>
          </div>

          {/* XP Earned */}
          <div className="pt-4 mt-4 border-t border-persian-red-200">
            <div className="text-xl font-bold text-persian-red-500">
              +{stats.correct * 3 + stats.incorrect * 1} XP earned
            </div>
          </div>
        </div>

        {/* Streak Display */}
        {streakUpdate && (
          <div className="mb-8 p-4 bg-amber-50 rounded-lg border-2 border-amber-400">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-3xl">🔥</div>
                <div className="text-2xl font-bold text-amber-700">{streakUpdate.currentStreak}</div>
                <div className="text-sm text-amber-600 font-medium">Current Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl">🏆</div>
                <div className="text-2xl font-bold text-amber-700">{streakUpdate.longestStreak}</div>
                <div className="text-sm text-amber-600 font-medium">Record Streak</div>
              </div>
              <div className="text-center">
                <div className="text-3xl">⭐</div>
                <div className="text-2xl font-bold text-amber-700">{streakUpdate.totalXP}</div>
                <div className="text-sm text-amber-600 font-medium">Total XP</div>
              </div>
            </div>
            {streakUpdate.isNewStreak && (
              <p className="text-amber-700 font-bold text-center mt-3">
                New streak started! Keep it going! 💪
              </p>
            )}
          </div>
        )}

        {/* Encouragement Message */}
        <div className="mb-8">
          {isPassed ? (
            <div>
              <p className="text-persian-red-700 text-lg font-medium mb-2">
                Excellent work! You have completed this grammar lesson.
              </p>
              <p className="text-sm text-persian-red-600">
                You can now move on to the next lesson or review this one anytime.
              </p>
            </div>
          ) : (
            <div>
              <p className="text-persian-red-700 text-lg font-medium mb-2">
                You scored {score}%. Try again to reach 80%!
              </p>
              <p className="text-sm text-persian-red-600">
                Review the grammar explanation and practice again. You can do it!
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {isPassed ? (
            <>
              <Link
                href="/dashboard/grammar"
                className="block w-full py-4 px-6 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Continue to Next Lesson <span className="btn-arrow">→</span>
              </Link>
              <Link
                href={`/dashboard/grammar/${lessonId}`}
                className="block w-full py-3 px-6 text-persian-red-600 hover:text-persian-red-700 transition-colors text-base font-medium"
              >
                Review This Lesson
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/dashboard/grammar/${lessonId}`}
                className="block w-full py-4 px-6 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Review & Try Again <span className="btn-arrow">→</span>
              </Link>
              <Link
                href="/dashboard/grammar"
                className="block w-full py-3 px-6 text-persian-red-600 hover:text-persian-red-700 transition-colors text-base font-medium"
              >
                Back to Grammar
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
