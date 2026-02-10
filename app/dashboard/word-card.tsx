"use client";

import type { Vocabulary } from "@/db/schema";
import { useState } from "react";

interface WordCardProps {
  word: Vocabulary;
}

export default function WordCard({ word }: WordCardProps) {
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <div className="bg-white border-3 border-persian-red-500 shadow-xl rounded-lg p-4 hover:shadow-2xl hover:border-persian-red-600 transition-all">
      <div className="space-y-3">
        {/* Phonetic Word + Farsi Script - Always visible */}
        <div className="text-center">
          <div className="text-2xl font-bold text-persian-red-500 capitalize">
            {word.phonetic || word.farsiWord}
          </div>
          {word.farsiWord && word.phonetic && (
            <div className="text-2xl text-persian-red-700 mt-1" style={{ direction: "rtl", fontFamily: "serif" }}>
              {word.farsiWord}
            </div>
          )}
          {word.isFormal && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-300">
              Formal
            </span>
          )}
        </div>

        {/* Translation reveal button */}
        <div className="border-t border-persian-red-200 pt-3">
          {!showTranslation ? (
            <button
              onClick={() => setShowTranslation(true)}
              className="w-full py-2 px-3 bg-persian-red-500 text-white rounded-lg hover:bg-persian-red-600 transition-colors text-sm font-semibold shadow-md"
            >
              Show Translation
            </button>
          ) : (
            <div className="space-y-2">
              {/* English translation */}
              <div className="text-center">
                <div className="text-base font-semibold text-persian-red-500">
                  {word.englishTranslation}
                </div>
              </div>

              {/* Example sentences if available */}
              {word.exampleFarsi && word.exampleEnglish && (
                <div className="mt-2 pt-2 border-t border-persian-red-200 space-y-1">
                  <div className="text-xs text-persian-red-700 font-semibold mb-1">
                    Example:
                  </div>
                  <div className="text-xs">
                    <div
                      className="text-persian-red-700 font-medium"
                      style={{ direction: "rtl" }}
                    >
                      {word.exampleFarsi}
                    </div>
                    {word.examplePhonetic && (
                      <div className="text-persian-red-600 italic text-xs mt-0.5">
                        ({word.examplePhonetic})
                      </div>
                    )}
                    <div className="text-persian-red-700 italic mt-0.5">
                      {word.exampleEnglish}
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowTranslation(false)}
                className="w-full py-2 px-3 bg-persian-beige-200 text-persian-red-500 rounded-lg hover:bg-persian-beige-300 transition-colors text-sm font-semibold border border-persian-red-500"
              >
                Hide Translation
              </button>
            </div>
          )}
        </div>

        {/* Difficulty indicator - Fun colorful badges */}
        {word.difficultyLevel && (
          <div className="flex justify-center">
            <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
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
    </div>
  );
}
