"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { syncGrammarProgressFromDatabase } from "@/lib/grammar-progress";
import { PageLoading } from "@/components/loading-spinner";

interface GrammarLesson {
  id: string;
  title: string;
  description: string | null;
  explanation: string;
  difficultyLevel: number;
  sortOrder: number;
  icon: string;
  isActive: boolean;
  createdAt: string;
}

export default function GrammarPage() {
  const [lessons, setLessons] = useState<GrammarLesson[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessonsAndProgress() {
      try {
        const response = await fetch("/api/grammar");
        const data = await response.json();
        setLessons(data.lessons || []);

        const completedIds = await syncGrammarProgressFromDatabase();
        setCompletedLessonIds(completedIds);
      } catch (error) {
        console.error("Error fetching grammar lessons:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLessonsAndProgress();
  }, []);

  if (loading) {
    return <PageLoading message="Loading grammar lessons..." />;
  }

  const levelNames: Record<number, string> = {
    1: "Beginner",
    2: "Elementary",
    3: "Intermediate",
    4: "Advanced",
    5: "Expert",
  };

  // Sort by difficulty level first, then sortOrder within each level
  const sortedLessons = [...lessons].sort((a, b) => {
    if (a.difficultyLevel !== b.difficultyLevel) return a.difficultyLevel - b.difficultyLevel;
    return a.sortOrder - b.sortOrder;
  });

  // Generate display title with correct sequential numbering
  const getLessonDisplayTitle = (lesson: GrammarLesson, index: number) => {
    const baseName = lesson.title.replace(/^Lesson\s+G?\d+:\s*/i, "");
    return `Lesson G${index + 1}: ${baseName}`;
  };

  // Accessibility based on display order: first lesson is always accessible,
  // each subsequent lesson requires the previous one in display order to be completed
  const isLessonAccessible = (displayIndex: number) => {
    if (displayIndex === 0) return true;
    return completedLessonIds.includes(sortedLessons[displayIndex - 1].id);
  };

  const currentLessonId = sortedLessons.find((l, i) => {
    return isLessonAccessible(i) && !completedLessonIds.includes(l.id);
  })?.id;

  const levelCounts = sortedLessons.reduce((acc, l) => {
    if (!acc[l.difficultyLevel]) acc[l.difficultyLevel] = { total: 0, completed: 0 };
    acc[l.difficultyLevel].total++;
    if (completedLessonIds.includes(l.id)) acc[l.difficultyLevel].completed++;
    return acc;
  }, {} as Record<number, { total: number; completed: number }>);

  return (
    <div className="max-w-2xl mx-auto py-4 sm:py-8 px-2 sm:px-0">
      <div className="mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-persian-red-500 mb-1">
          Farsi Grammar
        </h1>
        <p className="text-persian-red-700 font-medium text-sm sm:text-base">
          Master Farsi grammar with structured lessons and exercises
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-persian-red-500 rounded-xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white border-2 border-persian-red-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-1">Your Grammar Progress</h2>
            <p className="text-white text-sm sm:text-base">
              {completedLessonIds.length} of {lessons.length} lessons completed
            </p>
          </div>
          <div className="w-10 h-10 sm:w-14 sm:h-14 overflow-hidden flex-shrink-0">
            <Image src="/bookicon.png" alt="Book" width={100} height={100} className="w-full h-full object-cover scale-125" />
          </div>
        </div>
        <div className="mt-3 bg-white/30 rounded-full h-2.5 sm:h-3 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-500"
            style={{
              width: `${lessons.length > 0 ? (completedLessonIds.length / lessons.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Grammar Reference Card */}
      <Link
        href="/dashboard/grammar/reference"
        className="block bg-white border-2 border-persian-gold-500 rounded-xl shadow-xl p-4 sm:p-5 mb-6 sm:mb-8 hover:shadow-2xl hover:border-persian-gold-600 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 overflow-hidden flex-shrink-0">
              <Image src="/bookicon.png" alt="Book" width={80} height={80} className="w-full h-full object-cover scale-125" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-persian-gold-700">Verb Tense Reference</h3>
              <p className="text-persian-gold-600 text-xs sm:text-sm font-medium">Quick-lookup conjugation tables for all Farsi verb tenses</p>
            </div>
          </div>
          <span className="text-persian-gold-500 font-bold text-lg sm:text-xl">&rarr;</span>
        </div>
      </Link>

      {lessons.length === 0 ? (
        <div className="bg-white border-2 border-persian-red-500 shadow-xl rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 overflow-hidden">
            <Image src="/bookicon.png" alt="Book" width={120} height={120} className="w-full h-full object-cover scale-125" />
          </div>
          <h2 className="text-2xl font-bold text-persian-red-500 mb-2">
            Coming Soon!
          </h2>
          <p className="text-persian-red-700 font-medium">
            Grammar lessons are being prepared. Check back soon!
          </p>
        </div>
      ) : (
        /* Learning Track */
        <div className="relative">
          {/* Track line */}
          <div className="absolute left-[15px] sm:left-[19px] top-0 bottom-0 w-0 border-l-2 border-dashed border-persian-red-200" />

          {sortedLessons.map((lesson, index) => {
            const isCompleted = completedLessonIds.includes(lesson.id);
            const isCurrent = lesson.id === currentLessonId;
            const isLocked = !isLessonAccessible(index);
            const prevLesson = index > 0 ? sortedLessons[index - 1] : null;
            const showLevelMilestone = !prevLesson || prevLesson.difficultyLevel !== lesson.difficultyLevel;

            return (
              <div key={lesson.id}>
                {/* Level Milestone */}
                {showLevelMilestone && (
                  <div className="relative flex items-center gap-3 sm:gap-4 pb-3 sm:pb-4">
                    <div className="relative z-10 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-persian-red-500 border-2 border-persian-red-700 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-[10px] sm:text-xs">Lv{lesson.difficultyLevel}</span>
                    </div>
                    <div>
                      <div className="font-bold text-persian-red-500 text-sm sm:text-base leading-tight">
                        {levelNames[lesson.difficultyLevel]}
                      </div>
                      <div className="text-xs text-persian-red-600 font-medium">
                        {levelCounts[lesson.difficultyLevel]?.completed} / {levelCounts[lesson.difficultyLevel]?.total} completed
                      </div>
                    </div>
                  </div>
                )}

                {/* Lesson Node */}
                <div className="relative flex items-start gap-3 sm:gap-4 pb-5 sm:pb-6">
                  {/* Node circle */}
                  <div
                    className={`relative z-10 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-emerald-500 border-2 border-emerald-600 text-white shadow-md"
                        : isCurrent
                        ? "bg-persian-red-500 border-2 border-persian-red-600 text-white shadow-lg ring-4 ring-persian-red-100"
                        : "bg-persian-beige-200 border-2 border-persian-beige-400 text-persian-beige-600"
                    }`}
                  >
                    {isCompleted ? (
                      <span className="text-xs sm:text-sm font-bold">✓</span>
                    ) : isLocked ? (
                      <span className="text-[10px] sm:text-xs">🔒</span>
                    ) : (
                      <span className="text-sm">{lesson.icon || "📖"}</span>
                    )}
                  </div>

                  {/* Lesson card */}
                  <div
                    className={`flex-1 rounded-lg border-2 p-3 sm:p-4 transition-all ${
                      isLocked
                        ? "border-persian-beige-300 bg-persian-beige-50 opacity-50"
                        : isCompleted
                        ? "border-emerald-300 bg-emerald-50/50"
                        : isCurrent
                        ? "border-persian-red-500 bg-white shadow-lg"
                        : "border-persian-red-200 bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className={`text-sm sm:text-base font-bold leading-tight ${
                          isLocked ? "text-persian-beige-500" : "text-persian-red-500"
                        }`}
                      >
                        {getLessonDisplayTitle(lesson, index)}
                      </h3>
                      {isCompleted && (
                        <span className="flex-shrink-0 text-[10px] sm:text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold border border-emerald-300">
                          ✓ Done
                        </span>
                      )}
                    </div>
                    <p
                      className={`text-xs mb-2 sm:mb-2.5 font-medium line-clamp-2 ${
                        isLocked ? "text-persian-beige-500" : "text-persian-red-700"
                      }`}
                    >
                      {lesson.description || "Learn essential grammar concepts"}
                    </p>
                    {!isLocked && (
                      <Link
                        href={`/dashboard/grammar/${lesson.id}`}
                        className={`inline-block px-3 py-1 sm:py-1.5 rounded-lg font-bold text-xs sm:text-sm transition-colors shadow-sm hover:shadow-md ${
                          isCompleted
                            ? "bg-emerald-500 text-white hover:bg-emerald-600"
                            : "bg-persian-red-500 text-white hover:bg-persian-red-600"
                        }`}
                      >
                        {isCompleted ? "Review" : isCurrent ? "Continue" : "Start Lesson"}{" "}
                        <span className="btn-arrow">→</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Finish node */}
          <div className="relative flex items-center gap-3 sm:gap-4">
            <div className="relative z-10 flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-persian-gold-500 border-2 border-persian-gold-700 flex items-center justify-center shadow-lg">
              <span className="text-sm">🏆</span>
            </div>
            <span className="font-bold text-persian-gold-600 text-sm sm:text-base">Grammar Mastered!</span>
          </div>
        </div>
      )}
    </div>
  );
}
