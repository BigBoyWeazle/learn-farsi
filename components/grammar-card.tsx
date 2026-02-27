"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
                  className={`p-4 rounded-xl backdrop-blur-lg text-lg font-medium transition-all ring-1 ${
                    selectedOption === option
                      ? "border border-persian-red-500/60 bg-persian-red-50/50 text-persian-red-700 ring-persian-red-300/30"
                      : "border border-persian-beige-300/40 hover:border-persian-red-300/50 text-persian-red-600 bg-white/30 ring-white/20"
                  } ${cardState !== "question" ? "cursor-default" : "cursor-pointer"}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {selectedOption && cardState === "question" && (
              <button
                onClick={handleSubmit}
                className="w-full mt-6 px-8 py-4 bg-persian-red-500/90 backdrop-blur-lg text-white rounded-xl hover:bg-persian-red-600 transition-all text-lg font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-xl border border-persian-red-600/50 ring-1 ring-white/10"
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
              className="w-full px-6 py-4 text-lg bg-white/50 backdrop-blur-lg border border-persian-red-300/40 rounded-xl focus:border-persian-red-500/60 focus:outline-none focus:ring-2 focus:ring-persian-red-300/30 transition-all text-persian-red-700 placeholder:text-persian-red-400 ring-1 ring-white/20"
              autoFocus
              autoComplete="off"
              disabled={cardState !== "question"}
            />

            {cardState === "question" && (
              <button
                type="submit"
                disabled={!userAnswer.trim()}
                className="w-full px-8 py-4 bg-persian-red-500/90 backdrop-blur-lg text-white rounded-xl hover:bg-persian-red-600 disabled:bg-persian-beige-300/50 disabled:text-persian-red-400 disabled:cursor-not-allowed transition-all text-lg font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-xl border border-persian-red-600/50 ring-1 ring-white/10"
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
        <div className="w-full bg-persian-beige-200/50 backdrop-blur-lg rounded-full h-3 border border-persian-red-300/40 ring-1 ring-white/20">
          <div
            className="bg-persian-red-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <div
        className={`bg-white/40 backdrop-blur-lg border border-persian-red-400/40 shadow-[0_8px_32px_rgba(0,0,0,0.1)] rounded-2xl p-12 min-h-[450px] flex flex-col justify-between transition-all duration-300 ring-1 ring-white/20`}
      >
        {cardState === "question" ? (
          /* Question State */
          <div className="flex-1 flex flex-col justify-center">
            {/* Exercise Type Badge */}
            <div className="flex justify-center mb-6">
              <span className="px-4 py-2 bg-persian-beige-100/50 backdrop-blur-lg text-persian-red-700 rounded-full text-sm font-bold border border-persian-red-200/40 ring-1 ring-white/20">
                {exercise.exerciseType === "multiple_choice" && "🔘 Multiple Choice"}
                {exercise.exerciseType === "fill_blank" && <><span className="inline-block w-5 h-5 overflow-hidden align-middle"><Image src="/pencilicon.png" alt="Pencil" width={40} height={40} className="w-full h-full object-cover scale-125" /></span> Fill in the Blank</>}
                {exercise.exerciseType === "conjugation" && "🔤 Conjugation"}
                {exercise.exerciseType === "translate" && "🌐 Translation"}
              </span>
            </div>

            {renderExercise()}

            {/* Hint Button */}
            {exercise.hint && cardState === "question" && (
              <div className="mt-6 text-center">
                {showHint ? (
                  <div className="bg-amber-50/50 backdrop-blur-lg border border-amber-300/50 rounded-xl p-4 ring-1 ring-white/20">
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
              <div className="text-center space-y-3 p-6 bg-persian-beige-100/50 backdrop-blur-lg rounded-xl border border-persian-red-200/40 ring-1 ring-white/20">
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
                <div className="bg-sky-50/50 backdrop-blur-lg border border-sky-300/50 rounded-xl p-4 ring-1 ring-white/20">
                  <p className="text-sky-700 font-medium">
                    <span className="inline-block w-5 h-5 overflow-hidden align-middle"><Image src="/multiplebooks_icon.png" alt="Books" width={40} height={40} className="w-full h-full object-cover scale-125" /></span> {exercise.explanation}
                  </p>
                </div>
              )}
            </div>

            {/* Continue Button */}
            <div className="mt-8">
              <button
                onClick={handleContinue}
                className={`w-full px-8 py-4 text-white rounded-xl transition-all text-lg font-semibold shadow-[0_8px_32px_rgba(0,0,0,0.12)] hover:shadow-xl backdrop-blur-lg border ring-1 ring-white/10 ${
                  cardState === "correct"
                    ? "bg-emerald-500/90 hover:bg-emerald-600 border-emerald-600/50"
                    : "bg-persian-red-500/90 hover:bg-persian-red-600 border-persian-red-600/50"
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
