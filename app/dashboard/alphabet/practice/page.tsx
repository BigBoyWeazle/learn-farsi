"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { persianAlphabet, type PersianLetter } from "@/lib/alphabet-data";

type PracticeMode = "letter-to-name" | "name-to-letter";

interface SessionStats {
  correct: number;
  incorrect: number;
  total: number;
}

const STORAGE_KEY = "alphabetPracticeProgress";

interface AlphabetProgress {
  [letter: string]: {
    correct: number;
    incorrect: number;
    lastPracticed: string;
  };
}

function getProgress(): AlphabetProgress {
  if (typeof window === "undefined") return {};
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : {};
}

function saveProgress(progress: AlphabetProgress): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export default function AlphabetPracticePage() {
  const [mode, setMode] = useState<PracticeMode>("letter-to-name");
  const [currentLetter, setCurrentLetter] = useState<PersianLetter | null>(null);
  const [options, setOptions] = useState<PersianLetter[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [sessionStats, setSessionStats] = useState<SessionStats>({ correct: 0, incorrect: 0, total: 0 });
  const [showResult, setShowResult] = useState(false);
  const [sessionComplete, setSessionComplete] = useState(false);

  const SESSION_SIZE = 10;

  const generateQuestion = useCallback(() => {
    // Pick a random letter
    const randomIndex = Math.floor(Math.random() * persianAlphabet.length);
    const letter = persianAlphabet[randomIndex];
    setCurrentLetter(letter);

    // Generate 4 options including the correct one
    const otherLetters = persianAlphabet.filter((l) => l.letter !== letter.letter);
    const shuffledOthers = otherLetters.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [...shuffledOthers, letter].sort(() => Math.random() - 0.5);
    setOptions(allOptions);

    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowResult(false);
  }, []);

  useEffect(() => {
    generateQuestion();
  }, [generateQuestion]);

  const handleAnswer = (answer: PersianLetter) => {
    if (showResult) return;

    const correct = mode === "letter-to-name"
      ? answer.letter === currentLetter?.letter
      : answer.letter === currentLetter?.letter;

    setSelectedAnswer(answer.letter);
    setIsCorrect(correct);
    setShowResult(true);

    // Update session stats
    const newStats = {
      correct: sessionStats.correct + (correct ? 1 : 0),
      incorrect: sessionStats.incorrect + (correct ? 0 : 1),
      total: sessionStats.total + 1,
    };
    setSessionStats(newStats);

    // Save progress to localStorage
    if (currentLetter) {
      const progress = getProgress();
      if (!progress[currentLetter.letter]) {
        progress[currentLetter.letter] = { correct: 0, incorrect: 0, lastPracticed: "" };
      }
      progress[currentLetter.letter].correct += correct ? 1 : 0;
      progress[currentLetter.letter].incorrect += correct ? 0 : 1;
      progress[currentLetter.letter].lastPracticed = new Date().toISOString();
      saveProgress(progress);
    }

    // Check if session is complete
    if (newStats.total >= SESSION_SIZE) {
      setTimeout(() => setSessionComplete(true), 1500);
    }
  };

  const nextQuestion = () => {
    if (sessionStats.total >= SESSION_SIZE) {
      setSessionComplete(true);
    } else {
      generateQuestion();
    }
  };

  const startNewSession = () => {
    setSessionStats({ correct: 0, incorrect: 0, total: 0 });
    setSessionComplete(false);
    generateQuestion();
  };

  const toggleMode = () => {
    setMode(mode === "letter-to-name" ? "name-to-letter" : "letter-to-name");
    generateQuestion();
  };

  if (sessionComplete) {
    const accuracy = Math.round((sessionStats.correct / sessionStats.total) * 100);
    return (
      <div className="min-h-screen bg-persian-beige-200 dark:bg-[#654321] py-8 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
            <div className="text-6xl mb-4">
              {accuracy >= 80 ? "🎉" : accuracy >= 60 ? "👍" : "💪"}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Practice Complete!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You practiced {SESSION_SIZE} letters
            </p>

            <div className="bg-persian-beige-50 dark:bg-gray-700 rounded-xl p-6 mb-6">
              <div className="text-4xl font-bold text-persian-red-600 dark:text-persian-gold-400 mb-2">
                {accuracy}%
              </div>
              <p className="text-gray-600 dark:text-gray-300">Accuracy</p>

              <div className="flex justify-center gap-8 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{sessionStats.correct}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Correct</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{sessionStats.incorrect}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Incorrect</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={startNewSession}
                className="w-full bg-persian-red-600 hover:bg-persian-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Practice Again
              </button>
              <Link
                href="/dashboard/alphabet"
                className="block w-full bg-persian-beige-100 dark:bg-gray-700 hover:bg-persian-beige-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                View All Letters
              </Link>
              <Link
                href="/dashboard"
                className="block text-persian-red-600 dark:text-persian-gold-400 hover:underline py-2"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-persian-beige-200 dark:bg-[#654321] py-8 px-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-persian-red-700 dark:text-persian-gold-400 mb-2">
            Alphabet Practice
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {mode === "letter-to-name"
              ? "What is the name of this letter?"
              : "Which letter is this?"}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span>{sessionStats.total} of {SESSION_SIZE}</span>
            <span>{sessionStats.correct} correct</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-persian-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(sessionStats.total / SESSION_SIZE) * 100}%` }}
            />
          </div>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleMode}
            className="text-sm text-persian-red-600 dark:text-persian-gold-400 hover:underline"
          >
            Switch to: {mode === "letter-to-name" ? "Name → Letter" : "Letter → Name"}
          </button>
        </div>

        {/* Question Card */}
        {currentLetter && (
          <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6 transition-all duration-300 ${
            showResult && isCorrect ? "ring-4 ring-green-400 animate-pulse" : ""
          } ${
            showResult && !isCorrect ? "ring-4 ring-red-400 animate-shake" : ""
          }`}>
            {mode === "letter-to-name" ? (
              // Show letter, user guesses name
              <div className="text-center">
                <span className="text-8xl font-bold text-gray-900 dark:text-white block mb-4">
                  {currentLetter.letter}
                </span>
                <p className="text-gray-500 dark:text-gray-400">
                  Select the correct name
                </p>
              </div>
            ) : (
              // Show name, user guesses letter
              <div className="text-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white block mb-2">
                  {currentLetter.name}
                </span>
                <span className="text-xl text-gray-500 dark:text-gray-400 font-mono">
                  /{currentLetter.transliteration}/
                </span>
                <p className="text-gray-500 dark:text-gray-400 mt-4">
                  Select the correct letter
                </p>
              </div>
            )}
          </div>
        )}

        {/* Answer Options */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {options.map((option) => {
            const isSelected = selectedAnswer === option.letter;
            const isCorrectAnswer = option.letter === currentLetter?.letter;

            let buttonClass = "bg-white dark:bg-gray-800 hover:bg-persian-beige-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white";

            if (showResult) {
              if (isCorrectAnswer) {
                buttonClass = "bg-green-500 text-white";
              } else if (isSelected && !isCorrect) {
                buttonClass = "bg-red-500 text-white";
              } else {
                buttonClass = "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500";
              }
            }

            return (
              <button
                key={option.letter}
                onClick={() => handleAnswer(option)}
                disabled={showResult}
                className={`p-4 rounded-xl shadow-md transition-all duration-200 ${buttonClass} ${
                  !showResult ? "hover:scale-105" : ""
                }`}
              >
                {mode === "letter-to-name" ? (
                  <div className="text-center">
                    <span className="text-lg font-semibold block">{option.name}</span>
                    <span className="text-sm opacity-70 font-mono">/{option.transliteration}/</span>
                  </div>
                ) : (
                  <span className="text-4xl font-bold block">{option.letter}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Result & Continue */}
        {showResult && (
          <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300">
            {isCorrect ? (
              <div className="mb-4">
                <span className="text-2xl">✅</span>
                <p className="text-green-600 dark:text-green-400 font-semibold">Correct!</p>
              </div>
            ) : (
              <div className="mb-4">
                <span className="text-2xl">❌</span>
                <p className="text-red-500 font-semibold">
                  The correct answer was: {currentLetter?.name} ({currentLetter?.letter})
                </p>
              </div>
            )}

            {/* Show example word */}
            {currentLetter && (
              <div className="bg-persian-beige-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Example:</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white" dir="rtl">
                  {currentLetter.example.word}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  <span className="font-mono text-persian-red-600 dark:text-persian-gold-400">
                    {currentLetter.example.phonetic}
                  </span>
                  {" - "}
                  {currentLetter.example.meaning}
                </p>
              </div>
            )}

            <button
              onClick={nextQuestion}
              className="w-full bg-persian-red-600 hover:bg-persian-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {sessionStats.total >= SESSION_SIZE ? "See Results" : "Next Letter"}
            </button>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-6">
          <Link
            href="/dashboard/alphabet"
            className="text-persian-red-600 dark:text-persian-gold-400 hover:underline text-sm"
          >
            Back to Alphabet Overview
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}
