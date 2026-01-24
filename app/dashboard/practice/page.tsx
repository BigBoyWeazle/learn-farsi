"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Vocabulary } from "@/db/schema";
import type { Assessment } from "@/lib/spaced-repetition";
import { calculateNextReview } from "@/lib/spaced-repetition";
import { getUserStats } from "@/lib/user-stats";
import PracticeCard from "./practice-card";
import { PageLoading } from "@/components/loading-spinner";

interface SessionStats {
  total: number;
  easy: number;
  good: number;
  hard: number;
  again: number;
  correct: number;
  incorrect: number;
}

export default function PracticePage() {
  const router = useRouter();
  const [words, setWords] = useState<Vocabulary[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    total: 0,
    easy: 0,
    good: 0,
    hard: 0,
    again: 0,
    correct: 0,
    incorrect: 0,
  });

  // Fetch words for practice session
  useEffect(() => {
    async function fetchWords() {
      try {
        // Get current user level from localStorage
        const userStats = getUserStats();
        const currentLevel = userStats.currentLevel;

        // Fetch words with smart selection based on level
        const response = await fetch(`/api/practice/words?level=${currentLevel}`);
        const data = await response.json();
        setWords(data.words || []);
      } catch (error) {
        console.error("Error fetching practice words:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWords();
  }, []);

  const handleAssessment = async (assessment: Assessment, isCorrect: boolean) => {
    const currentWord = words[currentIndex];

    // Update session stats
    const updatedStats = {
      total: sessionStats.total + 1,
      [assessment]: sessionStats[assessment] + 1,
      easy: assessment === "easy" ? sessionStats.easy + 1 : sessionStats.easy,
      good: assessment === "good" ? sessionStats.good + 1 : sessionStats.good,
      hard: assessment === "hard" ? sessionStats.hard + 1 : sessionStats.hard,
      again: assessment === "again" ? sessionStats.again + 1 : sessionStats.again,
      correct: isCorrect ? sessionStats.correct + 1 : sessionStats.correct,
      incorrect: !isCorrect ? sessionStats.incorrect + 1 : sessionStats.incorrect,
    };
    setSessionStats(updatedStats);

    // Get current progress from localStorage
    const storageKey = `progress_${currentWord.id}`;
    const currentProgressJson = localStorage.getItem(storageKey);
    const currentProgress = currentProgressJson
      ? JSON.parse(currentProgressJson)
      : null;

    // Calculate next review with correctness
    const reviewUpdate = calculateNextReview(assessment, isCorrect, currentProgress);

    // Save to localStorage (temporary until auth is enabled)
    const updatedProgress = {
      vocabularyId: currentWord.id,
      ...reviewUpdate,
      // Convert dates to ISO strings for localStorage
      nextReviewDate: reviewUpdate.nextReviewDate.toISOString(),
      lastReviewedAt: reviewUpdate.lastReviewedAt.toISOString(),
      updatedAt: reviewUpdate.updatedAt.toISOString(),
    };
    localStorage.setItem(storageKey, JSON.stringify(updatedProgress));

    // Move to next word or complete session
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session complete - save updated stats and navigate to completion screen
      localStorage.setItem("sessionStats", JSON.stringify(updatedStats));
      router.push("/dashboard/practice/complete");
    }
  };

  if (loading) {
    return <PageLoading message="Loading your practice session..." />;
  }

  if (words.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-white border-3 border-persian-red-500 shadow-xl rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-persian-red-500 mb-2">
            No Words Available
          </h2>
          <p className="text-persian-red-700 font-medium mb-6">
            There are no words ready for practice right now. Check back later!
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-semibold"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Daily Practice indicator */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="bg-persian-beige-200 border-2 border-persian-red-500 rounded-lg px-4 py-2 text-center">
          <p className="text-sm text-persian-red-700 font-semibold">
            🎯 Daily Practice Session
          </p>
        </div>
      </div>
      <PracticeCard
        word={words[currentIndex]}
        currentIndex={currentIndex}
        totalWords={words.length}
        onAssessment={handleAssessment}
      />
    </div>
  );
}
