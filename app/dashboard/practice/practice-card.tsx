"use client";

import type { Vocabulary } from "@/db/schema";
import type { Assessment } from "@/lib/spaced-repetition";
import { validateAnswer, type ValidationResult } from "@/lib/answer-validation";
import { useState, useEffect } from "react";

interface PracticeCardProps {
  word: Vocabulary;
  currentIndex: number;
  totalWords: number;
  onAssessment: (assessment: Assessment, isCorrect: boolean) => void;
}

type CardState = "question" | "correct" | "incorrect";

export default function PracticeCard({
  word,
  currentIndex,
  totalWords,
  onAssessment,
}: PracticeCardProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [cardState, setCardState] = useState<CardState>("question");
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  // Reset state when word changes
  useEffect(() => {
    setUserAnswer("");
    setCardState("question");
    setValidationResult(null);
    setShowAnimation(false);
  }, [word.id]);

  // Handle Enter key to continue when showing result
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (cardState === "correct" || cardState === "incorrect")) {
        e.preventDefault();
        handleContinue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cardState, validationResult]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = validateAnswer(userAnswer, word.englishTranslation);
    setValidationResult(result);

    if (result.isCorrect) {
      setCardState("correct");
      setShowAnimation(true);
      // Animation lasts 600ms
      setTimeout(() => setShowAnimation(false), 600);
    } else {
      setCardState("incorrect");
      setShowAnimation(true);
      // Animation lasts 500ms
      setTimeout(() => setShowAnimation(false), 500);
    }
  };

  const handleContinue = () => {
    // For correct answers, use "good" assessment by default
    // For incorrect answers, use "again" assessment
    const assessment = cardState === "correct" ? "good" : "again";
    onAssessment(assessment, validationResult?.isCorrect ?? false);
  };

  // Calculate progress percentage
  const progressPercent = ((currentIndex + 1) / totalWords) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-persian-red-700">
            Practice Session
          </h2>
          <span className="text-sm text-persian-red-600 font-medium">
            {currentIndex + 1} of {totalWords}
          </span>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-persian-beige-200 rounded-full h-3 border border-persian-red-300">
          <div
            className="bg-persian-red-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className={`bg-white border-3 border-persian-red-500 shadow-2xl rounded-2xl p-12 min-h-[500px] flex flex-col justify-between transition-all duration-300 ${
          showAnimation && cardState === "correct" ? "animate-correct-pulse" : ""
        } ${showAnimation && cardState === "incorrect" ? "animate-shake" : ""}`}
      >
        {cardState === "question" ? (
          /* Question State - Input Form */
          <div className="flex-1 flex flex-col items-center justify-center space-y-8">
            {/* Phonetic Word - Large Display */}
            <div className="text-center">
              <div className="text-6xl font-bold text-persian-red-500 capitalize mb-4">
                {word.phonetic || word.farsiWord}
              </div>
              <p className="text-persian-red-700 text-lg font-medium">
                What does this mean in English?
              </p>
            </div>

            {/* Answer Input Form */}
            <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type answer here..."
                className="w-full px-6 py-4 text-lg border-2 border-persian-red-300 rounded-lg focus:border-persian-red-500 focus:outline-none transition-colors text-persian-red-700 placeholder:text-persian-red-400"
                autoFocus
                autoComplete="off"
              />

              <button
                type="submit"
                disabled={!userAnswer.trim()}
                className="w-full px-8 py-4 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 disabled:bg-persian-beige-300 disabled:text-persian-red-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Submit Answer <span className="btn-arrow">→</span>
              </button>
            </form>

            {/* Difficulty Indicator - Fun colorful badge */}
            {word.difficultyLevel && (
              <div className="flex justify-center mt-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${
                  word.difficultyLevel === 1 ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-400" :
                  word.difficultyLevel === 2 ? "bg-sky-100 text-sky-700 border-2 border-sky-400" :
                  word.difficultyLevel === 3 ? "bg-amber-100 text-amber-700 border-2 border-amber-400" :
                  word.difficultyLevel === 4 ? "bg-orange-100 text-orange-700 border-2 border-orange-400" :
                  "bg-rose-100 text-rose-700 border-2 border-rose-400"
                }`}>
                  <span>
                    {word.difficultyLevel === 1 ? "🌱" :
                     word.difficultyLevel === 2 ? "📘" :
                     word.difficultyLevel === 3 ? "⭐" :
                     word.difficultyLevel === 4 ? "🔥" :
                     "👑"}
                  </span>
                  {word.difficultyLevel === 1 ? "Beginner" :
                   word.difficultyLevel === 2 ? "Elementary" :
                   word.difficultyLevel === 3 ? "Intermediate" :
                   word.difficultyLevel === 4 ? "Advanced" :
                   "Expert"}
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Answer Revealed State */
          <div className="flex-1 flex flex-col justify-between">
            {/* Feedback Header */}
            <div className={`text-center mb-6 ${showAnimation ? "animate-bounce-in" : ""}`}>
              {cardState === "correct" ? (
                <div className="space-y-2">
                  <div className="text-5xl">✅</div>
                  <div className="text-2xl font-bold text-emerald-600">
                    {validationResult?.feedback}
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-5xl">❌</div>
                  <div className="text-2xl font-bold text-rose-600">
                    {validationResult?.feedback}
                  </div>
                </div>
              )}
            </div>

            {/* Middle: Answer Comparison */}
            <div className="flex-1 flex flex-col justify-center space-y-6">
              {/* Phonetic (smaller) */}
              <div className="text-center">
                <div className="text-2xl font-semibold text-persian-red-500 capitalize mb-4">
                  {word.phonetic || word.farsiWord}
                </div>
              </div>

              {/* Answer Comparison */}
              <div className="text-center space-y-3 p-6 bg-persian-beige-100 rounded-lg border-2 border-persian-red-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <span className="text-persian-red-600 font-medium">Your answer:</span>
                    <div className={`font-semibold ${cardState === "correct" ? "text-emerald-600" : "text-rose-600"}`}>
                      {userAnswer}
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-persian-red-600 font-medium">Correct answer:</span>
                    <div className="font-semibold text-persian-red-700">
                      {word.englishTranslation}
                    </div>
                  </div>
                </div>
              </div>

              {/* Farsi Script */}
              <div className="text-center">
                <div
                  className="text-4xl font-semibold text-persian-red-700 mb-3"
                  style={{ direction: "rtl", fontFamily: "serif" }}
                >
                  {word.farsiWord}
                </div>
              </div>

              {/* Example Sentences */}
              {word.exampleFarsi && word.exampleEnglish && (
                <div className="mt-6 pt-6 border-t border-persian-red-200">
                  <div className="text-sm text-persian-red-700 font-semibold mb-3 text-center">
                    Example:
                  </div>
                  <div className="space-y-2 text-center">
                    <div
                      className="text-base text-persian-red-700 font-medium"
                      style={{ direction: "rtl" }}
                    >
                      {word.exampleFarsi}
                    </div>
                    {word.examplePhonetic && (
                      <div className="text-sm text-persian-red-600 italic">
                        ({word.examplePhonetic})
                      </div>
                    )}
                    <div className="text-base text-persian-red-600 italic">
                      {word.exampleEnglish}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom: Continue Button */}
            <div className="mt-8">
              <button
                onClick={handleContinue}
                className={`w-full px-8 py-4 text-white rounded-lg transition-colors text-lg font-semibold shadow-lg hover:shadow-xl ${
                  cardState === "correct"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-persian-red-500 hover:bg-persian-red-600"
                }`}
              >
                {cardState === "correct" ? <>Continue <span className="btn-arrow">→</span></> : "Continue (Review Again)"} <span className="text-sm opacity-75">[Enter]</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
