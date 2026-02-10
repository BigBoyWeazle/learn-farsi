"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Vocabulary } from "@/db/schema";
import { getLessonProgress } from "@/lib/lesson-progress";
import { PageLoading } from "@/components/loading-spinner";

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
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Lesson Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            This lesson does not exist or has been removed.
          </p>
          <Link
            href="/dashboard/lessons"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
          className="text-blue-600 hover:text-blue-700 font-medium mb-3 inline-block text-sm sm:text-base"
        >
          ← Back to Lessons
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">
          {lesson.title}
        </h1>
        {lesson.description && (
          <p className="text-gray-600 text-sm sm:text-base">{lesson.description}</p>
        )}
      </div>

      {/* Progress Badge */}
      {progress?.isCompleted && (
        <div className="mb-4 sm:mb-6 bg-green-50 border-2 border-green-500 rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="text-2xl sm:text-3xl">✓</div>
            <div>
              <h3 className="font-bold text-green-900 text-sm sm:text-base">Lesson Completed!</h3>
              <p className="text-xs sm:text-sm text-green-700">
                Best score: {progress.bestScore}% | Attempts: {progress.attempts}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-4 sm:p-8 mb-6 sm:mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-bold mb-1">Lesson Overview</h2>
            <p className="text-blue-100 text-sm sm:text-base">
              You will learn {wordCount} new words
            </p>
          </div>
          <div className="w-10 h-10 sm:w-16 sm:h-16 overflow-hidden flex-shrink-0"><Image src="/multiplebooks_icon.png" alt="Books" width={100} height={100} className="w-full h-full object-cover scale-125" /></div>
        </div>
      </div>

      {/* Words Introduction */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
          Words in This Lesson
        </h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2">
          {words.map((word) => (
            <div
              key={word.id}
              className="bg-white border-2 border-gray-200 rounded-lg p-3 sm:p-6 hover:border-blue-300 transition-colors"
            >
              {/* Farsi Word */}
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2 text-right">
                {word.farsiWord}
              </div>

              {/* Phonetic */}
              <div className="text-base sm:text-lg text-blue-600 font-semibold mb-1 sm:mb-2">
                {word.phonetic}
              </div>

              {/* English Translation */}
              <div className="text-lg sm:text-xl text-gray-700 font-medium mb-2 sm:mb-3">
                {word.englishTranslation}
              </div>

              {/* Example */}
              {word.exampleFarsi && word.exampleEnglish && (
                <div className="pt-2 sm:pt-3 border-t border-gray-200">
                  <p className="text-xs sm:text-sm text-gray-500 mb-1">Example:</p>
                  <p className="text-xs sm:text-sm text-gray-700 italic mb-1">
                    {word.exampleEnglish}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    ({word.examplePhonetic})
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h3 className="font-bold text-yellow-900 mb-2 text-sm sm:text-base">📝 Study Tips</h3>
        <ul className="text-xs sm:text-sm text-yellow-800 space-y-1">
          <li>• Review each word&apos;s pronunciation and meaning</li>
          <li>• Try to create your own sentences using these words</li>
          <li>• Pay attention to the examples - they show real usage</li>
          <li>• You will need 80% or higher to complete this lesson</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 sm:gap-4">
        <button
          onClick={() => router.push(`/dashboard/lessons/${lessonId}/practice`)}
          className="flex-1 py-3 sm:py-4 px-4 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl"
        >
          Start Practicing <span className="btn-arrow">→</span>
        </button>
        <Link
          href="/dashboard/lessons"
          className="px-4 sm:px-6 py-3 sm:py-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 transition-colors font-semibold text-sm sm:text-base"
        >
          Back
        </Link>
      </div>
    </div>
  );
}
