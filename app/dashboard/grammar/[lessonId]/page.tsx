"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PageLoading } from "@/components/loading-spinner";

interface GrammarLesson {
  id: string;
  title: string;
  description: string | null;
  explanation: string;
  difficultyLevel: number;
  sortOrder: number;
  icon: string;
}

interface GrammarExercise {
  id: string;
  exerciseType: string;
  question: string;
}

export default function GrammarLessonPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;

  const [lesson, setLesson] = useState<GrammarLesson | null>(null);
  const [exerciseCount, setExerciseCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const response = await fetch(`/api/grammar/${lessonId}`);
        const data = await response.json();

        if (response.ok) {
          setLesson(data.lesson);
          setExerciseCount(data.exerciseCount);
        }
      } catch (error) {
        console.error("Error fetching grammar lesson:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchLesson();
  }, [lessonId]);

  if (loading) {
    return <PageLoading message="Loading grammar lesson..." />;
  }

  if (!lesson) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-white/40 backdrop-blur-lg border border-persian-red-400/40 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-xl p-8 text-center ring-1 ring-white/20">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-persian-red-500 mb-2">
            Lesson Not Found
          </h2>
          <p className="text-persian-red-700 font-medium mb-6">
            This grammar lesson could not be found.
          </p>
          <Link
            href="/dashboard/grammar"
            className="inline-block px-6 py-3 bg-persian-red-500/90 backdrop-blur-lg text-white rounded-lg hover:bg-persian-red-600 transition-colors font-semibold shadow-lg"
          >
            Back to Grammar Lessons
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Back Link */}
      <Link
        href="/dashboard/grammar"
        className="inline-flex items-center text-persian-red-600 hover:text-persian-red-700 font-medium mb-6"
      >
        ← Back to Grammar Lessons
      </Link>

      {/* Lesson Header */}
      <div className="bg-white/40 backdrop-blur-lg border border-persian-red-400/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-xl p-8 mb-8 ring-1 ring-white/20">
        <div className="flex items-start gap-4 mb-6">
          <div className="text-6xl">{lesson.icon || "📖"}</div>
          <div>
            <h1 className="text-3xl font-bold text-persian-red-500 mb-2">
              {lesson.title}
            </h1>
            <p className="text-persian-red-700 font-medium">
              {lesson.description || "Learn essential grammar concepts"}
            </p>
          </div>
        </div>

        {/* Lesson Stats */}
        <div className="flex gap-4 mb-6">
          <div className="bg-persian-beige-100/50 backdrop-blur-lg px-4 py-2 rounded-lg border border-persian-red-200/40 ring-1 ring-white/20">
            <span className="text-persian-red-700 font-semibold">
              {exerciseCount} exercises
            </span>
          </div>
          <div className="bg-persian-beige-100/50 backdrop-blur-lg px-4 py-2 rounded-lg border border-persian-red-200/40 ring-1 ring-white/20">
            <span className="text-persian-red-700 font-semibold">
              Level {lesson.difficultyLevel}
            </span>
          </div>
        </div>
      </div>

      {/* Grammar Explanation */}
      <div className="bg-white/40 backdrop-blur-lg border border-persian-red-400/40 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-xl p-8 mb-8 ring-1 ring-white/20">
        <h2 className="text-2xl font-bold text-persian-red-500 mb-6">
          <span className="inline-block w-7 h-7 overflow-hidden align-middle"><Image src="/multiplebooks_icon.png" alt="Books" width={40} height={40} className="w-full h-full object-cover scale-125" /></span> Grammar Explanation
        </h2>
        <div
          className="prose prose-persian max-w-none text-persian-red-700"
          style={{ direction: "ltr" }}
        >
          {/* Render explanation - supports basic markdown-like formatting */}
          {lesson.explanation.split('\n\n').map((paragraph, idx) => {
            // Check if it's a heading
            if (paragraph.startsWith('# ')) {
              return (
                <h3 key={idx} className="text-xl font-bold text-persian-red-500 mt-6 mb-3">
                  {paragraph.replace('# ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('## ')) {
              return (
                <h4 key={idx} className="text-lg font-bold text-persian-red-600 mt-4 mb-2">
                  {paragraph.replace('## ', '')}
                </h4>
              );
            }
            // Check if it's a list
            if (paragraph.includes('\n- ')) {
              const items = paragraph.split('\n- ').filter(Boolean);
              return (
                <ul key={idx} className="list-disc list-inside space-y-2 my-4">
                  {items.map((item, i) => (
                    <li key={i} className="text-persian-red-700">{item.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            }
            // Check if it contains Farsi text (for examples)
            if (paragraph.includes('→')) {
              return (
                <div key={idx} className="bg-persian-beige-100/50 backdrop-blur-lg p-4 rounded-lg my-4 border border-persian-red-200/40 ring-1 ring-white/20">
                  {paragraph.split('\n').map((line, i) => (
                    <p key={i} className="mb-1 font-medium">
                      {line}
                    </p>
                  ))}
                </div>
              );
            }
            // Regular paragraph
            return (
              <p key={idx} className="mb-4 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>
      </div>

      {/* Study Tips */}
      <div className="bg-amber-50/50 backdrop-blur-lg border border-amber-400/50 rounded-xl p-6 mb-8 ring-1 ring-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        <h3 className="text-lg font-bold text-amber-700 mb-3">💡 Study Tips</h3>
        <ul className="space-y-2 text-amber-800">
          <li>• Read through the explanation carefully before practicing</li>
          <li>• Pay attention to the examples - they show the grammar in context</li>
          <li>• You need <strong>80% or higher</strong> to complete this lesson</li>
          <li>• Don&apos;t worry if you make mistakes - you can always try again!</li>
        </ul>
      </div>

      {/* Start Practice Button */}
      {exerciseCount > 0 ? (
        <Link
          href={`/dashboard/grammar/${lessonId}/practice`}
          className="block w-full text-center py-4 px-6 bg-persian-red-500/90 backdrop-blur-lg text-white text-lg font-bold rounded-xl hover:bg-persian-red-600 transition-all shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-xl hover:scale-[1.02] border border-persian-red-600/50 ring-1 ring-white/10"
        >
          Start Practicing ({exerciseCount} exercises) <span className="btn-arrow">→</span>
        </Link>
      ) : (
        <div className="bg-persian-beige-100/50 backdrop-blur-lg border border-persian-red-200/40 rounded-xl p-6 text-center ring-1 ring-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
          <p className="text-persian-red-700 font-medium">
            Practice exercises for this lesson are coming soon!
          </p>
        </div>
      )}
    </div>
  );
}
