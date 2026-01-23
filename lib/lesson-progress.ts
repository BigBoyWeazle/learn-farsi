/**
 * Lesson progress tracking utilities
 * Manages user progress through lessons in localStorage
 */

export interface LessonProgressData {
  lessonId: string;
  isCompleted: boolean;
  completedAt: string | null;
  attempts: number;
  bestScore: number; // Percentage 0-100
}

const LESSON_PROGRESS_PREFIX = "lesson_progress_";

/**
 * Get progress for a specific lesson
 */
export function getLessonProgress(lessonId: string): LessonProgressData | null {
  if (typeof window === "undefined") return null;

  const key = `${LESSON_PROGRESS_PREFIX}${lessonId}`;
  const saved = localStorage.getItem(key);

  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Failed to parse lesson progress:", error);
    return null;
  }
}

/**
 * Save progress for a specific lesson
 */
export function saveLessonProgress(progress: LessonProgressData): void {
  if (typeof window === "undefined") return;

  const key = `${LESSON_PROGRESS_PREFIX}${progress.lessonId}`;
  localStorage.setItem(key, JSON.stringify(progress));
}

/**
 * Mark a lesson as completed
 */
export function completeLessson(lessonId: string, score: number): void {
  const existing = getLessonProgress(lessonId);

  const progress: LessonProgressData = {
    lessonId,
    isCompleted: true,
    completedAt: new Date().toISOString(),
    attempts: (existing?.attempts || 0) + 1,
    bestScore: Math.max(existing?.bestScore || 0, score),
  };

  saveLessonProgress(progress);
}

/**
 * Update lesson attempt (not necessarily completed)
 */
export function recordLessonAttempt(lessonId: string, score: number): void {
  const existing = getLessonProgress(lessonId);

  const progress: LessonProgressData = {
    lessonId,
    isCompleted: existing?.isCompleted || false,
    completedAt: existing?.completedAt || null,
    attempts: (existing?.attempts || 0) + 1,
    bestScore: Math.max(existing?.bestScore || 0, score),
  };

  saveLessonProgress(progress);
}

/**
 * Get all completed lesson IDs
 */
export function getCompletedLessonIds(): string[] {
  if (typeof window === "undefined") return [];

  const completedIds: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(LESSON_PROGRESS_PREFIX)) {
      const progress = localStorage.getItem(key);
      if (progress) {
        try {
          const data: LessonProgressData = JSON.parse(progress);
          if (data.isCompleted) {
            completedIds.push(data.lessonId);
          }
        } catch (error) {
          console.error("Failed to parse lesson progress:", error);
        }
      }
    }
  }

  return completedIds;
}

/**
 * Check if user can access a lesson (based on previous lesson completion)
 */
export function canAccessLesson(
  lessonSortOrder: number,
  completedLessonIds: string[],
  allLessons: Array<{ id: string; sortOrder: number }>
): boolean {
  // First lesson is always accessible
  if (lessonSortOrder === 1) return true;

  // Check if previous lesson is completed
  const previousLesson = allLessons.find(
    (l) => l.sortOrder === lessonSortOrder - 1
  );

  if (!previousLesson) return false;

  return completedLessonIds.includes(previousLesson.id);
}

/**
 * Get the next incomplete lesson
 */
export function getNextLessonId(
  allLessons: Array<{ id: string; sortOrder: number }>
): string | null {
  const completedIds = getCompletedLessonIds();

  // Find first lesson that's not completed
  const nextLesson = allLessons.find(
    (lesson) => !completedIds.includes(lesson.id)
  );

  return nextLesson?.id || null;
}
