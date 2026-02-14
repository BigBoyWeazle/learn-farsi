import { distance } from "fastest-levenshtein";

export interface ValidationResult {
  isCorrect: boolean;
  similarity: number;
  feedback: string;
}

/**
 * Strip parenthetical annotations like (formal), (informal), (plural) from answers
 */
function stripAnnotations(str: string): string {
  return str.replace(/\s*\([^)]*\)/g, "").trim();
}

/**
 * Common English contractions and their expanded forms
 */
const contractionMap: [RegExp, string][] = [
  [/\bi'm\b/g, "i am"],
  [/\byou're\b/g, "you are"],
  [/\bwe're\b/g, "we are"],
  [/\bthey're\b/g, "they are"],
  [/\bhe's\b/g, "he is"],
  [/\bshe's\b/g, "she is"],
  [/\bit's\b/g, "it is"],
  [/\bthat's\b/g, "that is"],
  [/\bthere's\b/g, "there is"],
  [/\bwhat's\b/g, "what is"],
  [/\bwhere's\b/g, "where is"],
  [/\bwho's\b/g, "who is"],
  [/\bhow's\b/g, "how is"],
  [/\bdon't\b/g, "do not"],
  [/\bdoesn't\b/g, "does not"],
  [/\bdidn't\b/g, "did not"],
  [/\bisn't\b/g, "is not"],
  [/\baren't\b/g, "are not"],
  [/\bwasn't\b/g, "was not"],
  [/\bweren't\b/g, "were not"],
  [/\bwon't\b/g, "will not"],
  [/\bcan't\b/g, "cannot"],
  [/\bcouldn't\b/g, "could not"],
  [/\bshouldn't\b/g, "should not"],
  [/\bwouldn't\b/g, "would not"],
  [/\bhaven't\b/g, "have not"],
  [/\bhasn't\b/g, "has not"],
  [/\bi've\b/g, "i have"],
  [/\byou've\b/g, "you have"],
  [/\bwe've\b/g, "we have"],
  [/\bthey've\b/g, "they have"],
  [/\bi'll\b/g, "i will"],
  [/\byou'll\b/g, "you will"],
  [/\bwe'll\b/g, "we will"],
  [/\bthey'll\b/g, "they will"],
  [/\bhe'll\b/g, "he will"],
  [/\bshe'll\b/g, "she will"],
  [/\bi'd\b/g, "i would"],
  [/\byou'd\b/g, "you would"],
  [/\bwe'd\b/g, "we would"],
  [/\bthey'd\b/g, "they would"],
  [/\bhe'd\b/g, "he would"],
  [/\bshe'd\b/g, "she would"],
  [/\blet's\b/g, "let us"],
];

/**
 * Expand contractions in a string: "I'm" → "i am"
 */
function expandContractions(str: string): string {
  let result = str;
  for (const [pattern, replacement] of contractionMap) {
    result = result.replace(pattern, replacement);
  }
  return result;
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

  // Strip annotations like (formal), (informal) from the correct answer
  const cleanedAnswer = stripAnnotations(correctAnswer);

  // Normalize both inputs
  const userNorm = normalize(userAnswer);
  const correctNorm = normalize(cleanedAnswer);

  // Also create expanded (no contractions) versions for comparison
  const userExpanded = expandContractions(userNorm);
  const correctExpanded = expandContractions(correctNorm);

  // 1. Exact match (including contraction variants)
  if (
    userNorm === correctNorm ||
    userExpanded === correctExpanded ||
    userExpanded === correctNorm ||
    userNorm === correctExpanded
  ) {
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
      const validExpanded = expandContractions(validAnswer);
      if (
        userNorm === validAnswer ||
        userExpanded === validExpanded ||
        userExpanded === validAnswer ||
        userNorm === validExpanded
      ) {
        return {
          isCorrect: true,
          similarity: 1.0,
          feedback: "Correct!",
        };
      }
    }

    // Check fuzzy match against all valid answers (both forms)
    for (const validAnswer of validAnswers) {
      const validExpanded = expandContractions(validAnswer);
      const sim1 = calculateSimilarity(userNorm, validAnswer);
      const sim2 = calculateSimilarity(userExpanded, validExpanded);
      const similarity = Math.max(sim1, sim2);
      if (similarity >= 0.85) {
        return {
          isCorrect: true,
          similarity,
          feedback: "Correct! (Small typo, but we got it)",
        };
      }
    }
  }

  // 3. Fuzzy match for typos (both contracted and expanded forms)
  const sim1 = calculateSimilarity(userNorm, correctNorm);
  const sim2 = calculateSimilarity(userExpanded, correctExpanded);
  const similarity = Math.max(sim1, sim2);

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
