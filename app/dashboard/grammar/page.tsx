"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { canAccessGrammarLesson, syncGrammarProgressFromDatabase } from "@/lib/grammar-progress";
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
        // Fetch grammar lessons
        const response = await fetch("/api/grammar");
        const data = await response.json();
        setLessons(data.lessons || []);

        // Sync progress from database (will also get localStorage progress)
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

  // Group lessons by difficulty level
  const lessonsByLevel = lessons.reduce((acc, lesson) => {
    const level = lesson.difficultyLevel;
    if (!acc[level]) acc[level] = [];
    acc[level].push(lesson);
    return acc;
  }, {} as Record<number, GrammarLesson[]>);

  const levelNames: Record<number, string> = {
    1: "Beginner",
    2: "Elementary",
    3: "Intermediate",
    4: "Advanced",
    5: "Expert",
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-persian-red-500 mb-2">
          Farsi Grammar
        </h1>
        <p className="text-persian-red-700 font-medium">
          Master Farsi grammar with structured lessons and exercises
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-persian-red-500 rounded-xl shadow-xl p-6 mb-8 text-white border-4 border-persian-red-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Your Grammar Progress</h2>
            <p className="text-white">
              {completedLessonIds.length} of {lessons.length} lessons completed
            </p>
          </div>
          <div className="w-14 h-14 overflow-hidden flex-shrink-0"><Image src="/bookicon.png" alt="Book" width={100} height={100} className="w-full h-full object-cover scale-125" /></div>
        </div>
        <div className="mt-4 bg-white/30 rounded-full h-3 overflow-hidden">
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
        className="block bg-white border-3 border-persian-gold-500 rounded-xl shadow-xl p-5 mb-8 hover:shadow-2xl hover:border-persian-gold-600 transition-all"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-4xl">📋</span>
            <div>
              <h3 className="text-lg font-bold text-persian-gold-700">Verb Tense Reference</h3>
              <p className="text-persian-gold-600 text-sm font-medium">Quick-lookup conjugation tables for all Farsi verb tenses</p>
            </div>
          </div>
          <span className="text-persian-gold-500 font-bold text-xl">&rarr;</span>
        </div>
      </Link>

      {lessons.length === 0 ? (
        <div className="bg-white border-3 border-persian-red-500 shadow-xl rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 overflow-hidden"><Image src="/bookicon.png" alt="Book" width={120} height={120} className="w-full h-full object-cover scale-125" /></div>
          <h2 className="text-2xl font-bold text-persian-red-500 mb-2">
            Coming Soon!
          </h2>
          <p className="text-persian-red-700 font-medium">
            Grammar lessons are being prepared. Check back soon!
          </p>
        </div>
      ) : (
        /* Lessons by Level */
        Object.entries(lessonsByLevel)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([level, levelLessons]) => (
            <div key={level} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-persian-red-500 text-white px-4 py-2 rounded-lg font-bold shadow-md border-2 border-persian-red-700">
                  Level {level}: {levelNames[Number(level)]}
                </div>
                <div className="text-sm text-persian-red-700 font-semibold">
                  {levelLessons.filter((l) => completedLessonIds.includes(l.id)).length} / {levelLessons.length} completed
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {levelLessons.map((lesson) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isAccessible = canAccessGrammarLesson(
                    lesson.sortOrder,
                    completedLessonIds,
                    lessons
                  );

                  return (
                    <GrammarLessonCard
                      key={lesson.id}
                      lesson={lesson}
                      isCompleted={isCompleted}
                      isLocked={!isAccessible}
                    />
                  );
                })}
              </div>
            </div>
          ))
      )}
    </div>
  );
}

interface GrammarLessonCardProps {
  lesson: GrammarLesson;
  isCompleted: boolean;
  isLocked: boolean;
}

function GrammarLessonCard({ lesson, isCompleted, isLocked }: GrammarLessonCardProps) {
  return (
    <div
      className={`relative rounded-lg border-3 p-3 sm:p-4 transition-all shadow-xl ${
        isLocked
          ? "border-persian-beige-400 bg-persian-beige-100 opacity-60"
          : isCompleted
          ? "border-persian-red-500 bg-persian-beige-100"
          : "border-persian-red-500 bg-white hover:border-persian-red-600 hover:shadow-2xl"
      }`}
    >
      {/* Lock/Completed Badge */}
      {isLocked && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-persian-beige-600 text-white px-2 py-0.5 rounded-full text-xs font-bold">
          🔒 Locked
        </div>
      )}
      {isCompleted && !isLocked && (
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-[#4aa6a6] text-white px-2 py-0.5 rounded-full text-xs font-bold">
          ✓ Done
        </div>
      )}

      {/* Icon + Title row */}
      <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
        <span className="text-lg sm:text-xl flex-shrink-0">{lesson.icon || "📖"}</span>
        <h3 className="text-sm sm:text-base font-bold text-persian-red-500 leading-tight">
          {lesson.title}
        </h3>
      </div>

      {/* Lesson Description */}
      <p className="text-persian-red-700 text-xs mb-2.5 sm:mb-3 font-medium line-clamp-2 pl-9 sm:pl-11">
        {lesson.description || "Learn essential grammar concepts"}
      </p>

      {/* Action Button */}
      {!isLocked && (
        <Link
          href={`/dashboard/grammar/${lesson.id}`}
          className="inline-block w-full text-center px-3 py-1.5 sm:py-2 rounded-lg font-bold transition-colors shadow-md hover:shadow-lg bg-persian-red-500 text-white hover:bg-persian-red-600 text-xs sm:text-sm"
        >
          {isCompleted ? "Review" : "Start Lesson"} <span className="btn-arrow">→</span>
        </Link>
      )}
    </div>
  );
}
