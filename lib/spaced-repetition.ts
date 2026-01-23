import type { UserProgress } from "@/db/schema";

export type Assessment = "easy" | "good" | "hard" | "again";

export interface ReviewUpdate {
  nextReviewDate: Date;
  easeFactor: string;
  repetitions: number;
  confidenceLevel: number;
  lastAssessment: Assessment;
  isLearned: boolean;
  reviewCount: number;
  lastReviewedAt: Date;
  updatedAt: Date;
  // Answer tracking fields
  lastAnswerCorrect: boolean;
  consecutiveCorrect: number;
  consecutiveWrong: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
}

/**
 * Calculate confidence level based on repetitions and assessment
 */
function getConfidenceLevel(repetitions: number, assessment: Assessment): number {
  if (assessment === "again") return 1;
  if (assessment === "hard") return Math.min(2, repetitions);
  if (assessment === "good") return Math.min(3, repetitions + 1);
  if (assessment === "easy") return Math.min(5, repetitions + 2);
  return 1;
}

/**
 * Calculate next review based on spaced repetition algorithm (SM-2 simplified)
 *
 * @param assessment - User's self-assessment of how well they know the word
 * @param isCorrect - Whether the user's answer was correct
 * @param currentProgress - Current progress record for the word (or null for first review)
 * @returns Updated progress fields for database
 */
export function calculateNextReview(
  assessment: Assessment,
  isCorrect: boolean,
  currentProgress: UserProgress | null = null
): ReviewUpdate {
  // If answer was incorrect, override assessment to "again"
  if (!isCorrect) {
    assessment = "again";
  }
  // Parse current values or use defaults for first review
  const currentEaseFactor = currentProgress?.easeFactor
    ? parseFloat(currentProgress.easeFactor)
    : 2.5;
  const currentRepetitions = currentProgress?.repetitions ?? 0;
  const currentReviewCount = currentProgress?.reviewCount ?? 0;

  // Answer tracking
  const currentCorrect = currentProgress?.totalCorrect ?? 0;
  const currentWrong = currentProgress?.totalWrong ?? 0;
  const currentConsecutiveCorrect = currentProgress?.consecutiveCorrect ?? 0;
  const currentConsecutiveWrong = currentProgress?.consecutiveWrong ?? 0;

  const totalCorrect = isCorrect ? currentCorrect + 1 : currentCorrect;
  const totalWrong = !isCorrect ? currentWrong + 1 : currentWrong;
  const consecutiveCorrect = isCorrect ? currentConsecutiveCorrect + 1 : 0;
  const consecutiveWrong = !isCorrect ? currentConsecutiveWrong + 1 : 0;

  // Calculate accuracy percentage
  const totalAnswers = totalCorrect + totalWrong;
  const accuracy = totalAnswers > 0 ? Math.round((totalCorrect / totalAnswers) * 100) : 0;

  let easeFactor = currentEaseFactor;
  let repetitions = currentRepetitions;
  let interval = 1; // Default to 1 day

  // Calculate based on assessment
  switch (assessment) {
    case "again":
      // Reset progress, review again tomorrow
      repetitions = 0;
      interval = 1;
      easeFactor = Math.max(1.3, easeFactor - 0.2);
      break;

    case "hard":
      // Don't increase repetitions, but do review soon
      interval = Math.max(1, interval * 1.2);
      easeFactor = Math.max(1.3, easeFactor - 0.15);
      break;

    case "good":
      // Standard progression
      repetitions += 1;
      if (repetitions === 1) {
        interval = 1; // Review tomorrow
      } else if (repetitions === 2) {
        interval = 6; // Review in 6 days
      } else {
        // Use ease factor for subsequent reviews
        interval = Math.round(interval * easeFactor);
      }
      break;

    case "easy":
      // Accelerated progression
      repetitions += 1;
      if (repetitions === 1) {
        interval = 4; // Review in 4 days
      } else {
        // Multiply by ease factor plus bonus
        interval = Math.round(interval * easeFactor * 1.3);
      }
      easeFactor = Math.min(2.5, easeFactor + 0.15);
      break;
  }

  // Calculate next review date
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + interval);

  // Calculate confidence level
  const confidenceLevel = getConfidenceLevel(repetitions, assessment);

  // Determine if word is "learned" (mastered)
  // Criteria: 5+ reviews, marked "easy" at least 3 times consecutively
  const isLearned = repetitions >= 5 && assessment === "easy" && confidenceLevel === 5;

  const now = new Date();

  return {
    nextReviewDate,
    easeFactor: easeFactor.toFixed(2),
    repetitions,
    confidenceLevel,
    lastAssessment: assessment,
    isLearned,
    reviewCount: currentReviewCount + 1,
    lastReviewedAt: now,
    updatedAt: now,
    // Answer tracking
    lastAnswerCorrect: isCorrect,
    consecutiveCorrect,
    consecutiveWrong,
    totalCorrect,
    totalWrong,
    accuracy,
  };
}

/**
 * Get a human-readable description of when the next review is due
 */
export function getNextReviewDescription(nextReviewDate: Date): string {
  const now = new Date();
  const diffTime = nextReviewDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "Due now";
  } else if (diffDays === 0) {
    return "Due today";
  } else if (diffDays === 1) {
    return "Due tomorrow";
  } else if (diffDays < 7) {
    return `Due in ${diffDays} days`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Due in ${weeks} week${weeks > 1 ? 's' : ''}`;
  } else {
    const months = Math.floor(diffDays / 30);
    return `Due in ${months} month${months > 1 ? 's' : ''}`;
  }
}
