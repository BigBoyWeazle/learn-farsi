"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { canAccessLesson, syncLessonProgressFromDatabase } from "@/lib/lesson-progress";
import { PageLoading } from "@/components/loading-spinner";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
}

interface Lesson {
  id: string;
  categoryId: string;
  title: string;
  description: string | null;
  difficultyLevel: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  category: Category;
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLessonsAndProgress() {
      try {
        // Fetch lessons
        const response = await fetch("/api/lessons");
        const data = await response.json();
        setLessons(data.lessons || []);

        // Sync progress from database (will also get localStorage progress)
        const completedIds = await syncLessonProgressFromDatabase();
        setCompletedLessonIds(completedIds);
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLessonsAndProgress();
  }, []);

  if (loading) {
    return <PageLoading message="Loading lessons..." />;
  }

  // Group lessons by difficulty level
  const lessonsByLevel = lessons.reduce((acc, lesson) => {
    const level = lesson.difficultyLevel;
    if (!acc[level]) acc[level] = [];
    acc[level].push(lesson);
    return acc;
  }, {} as Record<number, Lesson[]>);

  const levelNames: Record<number, string> = {
    1: "Beginner",
    2: "Elementary",
    3: "Pre-Intermediate",
    4: "Intermediate",
    5: "Advanced",
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-0">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-persian-red-500 mb-1">
          Farsi Lessons
        </h1>
        <p className="text-persian-red-700 font-medium text-sm sm:text-base">
          Learn Farsi step-by-step with structured lessons
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-persian-red-500 rounded-xl shadow-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white border-4 border-persian-red-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-bold mb-1">Your Progress</h2>
            <p className="text-white text-sm sm:text-base">
              {completedLessonIds.length} of {lessons.length} lessons completed
            </p>
          </div>
          <div className="w-10 h-10 sm:w-14 sm:h-14 overflow-hidden flex-shrink-0"><Image src="/multiplebooks_icon.png" alt="Books" width={100} height={100} className="w-full h-full object-cover scale-125" /></div>
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

      {/* Lessons by Level */}
      {Object.entries(lessonsByLevel)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([level, levelLessons]) => (
          <div key={level} className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="bg-persian-red-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-bold shadow-md border-2 border-persian-red-700 text-sm sm:text-base">
                Level {level}: {levelNames[Number(level)]}
              </div>
              <div className="text-xs sm:text-sm text-persian-red-700 font-semibold">
                {levelLessons.filter((l) => completedLessonIds.includes(l.id)).length} / {levelLessons.length} completed
              </div>
            </div>

            <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
              {levelLessons.map((lesson) => {
                const isCompleted = completedLessonIds.includes(lesson.id);
                const isAccessible = canAccessLesson(
                  lesson.sortOrder,
                  completedLessonIds,
                  lessons
                );

                return (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    isCompleted={isCompleted}
                    isLocked={!isAccessible}
                  />
                );
              })}
            </div>
          </div>
        ))}
    </div>
  );
}

interface LessonCardProps {
  lesson: Lesson;
  isCompleted: boolean;
  isLocked: boolean;
}

function LessonCard({ lesson, isCompleted, isLocked }: LessonCardProps) {
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
        <span className="text-lg sm:text-xl flex-shrink-0">{lesson.category.icon}</span>
        <h3 className="text-sm sm:text-base font-bold text-persian-red-500 leading-tight">
          {lesson.title}
        </h3>
      </div>

      {/* Lesson Description */}
      <p className="text-persian-red-700 text-xs mb-2.5 sm:mb-3 font-medium line-clamp-2 pl-9 sm:pl-11">
        {lesson.description || lesson.category.description}
      </p>

      {/* Action Button */}
      {!isLocked && (
        <Link
          href={`/dashboard/lessons/${lesson.id}`}
          className="inline-block w-full text-center px-3 py-1.5 sm:py-2 rounded-lg font-bold transition-colors shadow-md hover:shadow-lg bg-persian-red-500 text-white hover:bg-persian-red-600 text-xs sm:text-sm"
        >
          {isCompleted ? "Review" : "Start Lesson"} <span className="btn-arrow">→</span>
        </Link>
      )}
    </div>
  );
}
