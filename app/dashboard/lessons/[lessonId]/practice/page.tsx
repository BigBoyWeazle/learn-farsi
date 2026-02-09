"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import type { Vocabulary } from "@/db/schema";
import type { Assessment } from "@/lib/spaced-repetition";
import { calculateNextReview } from "@/lib/spaced-repetition";
import { completeLessson, recordLessonAttempt } from "@/lib/lesson-progress";
import PracticeCard from "@/app/dashboard/practice/practice-card";
import Image from "next/image";
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

export default function LessonPracticePage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;

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

  // Fetch words for this lesson
  useEffect(() => {
    async function fetchWords() {
      try {
        const response = await fetch(`/api/lessons/${lessonId}/words`);
        const data = await response.json();

        if (response.ok) {
          // Shuffle words for practice
          const shuffled = [...data.words].sort(() => 0.5 - Math.random());
          setWords(shuffled);
        }
      } catch (error) {
        console.error("Error fetching lesson words:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWords();
  }, [lessonId]);

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

    // Save to localStorage
    const updatedProgress = {
      vocabularyId: currentWord.id,
      ...reviewUpdate,
      nextReviewDate: reviewUpdate.nextReviewDate.toISOString(),
      lastReviewedAt: reviewUpdate.lastReviewedAt.toISOString(),
      updatedAt: reviewUpdate.updatedAt.toISOString(),
    };
    localStorage.setItem(storageKey, JSON.stringify(updatedProgress));

    // Move to next word or complete session
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Lesson practice complete - calculate score
      const score = Math.round((updatedStats.correct / updatedStats.total) * 100);

      // Record lesson attempt/completion
      if (score >= 80) {
        completeLessson(lessonId, score);
      } else {
        recordLessonAttempt(lessonId, score);
      }

      // Save session stats for completion page
      localStorage.setItem("sessionStats", JSON.stringify(updatedStats));
      localStorage.setItem("lessonScore", score.toString());
      localStorage.setItem("lessonId", lessonId);

      // Navigate to lesson complete page
      router.push(`/dashboard/lessons/${lessonId}/complete`);
    }
  };

  if (loading) {
    return <PageLoading message="Loading practice session..." />;
  }

  if (words.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-white border-3 border-persian-red-500 shadow-xl rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 overflow-hidden"><Image src="/multiplebooks_icon.png" alt="Books" width={100} height={100} className="w-full h-full object-cover scale-125" /></div>
          <h2 className="text-2xl font-bold text-persian-red-500 mb-2">
            No Words Available
          </h2>
          <p className="text-persian-red-700 font-medium mb-6">
            This lesson does not have any words yet.
          </p>
          <button
            onClick={() => router.push("/dashboard/lessons")}
            className="px-6 py-3 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-semibold"
          >
            Back to Lessons
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Progress indicator showing it's a lesson */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="bg-persian-beige-200 border-2 border-persian-red-500 rounded-lg px-4 py-2 text-center">
          <p className="text-sm text-persian-red-700 font-semibold">
            <span className="inline-block w-5 h-5 overflow-hidden align-middle"><Image src="/multiplebooks_icon.png" alt="Books" width={40} height={40} className="w-full h-full object-cover scale-125" /></span> Lesson Practice Session
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
