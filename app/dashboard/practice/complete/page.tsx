"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
      <div className="max-w-2xl mx-auto py-4 sm:py-8 px-2 sm:px-0">
        <div className="bg-white/40 backdrop-blur-lg border border-persian-red-400/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-2xl p-5 sm:p-8 text-center ring-1 ring-white/20">
          <div className="w-10 h-10 sm:w-14 sm:h-14 mx-auto mb-3 sm:mb-4 overflow-hidden"><Image src="/multiplebooks_icon.png" alt="Books" width={100} height={100} className="w-full h-full object-cover scale-125" /></div>
          <h2 className="text-lg sm:text-xl font-bold text-persian-red-500 mb-2 sm:mb-3">
            No Session Data
          </h2>
          <p className="text-persian-red-700 font-medium mb-3 sm:mb-4 text-sm">
            Complete a practice session to see your results here.
          </p>
          <Link
            href="/dashboard/practice"
            className="inline-block px-5 py-2.5 bg-persian-red-500/90 backdrop-blur-lg text-white rounded-xl hover:bg-persian-red-600 transition-all font-semibold text-sm shadow-lg border border-persian-red-600/50 ring-1 ring-white/10"
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
    <div className="max-w-2xl mx-auto py-4 sm:py-8 px-2 sm:px-0">
      <div className="bg-white/40 backdrop-blur-lg border border-persian-red-400/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-2xl p-4 sm:p-8 text-center ring-1 ring-white/20">
        {/* Celebration Icon + Title */}
        <div className="text-4xl sm:text-6xl mb-2 sm:mb-3 animate-bounce">🎉</div>
        <h1 className="text-xl sm:text-3xl font-bold text-persian-red-500 mb-0.5 sm:mb-1">Great Work!</h1>
        <p className="text-sm sm:text-base text-persian-red-700 font-medium mb-3 sm:mb-5">Session Complete</p>

        {/* Stats Box */}
        <div className="bg-persian-beige-100/50 backdrop-blur-lg rounded-xl p-3 sm:p-5 mb-3 sm:mb-5 border border-persian-red-300/40 ring-1 ring-white/20">
          {/* Score + Stats row */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 mb-2 sm:mb-3">
            <div>
              <div className="text-3xl sm:text-5xl font-bold text-persian-red-700">
                {accuracyPercent}%
              </div>
              <div className="text-xs sm:text-sm font-semibold text-persian-red-600">Accuracy</div>
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

          <div className="pt-2 sm:pt-3 mt-2 sm:mt-3 border-t border-persian-red-300">
            <div className="text-sm sm:text-lg font-bold text-persian-red-500">
              +{xpEarned} XP earned
            </div>
          </div>
        </div>

        {/* Encouragement Message */}
        <div className="mb-3 sm:mb-5">
          <p className="text-persian-red-700 text-sm font-medium">
            {accuracyPercent >= 80
              ? "Excellent! You're mastering these words!"
              : accuracyPercent >= 60
              ? "Good progress! Keep practicing!"
              : "Keep going! Practice makes perfect!"}
          </p>
        </div>

        {/* Streak Display */}
        {streakUpdate && (
          <div className="mb-3 sm:mb-5 p-2.5 sm:p-3 bg-amber-50/50 backdrop-blur-lg rounded-xl border border-amber-400/50 ring-1 ring-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-lg sm:text-xl">🔥</div>
                <div className="text-base sm:text-lg font-bold text-amber-700">{streakUpdate.currentStreak}</div>
                <div className="text-xs text-amber-600 font-medium">Streak</div>
              </div>
              <div className="text-center">
                <div className="text-lg sm:text-xl">🏆</div>
                <div className="text-base sm:text-lg font-bold text-amber-700">{streakUpdate.longestStreak}</div>
                <div className="text-xs text-amber-600 font-medium">Record Streak</div>
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

        {/* Action Buttons */}
        <div className="space-y-2 sm:space-y-3">
          <button
            onClick={() => router.push("/dashboard/practice")}
            className="w-full py-2.5 sm:py-3 px-4 bg-persian-red-500/90 backdrop-blur-lg text-white rounded-xl hover:bg-persian-red-600 transition-all text-sm sm:text-base font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-xl border border-persian-red-600/50 ring-1 ring-white/10"
          >
            Continue Practicing <span className="btn-arrow">→</span>
          </button>

          <Link
            href="/dashboard"
            className="block w-full py-2 px-4 text-persian-red-600 hover:text-persian-red-700 transition-colors text-sm font-medium"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
