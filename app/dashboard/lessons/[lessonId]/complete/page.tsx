"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Nightingale } from "@/components/nightingale";

interface SessionStats {
  total: number;
  easy: number;
  good: number;
  hard: number;
  again: number;
  correct: number;
  incorrect: number;
}

export default function LessonCompletePage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;

  const [stats, setStats] = useState<SessionStats | null>(null);
  const [score, setScore] = useState<number>(0);
  const [isPassed, setIsPassed] = useState(false);

  useEffect(() => {
    // Load stats from localStorage
    const savedStats = localStorage.getItem("sessionStats");
    const savedScore = localStorage.getItem("lessonScore");
    const savedLessonId = localStorage.getItem("lessonId");

    // Verify this is the correct lesson
    if (savedLessonId !== lessonId) {
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
    }
  }, [lessonId, router]);

  if (!stats) {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="bg-white border-3 border-persian-red-500 shadow-2xl rounded-2xl p-12 text-center">
          <div className="text-6xl mb-6">📚</div>
          <h2 className="text-2xl font-bold text-persian-red-500 mb-4">
            No Session Data
          </h2>
          <p className="text-persian-red-700 font-medium mb-6">
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
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white border-3 border-persian-red-500 shadow-2xl rounded-2xl p-12 text-center">
        {/* Celebration/Try Again Icon */}
        <div className="flex justify-center mb-6">
          {isPassed ? (
            <Nightingale show={true} size="lg" />
          ) : (
            <div className="text-8xl">📖</div>
          )}
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-persian-red-500 mb-2">
          {isPassed ? 'Lesson Completed!' : 'Keep Practicing!'}
        </h1>
        <p className="text-xl text-persian-red-700 font-medium mb-8">
          {isPassed
            ? "Great job! You've mastered this lesson!"
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
              {stats.total} words practiced
            </div>
            <div className="text-lg font-semibold text-persian-red-600">
              {stats.correct} / {stats.total} correct
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

        {/* Encouragement Message */}
        <div className="mb-8">
          {isPassed ? (
            <div>
              <p className="text-persian-red-700 text-lg font-medium mb-2">
                Excellent work! You have completed this lesson.
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
                Review the words and practice again. You can do it!
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {isPassed ? (
            <>
              <Link
                href="/dashboard/lessons"
                className="block w-full py-4 px-6 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Continue to Next Lesson <span className="btn-arrow">→</span>
              </Link>
              <Link
                href={`/dashboard/lessons/${lessonId}`}
                className="block w-full py-3 px-6 text-persian-red-600 hover:text-persian-red-700 transition-colors text-base font-medium"
              >
                Review This Lesson
              </Link>
            </>
          ) : (
            <>
              <Link
                href={`/dashboard/lessons/${lessonId}`}
                className="block w-full py-4 px-6 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-all text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Review & Try Again <span className="btn-arrow">→</span>
              </Link>
              <Link
                href="/dashboard/lessons"
                className="block w-full py-3 px-6 text-persian-red-600 hover:text-persian-red-700 transition-colors text-base font-medium"
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
