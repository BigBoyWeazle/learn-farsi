"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

export default function SessionCompletePage() {
  const router = useRouter();
  const [stats, setStats] = useState<SessionStats | null>(null);
  const [streakUpdate, setStreakUpdate] = useState<StreakUpdate | null>(null);

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem("sessionStats");
    if (savedStats) {
      const parsedStats = JSON.parse(savedStats);
      setStats(parsedStats);
      // Clear the stats after loading
      localStorage.removeItem("sessionStats");

      // Calculate XP earned
      const xpEarned =
        parsedStats.easy * 5 +
        parsedStats.good * 3 +
        parsedStats.hard * 2 +
        parsedStats.again * 1;

      // Update streak via API (stored per user in database)
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
    // Note: Don't auto-redirect if no stats - let user see the page
  }, []);

  if (!stats) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white border-3 border-persian-red-500 shadow-2xl rounded-2xl p-12 text-center">
          <div className="text-6xl mb-6">📚</div>
          <h2 className="text-2xl font-bold text-persian-red-500 mb-4">
            No Session Data
          </h2>
          <p className="text-persian-red-700 font-medium mb-6">
            Complete a practice session to see your results here.
          </p>
          <Link
            href="/dashboard/practice"
            className="inline-block px-6 py-3 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-semibold"
          >
            Start Practice Session
          </Link>
        </div>
      </div>
    );
  }

  // Calculate XP earned (simple calculation based on assessments)
  const xpEarned =
    stats.easy * 5 + stats.good * 3 + stats.hard * 2 + stats.again * 1;

  // Calculate accuracy percentage
  const accuracyPercent = stats.total > 0
    ? Math.round((stats.correct / stats.total) * 100)
    : 0;

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white border-3 border-persian-red-500 shadow-2xl rounded-2xl p-12 text-center">
        {/* Celebration Icon */}
        <div className="text-8xl mb-6 animate-bounce">🎉</div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-persian-red-500 mb-2">Great Work!</h1>
        <p className="text-xl text-persian-red-700 font-medium mb-8">Session Complete</p>

        {/* Stats Box */}
        <div className="bg-persian-beige-100 rounded-xl p-8 mb-8 border-2 border-persian-red-300">
          <div className="mb-6">
            <div className="text-3xl font-bold text-persian-red-700 mb-2">
              {stats.total} words reviewed
            </div>

            {/* Correctness Stats */}
            <div className="mb-4">
              <div className="text-lg font-semibold text-persian-red-600">
                {stats.correct} / {stats.total} correct ({accuracyPercent}%)
              </div>
            </div>

            {/* Assessment Breakdown */}
            <div className="flex justify-center gap-6 text-sm">
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
          </div>

          <div className="pt-6 border-t border-persian-red-300">
            <div className="text-2xl font-bold text-persian-red-500">
              +{xpEarned} XP earned
            </div>
          </div>
        </div>

        {/* Encouragement Message */}
        <div className="mb-8">
          <p className="text-persian-red-700 text-lg font-medium mb-2">
            {accuracyPercent >= 80
              ? "Excellent! You're mastering these words!"
              : accuracyPercent >= 60
              ? "Good progress! Keep practicing!"
              : "Keep going! Practice makes perfect!"}
          </p>
          <p className="text-sm text-persian-red-600">
            Come back daily to maintain your learning momentum
          </p>
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

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => router.push("/dashboard/practice")}
            className="w-full py-4 px-6 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
          >
            Continue Practicing <span className="btn-arrow">→</span>
          </button>

          <Link
            href="/dashboard"
            className="block w-full py-3 px-6 text-persian-red-600 hover:text-persian-red-700 transition-colors text-base font-medium"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Streak Reminder */}
        <div className="mt-8 pt-8 border-t border-persian-red-200">
          <div className="flex items-center justify-center gap-2 text-persian-red-700">
            <span className="text-2xl">🔥</span>
            <span className="text-sm font-medium">Daily practice builds your streak!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
