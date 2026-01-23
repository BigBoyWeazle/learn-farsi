import { distance } from "fastest-levenshtein";

export interface ValidationResult {
  isCorrect: boolean;
  similarity: number;
  feedback: string;
}

/**
 * Normalize a string for comparison
 * - Convert to lowercase
 * - Trim whitespace
 * - Remove punctuation
 */
function normalize(str: string): string {
  return str.toLowerCase().trim().replace(/[.,!?؟،]/g, "");
}

/**
 * Calculate similarity between two strings using Levenshtein distance
 * Returns a value between 0 (completely different) and 1 (identical)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const dist = distance(str1, str2);
  const maxLen = Math.max(str1.length, str2.length);

  if (maxLen === 0) return 1.0; // Both strings are empty

  return 1 - dist / maxLen;
}

/**
 * Validate user's answer against the correct answer
 *
 * @param userAnswer - The answer provided by the user
 * @param correctAnswer - The correct English translation
 * @returns ValidationResult with correctness, similarity score, and feedback
 *
 * @example
 * validateAnswer("hello", "Hello") // { isCorrect: true, similarity: 1.0, feedback: "Perfect!" }
 * validateAnswer("helo", "hello")  // { isCorrect: true, similarity: 0.9, feedback: "Correct! (Small typo, but we got it)" }
 * validateAnswer("goodbye", "hello") // { isCorrect: false, similarity: 0.28, feedback: "Not quite. Try again!" }
 */
export function validateAnswer(
  userAnswer: string,
  correctAnswer: string
): ValidationResult {
  // Handle empty answers
  if (!userAnswer || userAnswer.trim() === "") {
    return {
      isCorrect: false,
      similarity: 0,
      feedback: "Please enter an answer",
    };
  }

  // Normalize both inputs
  const userNorm = normalize(userAnswer);
  const correctNorm = normalize(correctAnswer);

  // 1. Exact match
  if (userNorm === correctNorm) {
    return {
      isCorrect: true,
      similarity: 1.0,
      feedback: "Perfect!",
    };
  }

  // 2. Check if correct answer contains multiple valid translations
  // Example: "House / Home" → both "house" and "home" are correct
  const validAnswers = correctNorm.split("/").map((s) => s.trim());

  if (validAnswers.length > 1) {
    for (const validAnswer of validAnswers) {
      if (userNorm === validAnswer) {
        return {
          isCorrect: true,
          similarity: 1.0,
          feedback: "Correct!",
        };
      }
    }

    // Check fuzzy match against all valid answers
    for (const validAnswer of validAnswers) {
      const similarity = calculateSimilarity(userNorm, validAnswer);
      if (similarity >= 0.85) {
        return {
          isCorrect: true,
          similarity,
          feedback: "Correct! (Small typo, but we got it)",
        };
      }
    }
  }

  // 3. Fuzzy match for typos (single answer)
  const similarity = calculateSimilarity(userNorm, correctNorm);

  if (similarity >= 0.85) {
    // Close enough - accept with typo note
    return {
      isCorrect: true,
      similarity,
      feedback: "Correct! (Small typo, but we got it)",
    };
  }

  // 4. Incorrect answer
  return {
    isCorrect: false,
    similarity,
    feedback: "Not quite. Try again!",
  };
}

/**
 * Get a human-readable percentage representation of similarity
 */
export function getSimilarityPercentage(similarity: number): number {
  return Math.round(similarity * 100);
}
