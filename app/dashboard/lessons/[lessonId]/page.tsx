"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Vocabulary } from "@/db/schema";
import { getLessonProgress } from "@/lib/lesson-progress";
import { PageLoading } from "@/components/loading-spinner";
import { useDisplayPreference, DisplayToggle } from "@/components/display-preference";

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  difficultyLevel: number;
}

interface LessonData {
  lesson: Lesson;
  words: Vocabulary[];
  wordCount: number;
}

export default function LessonIntroductionPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.lessonId as string;

  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<any>(null);
  const [showTips, setShowTips] = useState(false);
  const { isPhoneticFirst } = useDisplayPreference();

  useEffect(() => {
    async function fetchLessonData() {
      try {
        const response = await fetch(`/api/lessons/${lessonId}/words`);
        const data = await response.json();

        if (response.ok) {
          setLessonData(data);
          setProgress(getLessonProgress(lessonId));
        } else {
          console.error("Failed to fetch lesson:", data.error);
        }
      } catch (error) {
        console.error("Error fetching lesson:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLessonData();
  }, [lessonId]);

  if (loading) {
    return <PageLoading message="Loading lesson..." />;
  }

  if (!lessonData) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <div className="bg-white/40 backdrop-blur-lg border border-persian-red-400/40 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-2xl p-8 text-center ring-1 ring-white/20">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-persian-red-500 mb-2">
            Lesson Not Found
          </h2>
          <p className="text-persian-red-700 mb-6">
            This lesson does not exist or has been removed.
          </p>
          <Link
            href="/dashboard/lessons"
            className="inline-block px-6 py-3 bg-persian-red-500/90 backdrop-blur-lg text-white rounded-lg hover:bg-persian-red-600 transition-colors font-semibold shadow-lg"
          >
            Back to Lessons
          </Link>
        </div>
      </div>
    );
  }

  const { lesson, words, wordCount } = lessonData;

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-0">
      {/* Header */}
      <div className="mb-4 sm:mb-6">
        <Link
          href="/dashboard/lessons"
          className="text-persian-red-500 hover:text-persian-red-600 font-medium mb-3 inline-block text-sm sm:text-base"
        >
          ← Back to Lessons
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-persian-red-500 mb-1 sm:mb-2">
          {lesson.title}
        </h1>
        {lesson.description && (
          <p className="text-persian-red-700 text-sm sm:text-base">{lesson.description}</p>
        )}
      </div>

      {/* Progress Badge */}
      {progress?.isCompleted && (
        <div className="mb-4 sm:mb-6 bg-emerald-50/40 backdrop-blur-lg border border-emerald-400/50 rounded-xl p-3 sm:p-4 ring-1 ring-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-2xl sm:text-3xl">✓</div>
            <div>
              <h3 className="font-bold text-emerald-900 text-sm sm:text-base">Lesson Completed!</h3>
              <p className="text-xs sm:text-sm text-emerald-700">
                Best score: {progress.bestScore}% | Attempts: {progress.attempts}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Overview */}
      <div className="bg-gradient-to-r from-persian-red-500/90 to-persian-red-600/90 backdrop-blur-lg rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] px-4 py-3 sm:px-6 sm:py-4 mb-4 sm:mb-6 text-white border border-persian-red-600/50 ring-1 ring-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold">Lesson Overview</h2>
            <p className="text-persian-beige-200 text-xs sm:text-sm">
              You will learn {wordCount} new words
            </p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 overflow-hidden flex-shrink-0"><Image src="/multiplebooks_icon.png" alt="Books" width={100} height={100} className="w-full h-full object-cover scale-125" /></div>
        </div>
      </div>

      {/* Words Introduction */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <h2 className="text-xl sm:text-2xl font-bold text-persian-red-500">
            Words in This Lesson
          </h2>
          <DisplayToggle />
        </div>
        <div className="grid gap-2 sm:gap-3 grid-cols-1 md:grid-cols-2">
          {words.map((word) => (
            <div
              key={word.id}
              className="bg-white/40 backdrop-blur-lg border border-persian-red-200/40 rounded-xl px-3 py-2 sm:px-4 sm:py-3 hover:border-persian-red-400/60 hover:bg-white/55 transition-all ring-1 ring-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
            >
              <div className="flex items-baseline justify-between gap-2 mb-0.5">
                {isPhoneticFirst ? (
                  <>
                    <span className="text-base sm:text-lg font-bold text-persian-red-500 capitalize">
                      {word.phonetic}
                    </span>
                    <span className="text-sm sm:text-base text-persian-red-400" style={{ direction: "rtl", fontFamily: "serif" }}>
                      {word.farsiWord}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-lg sm:text-xl font-bold text-persian-red-500" style={{ fontFamily: "serif", direction: "rtl" }}>
                      {word.farsiWord}
                    </span>
                    <span className="text-sm sm:text-base text-persian-red-400 capitalize">
                      {word.phonetic}
                    </span>
                  </>
                )}
              </div>

              {/* English Translation */}
              <div className="text-sm sm:text-base text-persian-red-700 font-medium">
                {word.englishTranslation}
              </div>

              {/* Example - collapsed to single line */}
              {word.exampleFarsi && word.exampleEnglish && (
                <div className="mt-1 pt-1 border-t border-persian-red-100 text-xs text-persian-red-400 italic truncate">
                  {word.exampleEnglish}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Study Tips — collapsible */}
      <div className="bg-persian-beige-100/50 backdrop-blur-lg border border-persian-gold-400/50 rounded-xl mb-4 sm:mb-6 ring-1 ring-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full flex items-center justify-between px-3 py-2 sm:px-4 sm:py-2.5 text-left"
        >
          <h3 className="font-bold text-persian-gold-700 text-sm sm:text-base">📝 Study Tips</h3>
          <span className={`text-persian-gold-600 text-xs font-medium transition-transform ${showTips ? "rotate-180" : ""}`}>▼</span>
        </button>
        {showTips && (
          <ul className="text-xs sm:text-sm text-persian-gold-800 space-y-1 px-3 pb-2.5 sm:px-4 sm:pb-3">
            <li>• Review each word&apos;s pronunciation and meaning</li>
            <li>• Try to create your own sentences using these words</li>
            <li>• Pay attention to the examples - they show real usage</li>
            <li>• You will need 80% or higher to complete this lesson</li>
          </ul>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 sm:gap-4">
        <button
          onClick={() => router.push(`/dashboard/lessons/${lessonId}/practice`)}
          className="flex-1 py-3 sm:py-4 px-4 sm:px-6 bg-persian-red-500/90 backdrop-blur-lg text-white rounded-xl hover:bg-persian-red-600 transition-all text-base sm:text-lg font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-xl hover:scale-[1.02] border border-persian-red-600/50 ring-1 ring-white/10"
        >
          Start Practicing <span className="btn-arrow">→</span>
        </button>
        <Link
          href="/dashboard/lessons"
          className="px-4 sm:px-6 py-3 sm:py-4 bg-white/40 backdrop-blur-lg border border-persian-red-300/40 text-persian-red-600 rounded-xl hover:border-persian-red-400/60 hover:bg-white/55 transition-all font-semibold text-sm sm:text-base ring-1 ring-white/20"
        >
          Back
        </Link>
      </div>
    </div>
  );
}
