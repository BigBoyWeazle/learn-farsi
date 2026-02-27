"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Vocabulary } from "@/db/schema";
import type { Assessment } from "@/lib/spaced-repetition";
import PracticeCard from "./practice-card";
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

  // Fetch words for practice session (API handles user auth + level + smart selection)
  useEffect(() => {
    async function fetchWords() {
      try {
        const response = await fetch("/api/practice/words");
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
      easy: assessment === "easy" ? sessionStats.easy + 1 : sessionStats.easy,
      good: assessment === "good" ? sessionStats.good + 1 : sessionStats.good,
      hard: assessment === "hard" ? sessionStats.hard + 1 : sessionStats.hard,
      again: assessment === "again" ? sessionStats.again + 1 : sessionStats.again,
      correct: isCorrect ? sessionStats.correct + 1 : sessionStats.correct,
      incorrect: !isCorrect ? sessionStats.incorrect + 1 : sessionStats.incorrect,
    };
    setSessionStats(updatedStats);

    // Save review to database via API
    try {
      await fetch("/api/practice/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vocabularyId: currentWord.id,
          assessment,
          isCorrect,
        }),
      });
    } catch (error) {
      console.error("Error saving review:", error);
    }

    // Move to next word or complete session
    if (currentIndex < words.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session complete - save stats for completion screen and navigate
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
        <div className="bg-white/40 backdrop-blur-lg border border-persian-red-400/40 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-xl p-8 text-center ring-1 ring-white/20">
          <div className="w-16 h-16 mx-auto mb-4 overflow-hidden"><Image src="/multiplebooks_icon.png" alt="Books" width={100} height={100} className="w-full h-full object-cover scale-125" /></div>
          <h2 className="text-2xl font-bold text-persian-red-500 mb-2">
            No Words Available
          </h2>
          <p className="text-persian-red-700 font-medium mb-6">
            There are no words ready for practice right now. Check back later!
          </p>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-persian-red-500/90 backdrop-blur-lg text-white rounded-xl hover:bg-persian-red-600 transition-all font-semibold shadow-lg border border-persian-red-600/50 ring-1 ring-white/10"
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
        <div className="bg-persian-beige-200/50 backdrop-blur-lg border border-persian-red-400/40 rounded-xl px-4 py-2 text-center ring-1 ring-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <p className="text-sm text-persian-red-700 font-semibold">
            Daily Practice Session
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
