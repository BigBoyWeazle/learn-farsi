/**
 * Grammar progress tracking utilities
 * Manages user progress through grammar lessons
 * - Uses localStorage for quick access
 * - Syncs with database for authenticated users
 */

export interface GrammarProgressData {
  lessonId: string;
  isCompleted: boolean;
  completedAt: string | null;
  attempts: number;
  bestScore: number; // Percentage 0-100
}

export interface DatabaseGrammarProgress {
  id: string;
  grammarLessonId: string;
  userId: string;
  isCompleted: boolean;
  completedAt: string | null;
  attempts: number;
  bestScore: number;
}

const GRAMMAR_PROGRESS_PREFIX = "grammar_progress_";
const DB_GRAMMAR_CACHE_KEY = "grammar_progress_from_db";

/**
 * Get progress for a specific grammar lesson
 */
export function getGrammarProgress(lessonId: string): GrammarProgressData | null {
  if (typeof window === "undefined") return null;

  const key = `${GRAMMAR_PROGRESS_PREFIX}${lessonId}`;
  const saved = localStorage.getItem(key);

  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Failed to parse grammar progress:", error);
    return null;
  }
}

/**
 * Save progress for a specific grammar lesson
 */
export function saveGrammarProgress(progress: GrammarProgressData): void {
  if (typeof window === "undefined") return;

  const key = `${GRAMMAR_PROGRESS_PREFIX}${progress.lessonId}`;
  localStorage.setItem(key, JSON.stringify(progress));
}

/**
 * Mark a grammar lesson as completed
 * Saves to both localStorage and database (for authenticated users)
 */
export function completeGrammarLesson(lessonId: string, score: number): void {
  const existing = getGrammarProgress(lessonId);

  const progress: GrammarProgressData = {
    lessonId,
    isCompleted: true,
    completedAt: new Date().toISOString(),
    attempts: (existing?.attempts || 0) + 1,
    bestScore: Math.max(existing?.bestScore || 0, score),
  };

  saveGrammarProgress(progress);

  // Also save to database for authenticated users
  saveGrammarProgressToDatabase(lessonId, score, true);
}

/**
 * Update grammar lesson attempt (not necessarily completed)
 * Saves to both localStorage and database (for authenticated users)
 */
export function recordGrammarAttempt(lessonId: string, score: number): void {
  const existing = getGrammarProgress(lessonId);

  const progress: GrammarProgressData = {
    lessonId,
    isCompleted: existing?.isCompleted || false,
    completedAt: existing?.completedAt || null,
    attempts: (existing?.attempts || 0) + 1,
    bestScore: Math.max(existing?.bestScore || 0, score),
  };

  saveGrammarProgress(progress);

  // Also save to database for authenticated users
  saveGrammarProgressToDatabase(lessonId, score, false);
}

/**
 * Save grammar progress to database (async, fire-and-forget)
 */
function saveGrammarProgressToDatabase(
  lessonId: string,
  score: number,
  isCompleted: boolean
): void {
  fetch("/api/grammar/progress", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lessonId, score, isCompleted }),
  }).catch((err) => {
    console.error("Failed to save grammar progress to database:", err);
  });
}

/**
 * Fetch grammar progress from database and merge with localStorage
 * Call this on page load for authenticated users
 */
export async function syncGrammarProgressFromDatabase(): Promise<string[]> {
  try {
    const response = await fetch("/api/grammar/progress");
    if (!response.ok) return getCompletedGrammarLessonIds();

    const data = await response.json();
    const dbProgress: DatabaseGrammarProgress[] = data.progress || [];

    // Merge database progress with localStorage
    for (const progress of dbProgress) {
      const localProgress = getGrammarProgress(progress.grammarLessonId);

      // If database has completion but localStorage doesn't, sync it
      if (progress.isCompleted && (!localProgress || !localProgress.isCompleted)) {
        const merged: GrammarProgressData = {
          lessonId: progress.grammarLessonId,
          isCompleted: progress.isCompleted,
          completedAt: progress.completedAt,
          attempts: Math.max(progress.attempts, localProgress?.attempts || 0),
          bestScore: Math.max(progress.bestScore, localProgress?.bestScore || 0),
        };
        saveGrammarProgress(merged);
      }
    }

    // Cache that we've synced from database
    if (typeof window !== "undefined") {
      localStorage.setItem(DB_GRAMMAR_CACHE_KEY, Date.now().toString());
    }

    return getCompletedGrammarLessonIds();
  } catch (error) {
    console.error("Failed to sync grammar progress from database:", error);
    return getCompletedGrammarLessonIds();
  }
}

/**
 * Get all completed grammar lesson IDs
 */
export function getCompletedGrammarLessonIds(): string[] {
  if (typeof window === "undefined") return [];

  const completedIds: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(GRAMMAR_PROGRESS_PREFIX)) {
      const progress = localStorage.getItem(key);
      if (progress) {
        try {
          const data: GrammarProgressData = JSON.parse(progress);
          if (data.isCompleted) {
            completedIds.push(data.lessonId);
          }
        } catch (error) {
          console.error("Failed to parse grammar progress:", error);
        }
      }
    }
  }

  return completedIds;
}

/**
 * Check if user can access a grammar lesson (based on previous lesson completion)
 */
export function canAccessGrammarLesson(
  lessonSortOrder: number,
  completedLessonIds: string[],
  allLessons: Array<{ id: string; sortOrder: number }>
): boolean {
  // First lesson (lowest sort order) is always accessible
  const sortedLessons = [...allLessons].sort((a, b) => a.sortOrder - b.sortOrder);

  if (sortedLessons.length === 0) return false;
  if (lessonSortOrder === sortedLessons[0].sortOrder) return true;

  // Find the lesson immediately before this one in sort order
  const currentIndex = sortedLessons.findIndex((l) => l.sortOrder === lessonSortOrder);
  if (currentIndex <= 0) return currentIndex === 0;

  const previousLesson = sortedLessons[currentIndex - 1];
  return completedLessonIds.includes(previousLesson.id);
}
