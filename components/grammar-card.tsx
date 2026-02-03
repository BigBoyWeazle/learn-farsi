"use client";

import { useState, useEffect } from "react";

interface GrammarExercise {
  id: string;
  exerciseType: string;
  question: string;
  questionFarsi: string | null;
  correctAnswer: string;
  alternatives: string | null;
  hint: string | null;
  explanation: string | null;
}

interface GrammarCardProps {
  exercise: GrammarExercise;
  currentIndex: number;
  totalExercises: number;
  onAnswer: (isCorrect: boolean) => void;
}

type CardState = "question" | "correct" | "incorrect";

export default function GrammarCard({
  exercise,
  currentIndex,
  totalExercises,
  onAnswer,
}: GrammarCardProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [cardState, setCardState] = useState<CardState>("question");
  const [showHint, setShowHint] = useState(false);

  // Parse alternatives for multiple choice
  const alternatives = exercise.alternatives
    ? JSON.parse(exercise.alternatives) as string[]
    : [];

  // Reset state when exercise changes
  useEffect(() => {
    setUserAnswer("");
    setSelectedOption(null);
    setCardState("question");
    setShowHint(false);
  }, [exercise.id]);

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
  }, [cardState]);

  const normalizeAnswer = (answer: string): string => {
    return answer
      .toLowerCase()
      .trim()
      .replace(/[\u200C\u200D]/g, "") // Remove zero-width characters
      .replace(/\s+/g, " "); // Normalize whitespace
  };

  const checkAnswer = (): boolean => {
    const userNormalized = normalizeAnswer(
      exercise.exerciseType === "multiple_choice" ? selectedOption || "" : userAnswer
    );
    const correctNormalized = normalizeAnswer(exercise.correctAnswer);

    // For multiple choice, exact match
    if (exercise.exerciseType === "multiple_choice") {
      return userNormalized === correctNormalized;
    }

    // For text input, allow some flexibility
    return userNormalized === correctNormalized;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isCorrect = checkAnswer();
    setCardState(isCorrect ? "correct" : "incorrect");
  };

  const handleContinue = () => {
    onAnswer(cardState === "correct");
  };

  const handleMultipleChoiceSelect = (option: string) => {
    if (cardState === "question") {
      setSelectedOption(option);
    }
  };

  // Calculate progress percentage
  const progressPercent = ((currentIndex + 1) / totalExercises) * 100;

  // Render exercise based on type
  const renderExercise = () => {
    switch (exercise.exerciseType) {
      case "multiple_choice":
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-persian-red-500 mb-2">
                {exercise.question}
              </div>
              {exercise.questionFarsi && (
                <div
                  className="text-xl text-persian-red-700"
                  style={{ direction: "rtl" }}
                >
                  {exercise.questionFarsi}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
              {alternatives.map((option, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleMultipleChoiceSelect(option)}
                  disabled={cardState !== "question"}
                  className={`p-4 rounded-lg border-2 text-lg font-medium transition-all ${
                    selectedOption === option
                      ? "border-persian-red-500 bg-persian-red-50 text-persian-red-700"
                      : "border-persian-beige-300 hover:border-persian-red-300 text-persian-red-600"
                  } ${cardState !== "question" ? "cursor-default" : "cursor-pointer"}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {selectedOption && cardState === "question" && (
              <button
                onClick={handleSubmit}
                className="w-full mt-6 px-8 py-4 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Check Answer <span className="btn-arrow">→</span>
              </button>
            )}
          </div>
        );

      case "fill_blank":
      case "conjugation":
      case "translate":
      default:
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <div className="text-2xl font-bold text-persian-red-500 mb-2">
                {exercise.question}
              </div>
              {exercise.questionFarsi && (
                <div
                  className="text-xl text-persian-red-700 mt-2"
                  style={{ direction: "rtl" }}
                >
                  {exercise.questionFarsi}
                </div>
              )}
            </div>

            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Type your answer..."
              className="w-full px-6 py-4 text-lg border-2 border-persian-red-300 rounded-lg focus:border-persian-red-500 focus:outline-none transition-colors text-persian-red-700 placeholder:text-persian-red-400"
              autoFocus
              autoComplete="off"
              disabled={cardState !== "question"}
            />

            {cardState === "question" && (
              <button
                type="submit"
                disabled={!userAnswer.trim()}
                className="w-full px-8 py-4 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 disabled:bg-persian-beige-300 disabled:text-persian-red-400 disabled:cursor-not-allowed transition-colors text-lg font-semibold shadow-lg hover:shadow-xl"
              >
                Check Answer <span className="btn-arrow">→</span>
              </button>
            )}
          </form>
        );
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold text-persian-red-700">
            Grammar Exercise
          </h2>
          <span className="text-sm text-persian-red-600 font-medium">
            {currentIndex + 1} of {totalExercises}
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
        className={`bg-white border-3 border-persian-red-500 shadow-2xl rounded-2xl p-12 min-h-[450px] flex flex-col justify-between transition-all duration-300`}
      >
        {cardState === "question" ? (
          /* Question State */
          <div className="flex-1 flex flex-col justify-center">
            {/* Exercise Type Badge */}
            <div className="flex justify-center mb-6">
              <span className="px-4 py-2 bg-persian-beige-100 text-persian-red-700 rounded-full text-sm font-bold border-2 border-persian-red-200">
                {exercise.exerciseType === "multiple_choice" && "🔘 Multiple Choice"}
                {exercise.exerciseType === "fill_blank" && "✏️ Fill in the Blank"}
                {exercise.exerciseType === "conjugation" && "🔤 Conjugation"}
                {exercise.exerciseType === "translate" && "🌐 Translation"}
              </span>
            </div>

            {renderExercise()}

            {/* Hint Button */}
            {exercise.hint && cardState === "question" && (
              <div className="mt-6 text-center">
                {showHint ? (
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4">
                    <p className="text-amber-700 font-medium">
                      💡 Hint: {exercise.hint}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowHint(true)}
                    className="text-persian-red-600 hover:text-persian-red-700 font-medium"
                  >
                    Need a hint? 💡
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Result State */
          <div className="flex-1 flex flex-col justify-between">
            {/* Feedback Header */}
            <div className="text-center mb-6">
              {cardState === "correct" ? (
                <div className="space-y-2">
                  <div className="text-5xl">✅</div>
                  <div className="text-2xl font-bold text-emerald-600">
                    Correct!
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="text-5xl">❌</div>
                  <div className="text-2xl font-bold text-rose-600">
                    Not quite right
                  </div>
                </div>
              )}
            </div>

            {/* Answer Comparison */}
            <div className="flex-1 flex flex-col justify-center space-y-4">
              <div className="text-center space-y-3 p-6 bg-persian-beige-100 rounded-lg border-2 border-persian-red-200">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-left">
                    <span className="text-persian-red-600 font-medium">Your answer:</span>
                    <div className={`font-semibold text-lg ${cardState === "correct" ? "text-emerald-600" : "text-rose-600"}`}>
                      {exercise.exerciseType === "multiple_choice" ? selectedOption : userAnswer}
                    </div>
                  </div>
                  <div className="text-left">
                    <span className="text-persian-red-600 font-medium">Correct answer:</span>
                    <div className="font-semibold text-lg text-persian-red-700">
                      {exercise.correctAnswer}
                    </div>
                  </div>
                </div>
              </div>

              {/* Explanation */}
              {exercise.explanation && (
                <div className="bg-sky-50 border-2 border-sky-300 rounded-lg p-4">
                  <p className="text-sky-700 font-medium">
                    📚 {exercise.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Continue Button */}
            <div className="mt-8">
              <button
                onClick={handleContinue}
                className={`w-full px-8 py-4 text-white rounded-lg transition-colors text-lg font-semibold shadow-lg hover:shadow-xl ${
                  cardState === "correct"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-persian-red-500 hover:bg-persian-red-600"
                }`}
              >
                Continue <span className="btn-arrow">→</span> <span className="text-sm opacity-75">[Enter]</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
