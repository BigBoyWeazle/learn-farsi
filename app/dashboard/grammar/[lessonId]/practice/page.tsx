"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { completeGrammarLesson, recordGrammarAttempt } from "@/lib/grammar-progress";
import GrammarCard from "@/components/grammar-card";
import { PageLoading } from "@/components/loading-spinner";
import Image from "next/image";

interface GrammarExercise {
  id: string;
  grammarLessonId: string;
  exerciseType: string;
  question: string;
  questionFarsi: string | null;
  correctAnswer: string;
  alternatives: string | null;
  hint: string | null;
  explanation: string | null;
  sortOrder: number;
}

interface SessionStats {
  total: number;
  correct: number;
  incorrect: number;
}

export default function GrammarPracticePage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;

  const [exercises, setExercises] = useState<GrammarExercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    total: 0,
    correct: 0,
    incorrect: 0,
  });

  // Fetch exercises for this lesson
  useEffect(() => {
    async function fetchExercises() {
      try {
        const response = await fetch(`/api/grammar/${lessonId}`);
        const data = await response.json();

        if (response.ok && data.exercises) {
          setExercises(data.exercises);
        }
      } catch (error) {
        console.error("Error fetching grammar exercises:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchExercises();
  }, [lessonId]);

  const handleAnswer = (isCorrect: boolean) => {
    // Update session stats
    const updatedStats = {
      total: sessionStats.total + 1,
      correct: isCorrect ? sessionStats.correct + 1 : sessionStats.correct,
      incorrect: !isCorrect ? sessionStats.incorrect + 1 : sessionStats.incorrect,
    };
    setSessionStats(updatedStats);

    // Move to next exercise or complete session
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session complete - calculate score
      const score = Math.round((updatedStats.correct / updatedStats.total) * 100);

      // Record lesson attempt/completion
      if (score >= 80) {
        completeGrammarLesson(lessonId, score);
      } else {
        recordGrammarAttempt(lessonId, score);
      }

      // Save session stats for completion page
      localStorage.setItem("grammarSessionStats", JSON.stringify(updatedStats));
      localStorage.setItem("grammarScore", score.toString());
      localStorage.setItem("grammarLessonId", lessonId);

      // Navigate to lesson complete page
      router.push(`/dashboard/grammar/${lessonId}/complete`);
    }
  };

  if (loading) {
    return <PageLoading message="Loading practice session..." />;
  }

  if (exercises.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-white border-3 border-persian-red-500 shadow-xl rounded-lg p-8 text-center">
          <div className="w-14 h-14 mx-auto mb-4 overflow-hidden"><Image src="/bookicon.png" alt="Book" width={100} height={100} className="w-full h-full object-cover scale-125" /></div>
          <h2 className="text-2xl font-bold text-persian-red-500 mb-2">
            No Exercises Available
          </h2>
          <p className="text-persian-red-700 font-medium mb-6">
            This grammar lesson does not have any exercises yet.
          </p>
          <button
            onClick={() => router.push("/dashboard/grammar")}
            className="px-6 py-3 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors font-semibold"
          >
            Back to Grammar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Progress indicator showing it's a grammar lesson */}
      <div className="max-w-2xl mx-auto mb-4">
        <div className="bg-persian-beige-200 border-2 border-persian-red-500 rounded-lg px-4 py-2 text-center">
          <p className="text-sm text-persian-red-700 font-semibold">
            Grammar Practice Session
          </p>
        </div>
      </div>

      <GrammarCard
        exercise={exercises[currentIndex]}
        currentIndex={currentIndex}
        totalExercises={exercises.length}
        onAnswer={handleAnswer}
      />
    </div>
  );
}
