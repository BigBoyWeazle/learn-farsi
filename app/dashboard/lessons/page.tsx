"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getCompletedLessonIds, canAccessLesson } from "@/lib/lesson-progress";

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
    async function fetchLessons() {
      try {
        const response = await fetch("/api/lessons");
        const data = await response.json();
        setLessons(data.lessons || []);
        setCompletedLessonIds(getCompletedLessonIds());
      } catch (error) {
        console.error("Error fetching lessons:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-persian-red-500 mx-auto mb-4"></div>
          <p className="text-persian-red-700 font-medium">Loading lessons...</p>
        </div>
      </div>
    );
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
    3: "Intermediate",
    4: "Advanced",
    5: "Expert",
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-persian-red-500 mb-2">
          Farsi Lessons
        </h1>
        <p className="text-persian-red-700 font-medium">
          Learn Farsi step-by-step with structured lessons
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-persian-red-500 rounded-xl shadow-xl p-6 mb-8 text-white border-4 border-persian-red-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-1">Your Progress</h2>
            <p className="text-white">
              {completedLessonIds.length} of {lessons.length} lessons completed
            </p>
          </div>
          <div className="text-5xl">📚</div>
        </div>
        <div className="mt-4 bg-white/30 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full transition-all duration-500"
            style={{
              width: `${(completedLessonIds.length / lessons.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Lessons by Level */}
      {Object.entries(lessonsByLevel)
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
      className={`relative rounded-lg border-3 p-6 transition-all shadow-xl ${
        isLocked
          ? "border-persian-beige-400 bg-persian-beige-100 opacity-60"
          : isCompleted
          ? "border-persian-red-500 bg-persian-beige-100"
          : "border-persian-red-500 bg-white hover:border-persian-red-600 hover:shadow-2xl"
      }`}
    >
      {/* Lock/Completed Badge */}
      {isLocked && (
        <div className="absolute top-4 right-4 bg-persian-beige-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          🔒 Locked
        </div>
      )}
      {isCompleted && !isLocked && (
        <div className="absolute top-4 right-4 bg-[#4aa6a6] text-white px-3 py-1 rounded-full text-sm font-bold">
          ✓ Completed
        </div>
      )}

      {/* Category Icon */}
      <div className="text-5xl mb-3">{lesson.category.icon}</div>

      {/* Lesson Title */}
      <h3 className="text-xl font-bold text-persian-red-500 mb-2">
        {lesson.title}
      </h3>

      {/* Lesson Description */}
      <p className="text-persian-red-700 text-sm mb-4 font-medium">
        {lesson.description || lesson.category.description}
      </p>

      {/* Action Button */}
      {!isLocked && (
        <Link
          href={`/dashboard/lessons/${lesson.id}`}
          className="inline-block w-full text-center px-4 py-2 rounded-lg font-bold transition-colors shadow-md hover:shadow-lg bg-persian-red-500 text-white hover:bg-persian-red-600"
        >
          {isCompleted ? "Review Lesson" : "Start Lesson"} <span className="btn-arrow">→</span>
        </Link>
      )}
    </div>
  );
}
